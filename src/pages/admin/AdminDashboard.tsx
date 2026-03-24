import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppDb } from '@/contexts/DataContext';
import { Users, GraduationCap, Library, BookOpen } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { MOCK_USERS, MOCK_STUDENTS, MOCK_TEACHERS, MOCK_COURSES, MOCK_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_ATTENDANCE } = useAppDb();

  const stats = [
    { label: 'Students', value: MOCK_STUDENTS.length, icon: <Users className="w-6 h-6" />, color: 'hsl(215 60% 50%)' },
    { label: 'Teachers', value: MOCK_TEACHERS.length, icon: <GraduationCap className="w-6 h-6" />, color: 'hsl(162 63% 41%)' },
    { label: 'Courses', value: MOCK_COURSES.length, icon: <Library className="w-6 h-6" />, color: 'hsl(280 55% 55%)' },
    { label: 'Subjects', value: MOCK_SUBJECTS.length, icon: <BookOpen className="w-6 h-6" />, color: 'hsl(45 90% 55%)' },
  ];

  const present = MOCK_ATTENDANCE.filter(a => a.status === 'present').length;
  const absent = MOCK_ATTENDANCE.filter(a => a.status === 'absent').length;
  const late = MOCK_ATTENDANCE.filter(a => a.status === 'late').length;

  const pieData = [
    { name: 'Present', value: present, color: 'hsl(162 63% 41%)' },
    { name: 'Absent', value: absent, color: 'hsl(0 72% 51%)' },
    { name: 'Late', value: late, color: 'hsl(45 90% 55%)' },
  ];

  const deptData = [
    { dept: 'Engineering', students: MOCK_STUDENTS.filter(s => s.department === 'Engineering').length },
    { dept: 'Management', students: MOCK_STUDENTS.filter(s => s.department === 'Management').length },
  ];

  return (
    <DashboardLayout>
      <h1 className="page-title mb-6">Admin Dashboard</h1>

      {/* Stats */}
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h2 className="section-title mb-4">Attendance Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={4}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                <span className="text-muted-foreground">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-card">
          <h2 className="section-title mb-4">Students by Department</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deptData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="dept" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="students" fill="hsl(215 60% 50%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Students */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="section-title">Recent Students</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="table-header-cell">Student ID</th>
                <th className="table-header-cell">Name</th>
                <th className="table-header-cell">Department</th>
                <th className="table-header-cell">Course</th>
                <th className="table-header-cell">Semester</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_STUDENTS.map(s => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="table-cell font-mono text-xs">{s.studentId}</td>
                  <td className="table-cell font-medium">{s.name}</td>
                  <td className="table-cell text-muted-foreground">{s.department}</td>
                  <td className="table-cell text-muted-foreground">{s.course}</td>
                  <td className="table-cell">{s.semester}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
