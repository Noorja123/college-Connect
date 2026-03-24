import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDb } from '@/contexts/DataContext';
import { Plus, X, FileText, CheckCircle } from 'lucide-react';

const TeacherAssignments: React.FC = () => {
  const { user } = useAuth();
  const teacher = MOCK_TEACHERS.find(t => t.userId === user?.id);
  const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS.filter(a => a.teacherName === user?.name));
  const [submissions] = useState(MOCK_SUBMISSIONS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', subject: '', dueDate: '', totalMarks: 100 });
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [gradeForm, setGradeForm] = useState({ grade: 0, feedback: '' });

  const handleCreate = (e: React.FormEvent) => {
  const { MOCK_USERS, MOCK_STUDENTS, MOCK_TEACHERS, MOCK_COURSES, MOCK_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_ATTENDANCE } = useAppDb();
    e.preventDefault();
    const newAssignment: typeof assignments[0] = {
      id: `a${Date.now()}`,
      ...form,
      teacherName: user?.name || '',
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAssignments([...assignments, newAssignment]);
    setForm({ title: '', description: '', subject: '', dueDate: '', totalMarks: 100 });
    setShowForm(false);
  };

  const getSubmissionsForAssignment = (assignmentId: string) => {
  const { MOCK_USERS, MOCK_STUDENTS, MOCK_TEACHERS, MOCK_COURSES, MOCK_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_ATTENDANCE } = useAppDb();
    return submissions.filter(s => s.assignmentId === assignmentId);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Assignments</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Create Assignment'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-card rounded-xl shadow-card p-6 mb-6">
          <h2 className="section-title mb-4">New Assignment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><label className="block text-sm font-medium text-foreground mb-1.5">Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" required /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-foreground mb-1.5">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field" rows={3} required /></div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
              <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="input-field" required>
                <option value="">Select</option>
                {teacher?.subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Due Date</label><input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Total Marks</label><input type="number" value={form.totalMarks} onChange={e => setForm({ ...form, totalMarks: +e.target.value })} className="input-field" /></div>
            <div className="flex items-end"><button type="submit" className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-accent text-accent-foreground hover:opacity-90 transition-opacity">Create</button></div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {assignments.map(a => {
          const subs = getSubmissionsForAssignment(a.id);
          return (
            <div key={a.id} className="bg-card rounded-xl shadow-card p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{a.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
                </div>
                <span className="badge-active">{a.subject}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span>Due: {a.dueDate}</span>
                <span>Marks: {a.totalMarks}</span>
                <span>{subs.length} submissions</span>
              </div>

              {subs.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-medium text-foreground mb-3">Submissions</h4>
                  <div className="space-y-2">
                    {subs.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="text-sm font-medium text-foreground">{s.studentName}</p>
                          <p className="text-xs text-muted-foreground">Submitted: {s.submittedAt}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {s.status === 'graded' ? (
                            <span className="badge-graded flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> {s.grade}/{a.totalMarks}
                            </span>
                          ) : (
                            <span className="badge-submitted">{s.status}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default TeacherAssignments;
