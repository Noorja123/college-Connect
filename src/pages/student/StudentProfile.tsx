import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDb } from '@/contexts/DataContext';
import { User, Mail, BookOpen, Building2, Calendar, Hash, Pencil, Save, X } from 'lucide-react';

const StudentProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const student = MOCK_STUDENTS.find(s => s.userId === user?.id);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');

  if (!student) {
    return <DashboardLayout><p className="text-muted-foreground">Profile not found.</p></DashboardLayout>;
  }

  const handleSave = () => {
  const { MOCK_USERS, MOCK_STUDENTS, MOCK_TEACHERS, MOCK_COURSES, MOCK_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_ATTENDANCE } = useAppDb();
    updateProfile({ name: editName, email: editEmail });
    // Also update mock student
    student.name = editName;
    student.email = editEmail;
    setEditing(false);
  };

  const handleCancel = () => {
  const { MOCK_USERS, MOCK_STUDENTS, MOCK_TEACHERS, MOCK_COURSES, MOCK_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_ATTENDANCE } = useAppDb();
    setEditName(user?.name || '');
    setEditEmail(user?.email || '');
    setEditing(false);
  };

  const fields = [
    { label: 'Student ID', value: student.studentId, icon: <Hash className="w-5 h-5" /> },
    { label: 'Department', value: student.department, icon: <Building2 className="w-5 h-5" /> },
    { label: 'Course', value: student.course, icon: <BookOpen className="w-5 h-5" /> },
    { label: 'Semester', value: String(student.semester), icon: <Calendar className="w-5 h-5" /> },
  ];

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">My Profile</h1>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            <Pencil className="w-4 h-4" /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-accent text-accent-foreground hover:opacity-90 transition-opacity">
              <Save className="w-4 h-4" /> Save
            </button>
            <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border border-border text-foreground hover:bg-muted transition-colors">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        )}
      </div>

      <div className="bg-card rounded-xl shadow-card p-8 max-w-2xl">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
            {(editing ? editName : user?.name)?.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{editing ? editName : user?.name}</h2>
            <p className="text-sm text-muted-foreground capitalize">{user?.role} — {student.studentId}</p>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="text-muted-foreground"><User className="w-5 h-5" /></div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Full Name</p>
              {editing ? (
                <input value={editName} onChange={e => setEditName(e.target.value)} className="input-field mt-1" />
              ) : (
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="text-muted-foreground"><Mail className="w-5 h-5" /></div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
              {editing ? (
                <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} className="input-field mt-1" />
              ) : (
                <p className="text-sm font-medium text-foreground">{user?.email}</p>
              )}
            </div>
          </div>

          {fields.map(f => (
            <div key={f.label} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="text-muted-foreground">{f.icon}</div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{f.label}</p>
                <p className="text-sm font-medium text-foreground">{f.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
