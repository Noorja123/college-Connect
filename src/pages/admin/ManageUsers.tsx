import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppDb } from '@/contexts/DataContext';
import { Plus, X, Trash2, UserPlus, CheckCircle } from 'lucide-react';
import type { UserRole } from '@/types/models';

const ManageUsers: React.FC = () => {
  const { MOCK_USERS, MOCK_STUDENTS, MOCK_TEACHERS, MOCK_COURSES, MOCK_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_ATTENDANCE } = useAppDb();

  const { createUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' as UserRole });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [, forceUpdate] = useState(0);

  const users = MOCK_USERS.map(({ password, ...u }) => u);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    const result = createUser(form.name, form.email, form.password, form.role);
    if (result.success) {
      setSuccess(`User "${form.name}" created as ${form.role}`);
      setForm({ name: '', email: '', password: '', role: 'student' });
      setShowForm(false);
      forceUpdate(n => n + 1);
    } else {
      setError(result.error || 'Failed to create user');
    }
  };

  const handleDelete = (id: string) => {
    const idx = MOCK_USERS.findIndex(u => u.id === id);
    if (idx !== -1) {
      MOCK_USERS.splice(idx, 1);
      forceUpdate(n => n + 1);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Manage Users</h1>
        <button onClick={() => { setShowForm(!showForm); setSuccess(''); setError(''); }} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
          {showForm ? <X className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Create User'}
        </button>
      </div>

      {success && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm flex items-center gap-2 bg-accent/10 text-accent">
          <CheckCircle className="w-4 h-4" /> {success}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-card rounded-xl shadow-card p-6 mb-6">
          <h2 className="section-title mb-4">Create New User</h2>
          {error && <div className="mb-4 px-4 py-3 rounded-lg text-sm bg-destructive/10 text-destructive">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Password</label><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input-field" placeholder="Min 6 characters" required /></div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Role</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as UserRole })} className="input-field">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-accent text-accent-foreground hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" /> Create User
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="table-header-cell">Name</th>
                <th className="table-header-cell">Email</th>
                <th className="table-header-cell">Role</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="table-cell font-medium">{u.name}</td>
                  <td className="table-cell text-muted-foreground">{u.email}</td>
                  <td className="table-cell">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      u.role === 'admin' ? 'bg-destructive/10 text-destructive' :
                      u.role === 'teacher' ? 'bg-primary/10 text-primary' :
                      'bg-accent/10 text-accent'
                    }`}>{u.role}</span>
                  </td>
                  <td className="table-cell">
                    <button onClick={() => handleDelete(u.id)} className="text-destructive hover:underline text-sm flex items-center gap-1">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
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

export default ManageUsers;
