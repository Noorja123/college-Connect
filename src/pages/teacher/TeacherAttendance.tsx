import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDb } from '@/contexts/DataContext';

const TeacherAttendance: React.FC = () => {
  const { user } = useAuth();
  const teacher = MOCK_TEACHERS.find(t => t.userId === user?.id);
  const subjects = MOCK_SUBJECTS.filter(s => teacher?.subjects.includes(s.name));

  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const studentsForSubject = MOCK_STUDENTS.filter(s => {
    const sub = MOCK_SUBJECTS.find(su => su.name === selectedSubject);
    return sub && s.course === sub.courseName;
  });

  const handleSave = () => {
  const { MOCK_USERS, MOCK_STUDENTS, MOCK_TEACHERS, MOCK_COURSES, MOCK_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_ATTENDANCE } = useAppDb();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <h1 className="page-title mb-6">Mark Attendance</h1>

      <div className="bg-card rounded-xl shadow-card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
            <select value={selectedSubject} onChange={e => { setSelectedSubject(e.target.value); setRecords({}); }} className="input-field">
              <option value="">Select Subject</option>
              {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Date</label>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="input-field" />
          </div>
          <div className="flex items-end">
            <button onClick={handleSave} disabled={!selectedSubject || studentsForSubject.length === 0} className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-accent text-accent-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
              Save Attendance
            </button>
          </div>
        </div>
      </div>

      {saved && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm badge-present">
          ✅ Attendance saved successfully for {selectedDate}
        </div>
      )}

      {selectedSubject && studentsForSubject.length > 0 && (
        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="table-header-cell">Student ID</th>
                  <th className="table-header-cell">Name</th>
                  <th className="table-header-cell">Status</th>
                </tr>
              </thead>
              <tbody>
                {studentsForSubject.map(s => (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="table-cell font-mono text-xs">{s.studentId}</td>
                    <td className="table-cell font-medium">{s.name}</td>
                    <td className="table-cell">
                      <select
                        value={records[s.id] || 'present'}
                        onChange={e => setRecords({ ...records, [s.id]: e.target.value })}
                        className="input-field w-auto"
                      >
                        <option value="present">✅ Present</option>
                        <option value="absent">❌ Absent</option>
                        <option value="late">⏰ Late</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedSubject && studentsForSubject.length === 0 && (
        <div className="bg-card rounded-xl shadow-card p-12 text-center text-muted-foreground">
          No students found for this subject.
        </div>
      )}
    </DashboardLayout>
  );
};

export default TeacherAttendance;
