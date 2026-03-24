import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDb } from '@/contexts/DataContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const StudentAttendance: React.FC = () => {
  const { MOCK_USERS, MOCK_STUDENTS, MOCK_TEACHERS, MOCK_COURSES, MOCK_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_ATTENDANCE } = useAppDb();

  const { user } = useAuth();
  const student = MOCK_STUDENTS.find(s => s.userId === user?.id);
  const myAttendance = MOCK_ATTENDANCE.filter(a => a.studentId === student?.id);

  const present = myAttendance.filter(a => a.status === 'present').length;
  const absent = myAttendance.filter(a => a.status === 'absent').length;
  const late = myAttendance.filter(a => a.status === 'late').length;
  const total = myAttendance.length;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  const pieData = [
    { name: 'Present', value: present, color: 'hsl(162 63% 41%)' },
    { name: 'Absent', value: absent, color: 'hsl(0 72% 51%)' },
    { name: 'Late', value: late, color: 'hsl(45 90% 55%)' },
  ];

  // Group by subject
  const subjects = [...new Set(myAttendance.map(a => a.subject))];
  const subjectStats = subjects.map(sub => {
    const records = myAttendance.filter(a => a.subject === sub);
    const p = records.filter(a => a.status === 'present').length;
    return { subject: sub, total: records.length, present: p, percentage: Math.round((p / records.length) * 100) };
  });

  return (
    <DashboardLayout>
      <h1 className="page-title mb-6">My Attendance</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'hsl(162 63% 41% / 0.12)', color: 'hsl(162 63% 35%)' }}>✅</div>
          <div><p className="text-sm text-muted-foreground">Present</p><p className="text-2xl font-bold text-foreground">{present}</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'hsl(0 72% 51% / 0.12)', color: 'hsl(0 72% 45%)' }}>❌</div>
          <div><p className="text-sm text-muted-foreground">Total Classes</p><p className="text-2xl font-bold text-foreground">{total}</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: percentage >= 75 ? 'hsl(162 63% 41% / 0.12)' : 'hsl(0 72% 51% / 0.12)', color: percentage >= 75 ? 'hsl(162 63% 35%)' : 'hsl(0 72% 45%)' }}>📊</div>
          <div><p className="text-sm text-muted-foreground">Percentage</p><p className="text-2xl font-bold" style={{ color: percentage >= 75 ? 'hsl(162 63% 35%)' : 'hsl(0 72% 45%)' }}>{percentage}%</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie chart */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h2 className="section-title mb-4">Attendance Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={4}>
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-muted-foreground">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* By subject */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h2 className="section-title mb-4">By Subject</h2>
          <div className="space-y-4">
            {subjectStats.map(s => (
              <div key={s.subject}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-medium text-foreground">{s.subject}</span>
                  <span className="text-sm font-bold" style={{ color: s.percentage >= 75 ? 'hsl(162 63% 35%)' : 'hsl(0 72% 45%)' }}>{s.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${s.percentage}%`, background: s.percentage >= 75 ? 'hsl(162 63% 41%)' : 'hsl(0 72% 51%)' }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{s.present}/{s.total} classes</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Records table */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-border"><h2 className="section-title">Attendance Records</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="table-header-cell">Date</th>
                <th className="table-header-cell">Subject</th>
                <th className="table-header-cell">Status</th>
              </tr>
            </thead>
            <tbody>
              {myAttendance.map(r => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="table-cell">{r.date}</td>
                  <td className="table-cell">{r.subject}</td>
                  <td className="table-cell">
                    <span className={r.status === 'present' ? 'badge-present' : r.status === 'absent' ? 'badge-absent' : 'badge-late'}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentAttendance;
