import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDb } from '@/contexts/DataContext';
import { BookOpen, FileText, Users, ClipboardCheck } from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const { MOCK_USERS, MOCK_STUDENTS, MOCK_TEACHERS, MOCK_COURSES, MOCK_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_ATTENDANCE } = useAppDb();

  const { user } = useAuth();
  const teacher = MOCK_TEACHERS.find(t => t.userId === user?.id);

  const myAssignments = MOCK_ASSIGNMENTS.filter(a => a.teacherName === user?.name);
  const mySubmissions = MOCK_SUBMISSIONS.filter(s => myAssignments.some(a => a.id === s.assignmentId));
  const pendingGrading = mySubmissions.filter(s => s.grade === null).length;

  const stats = [
    { label: 'My Subjects', value: teacher?.subjects.length || 0, icon: <BookOpen className="w-6 h-6" />, color: 'hsl(215 60% 50%)' },
    { label: 'Assignments', value: myAssignments.length, icon: <FileText className="w-6 h-6" />, color: 'hsl(162 63% 41%)' },
    { label: 'Submissions', value: mySubmissions.length, icon: <ClipboardCheck className="w-6 h-6" />, color: 'hsl(280 55% 55%)' },
    { label: 'Pending Grading', value: pendingGrading, icon: <Users className="w-6 h-6" />, color: 'hsl(45 90% 55%)' },
  ];

  return (
    <DashboardLayout>
      <h1 className="page-title mb-1">Welcome, {user?.name}</h1>
      <p className="text-muted-foreground mb-6">Teacher Dashboard — {teacher?.department}</p>

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

      {/* My Subjects */}
      <div className="bg-card rounded-xl shadow-card p-6 mb-6">
        <h2 className="section-title mb-4">My Subjects</h2>
        <div className="flex flex-wrap gap-2">
          {teacher?.subjects.map(sub => (
            <span key={sub} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/10 text-primary">
              {sub}
            </span>
          ))}
        </div>
      </div>

      {/* Recent Assignments */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="section-title">My Assignments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="table-header-cell">Title</th>
                <th className="table-header-cell">Subject</th>
                <th className="table-header-cell">Due Date</th>
                <th className="table-header-cell">Marks</th>
              </tr>
            </thead>
            <tbody>
              {myAssignments.map(a => (
                <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="table-cell font-medium">{a.title}</td>
                  <td className="table-cell text-muted-foreground">{a.subject}</td>
                  <td className="table-cell text-muted-foreground">{a.dueDate}</td>
                  <td className="table-cell">{a.totalMarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
