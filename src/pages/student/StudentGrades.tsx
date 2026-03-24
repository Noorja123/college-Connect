import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDb } from '@/contexts/DataContext';

const StudentGrades: React.FC = () => {
  const { MOCK_USERS, MOCK_STUDENTS, MOCK_TEACHERS, MOCK_COURSES, MOCK_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_ATTENDANCE } = useAppDb();
  const { user } = useAuth();
  const student = MOCK_STUDENTS.find(s => s.userId === user?.id);
  const myGrades = MOCK_SUBMISSIONS.filter(s => s.studentId === student?.id && s.status === 'graded');

  return (
    <DashboardLayout>
      <h1 className="page-title mb-6">My Grades</h1>

      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="table-header-cell">Assignment</th>
                <th className="table-header-cell">Subject</th>
                <th className="table-header-cell">Grade</th>
                <th className="table-header-cell">Percentage</th>
                <th className="table-header-cell">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {myGrades.map(s => {
                const assignment = MOCK_ASSIGNMENTS.find(a => a.id === s.assignmentId);
                const pct = Math.round(((s.grade || 0) / (assignment?.totalMarks || 100)) * 100);
                return (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="table-cell font-medium">{s.assignmentTitle}</td>
                    <td className="table-cell text-muted-foreground">{assignment?.subject}</td>
                    <td className="table-cell">
                      <span className="text-lg font-bold" style={{ color: pct >= 50 ? 'hsl(162 63% 35%)' : 'hsl(0 72% 45%)' }}>
                        {s.grade}/{assignment?.totalMarks}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span style={{ color: pct >= 50 ? 'hsl(162 63% 35%)' : 'hsl(0 72% 45%)' }}>{pct}%</span>
                    </td>
                    <td className="table-cell text-muted-foreground text-sm">{s.feedback || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {myGrades.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No graded submissions yet.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentGrades;
