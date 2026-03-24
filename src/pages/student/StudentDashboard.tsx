import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDb } from '@/contexts/DataContext';
import { ClipboardCheck, FileText, Award, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const StudentDashboard: React.FC = () => {
  const { MOCK_USERS, MOCK_STUDENTS, MOCK_TEACHERS, MOCK_COURSES, MOCK_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_ATTENDANCE } = useAppDb();

  const { user } = useAuth();
  const student = MOCK_STUDENTS.find(s => s.userId === user?.id);

  const myAttendance = MOCK_ATTENDANCE.filter(a => a.studentId === student?.id);
  const present = myAttendance.filter(a => a.status === 'present').length;
  const total = myAttendance.length;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  const mySubmissions = MOCK_SUBMISSIONS.filter(s => s.studentId === student?.id);
  const gradedCount = mySubmissions.filter(s => s.status === 'graded').length;
  const avgGrade = mySubmissions.filter(s => s.grade !== null).reduce((acc, s) => {
    const assignment = MOCK_ASSIGNMENTS.find(a => a.id === s.assignmentId);
    return acc + ((s.grade || 0) / (assignment?.totalMarks || 100)) * 100;
  }, 0) / (gradedCount || 1);

  const pendingAssignments = MOCK_ASSIGNMENTS.filter(a => {
    const hasSubmission = MOCK_SUBMISSIONS.some(s => s.assignmentId === a.id && s.studentId === student?.id);
    return !hasSubmission && a.subject === 'Data Structures' || a.subject === 'Algorithms';
  });

  const stats = [
    { label: 'Attendance', value: `${percentage}%`, icon: <ClipboardCheck className="w-6 h-6" />, color: percentage >= 75 ? 'hsl(162 63% 41%)' : 'hsl(0 72% 51%)' },
    { label: 'Submissions', value: mySubmissions.length, icon: <FileText className="w-6 h-6" />, color: 'hsl(215 60% 50%)' },
    { label: 'Graded', value: gradedCount, icon: <Award className="w-6 h-6" />, color: 'hsl(280 55% 55%)' },
    { label: 'Avg Score', value: `${Math.round(avgGrade)}%`, icon: <TrendingUp className="w-6 h-6" />, color: 'hsl(45 90% 55%)' },
  ];

  const absent = myAttendance.filter(a => a.status === 'absent').length;
  const late = myAttendance.filter(a => a.status === 'late').length;
  const pieData = [
    { name: 'Present', value: present, color: 'hsl(162 63% 41%)' },
    { name: 'Absent', value: absent, color: 'hsl(0 72% 51%)' },
    { name: 'Late', value: late, color: 'hsl(45 90% 55%)' },
  ];

  return (
    <DashboardLayout>
      <h1 className="page-title mb-1">Welcome, {user?.name}</h1>
      <p className="text-muted-foreground mb-6">{student?.course} — Semester {student?.semester}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: `${s.color}15`, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance chart */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h2 className="section-title mb-4">Attendance Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={4}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
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

        {/* Recent grades */}
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h2 className="section-title mb-4">Recent Grades</h2>
          {mySubmissions.filter(s => s.status === 'graded').length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">No graded submissions yet</p>
          ) : (
            <div className="space-y-3">
              {mySubmissions.filter(s => s.status === 'graded').map(s => {
                const assignment = MOCK_ASSIGNMENTS.find(a => a.id === s.assignmentId);
                const pct = ((s.grade || 0) / (assignment?.totalMarks || 100)) * 100;
                return (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.assignmentTitle}</p>
                      <p className="text-xs text-muted-foreground">{assignment?.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold" style={{ color: pct >= 50 ? 'hsl(162 63% 35%)' : 'hsl(0 72% 45%)' }}>
                        {s.grade}/{assignment?.totalMarks}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
