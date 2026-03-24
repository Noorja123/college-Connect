import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppDb } from '@/contexts/DataContext';
import { Plus, X, Pencil, Trash2, Save } from 'lucide-react';

const ManageTeachers: React.FC = () => {
  const [teachers, setTeachers] = useState(MOCK_TEACHERS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', department: '', subjects: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', department: '', subjects: '' });

  const handleCreate = (e: React.FormEvent) => {
  const { MOCK_USERS, MOCK_STUDENTS, MOCK_TEACHERS, MOCK_COURSES, MOCK_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_ATTENDANCE } = useAppDb();
    e.preventDefault();
    setTeachers([...teachers, {
      id: `t${Date.now()}`, userId: String(Date.now()),
      teacherId: `TCH-2024-${String(teachers.length + 1).padStart(3, '0')}`,
      name: form.name, email: form.email, department: form.department,
      subjects: form.subjects.split(',').map(s => s.trim()).filter(Boolean),
    }]);
    setForm({ name: '', email: '', department: '', subjects: '' });
    setShowForm(false);
  };

  const startEdit = (t: typeof teachers[0]) => {
  const { MOCK_USERS, MOCK_STUDENTS, MOCK_TEACHERS, MOCK_COURSES, MOCK_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_ATTENDANCE } = useAppDb();
    setEditId(t.id);
    setEditForm({ name: t.name, email: t.email, department: t.department, subjects: t.subjects.join(', ') });
  };

  const saveEdit = (id: string) => {
  const { MOCK_USERS, MOCK_STUDENTS, MOCK_TEACHERS, MOCK_COURSES, MOCK_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_ATTENDANCE } = useAppDb();
    setTeachers(teachers.map(t => t.id === id ? {
      ...t, name: editForm.name, email: editForm.email, department: editForm.department,
      subjects: editForm.subjects.split(',').map(s => s.trim()).filter(Boolean),
    } : t));
    setEditId(null);
  };

  const handleDelete = (id: string) => setTeachers(teachers.filter(t => t.id !== id));

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Manage Teachers</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Teacher'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-card rounded-xl shadow-card p-6 mb-6">
          <h2 className="section-title mb-4">Create Teacher</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Email</label><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Department</label><input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Subjects (comma-separated)</label><input value={form.subjects} onChange={e => setForm({ ...form, subjects: e.target.value })} className="input-field" placeholder="e.g. Math, Physics" /></div>
            <div className="flex items-end"><button type="submit" className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-accent text-accent-foreground hover:opacity-90 transition-opacity">Create</button></div>
          </div>
        </form>
      )}

      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="table-header-cell">Teacher ID</th>
                <th className="table-header-cell">Name</th>
                <th className="table-header-cell">Email</th>
                <th className="table-header-cell">Department</th>
                <th className="table-header-cell">Subjects</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map(t => (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="table-cell font-mono text-xs">{t.teacherId}</td>
                  {editId === t.id ? (
                    <>
                      <td className="table-cell"><input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="input-field text-sm" /></td>
                      <td className="table-cell"><input value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="input-field text-sm" /></td>
                      <td className="table-cell"><input value={editForm.department} onChange={e => setEditForm({ ...editForm, department: e.target.value })} className="input-field text-sm" /></td>
                      <td className="table-cell"><input value={editForm.subjects} onChange={e => setEditForm({ ...editForm, subjects: e.target.value })} className="input-field text-sm" /></td>
                      <td className="table-cell">
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(t.id)} className="text-accent hover:underline text-sm flex items-center gap-1"><Save className="w-3.5 h-3.5" />Save</button>
                          <button onClick={() => setEditId(null)} className="text-muted-foreground hover:underline text-sm">Cancel</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="table-cell font-medium">{t.name}</td>
                      <td className="table-cell text-muted-foreground">{t.email}</td>
                      <td className="table-cell text-muted-foreground">{t.department}</td>
                      <td className="table-cell"><div className="flex flex-wrap gap-1">{t.subjects.map(s => <span key={s} className="badge-active">{s}</span>)}</div></td>
                      <td className="table-cell">
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(t)} className="text-primary hover:underline text-sm flex items-center gap-1"><Pencil className="w-3.5 h-3.5" />Edit</button>
                          <button onClick={() => handleDelete(t.id)} className="text-destructive hover:underline text-sm flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" />Delete</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageTeachers;
