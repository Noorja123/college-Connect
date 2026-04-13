import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppDb } from '@/contexts/DataContext';
import { api, mutate } from '@/lib/api';
import { Plus, X, Pencil, Trash2, Save } from 'lucide-react';

const ManageStudents: React.FC = () => {
  const { MOCK_USERS, MOCK_STUDENTS, MOCK_TEACHERS, MOCK_COURSES, MOCK_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_ATTENDANCE } = useAppDb();

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = () => {
    setLoading(true);
    api.getStudents().then((data) => {
      setStudents(data.map((s: any) => ({ ...s, id: s._id || s.id })));
    })
    .catch(() => alert("Failed to load students data"))
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents();
  }, []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', department: '', course: '', semester: 1 });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', department: '', course: '', semester: 1 });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      userId: String(Date.now()),
      studentId: `STU-2024-${String(students.length + 1).padStart(3, '0')}`,
      ...form,
    };
    try {
      await mutate.post('students', payload);
      fetchStudents();
      setForm({ name: '', email: '', department: '', course: '', semester: 1 });
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (s: typeof students[0]) => {
    setEditId(s.id);
    setEditForm({ name: s.name, email: s.email, department: s.department, course: s.course, semester: s.semester });
  };

  const saveEdit = async (id: string) => {
    try {
      await mutate.put('students', id, editForm);
      fetchStudents();
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await mutate.delete('students', id);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Manage Students</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Student'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-card rounded-xl shadow-card p-6 mb-6">
          <h2 className="section-title mb-4">Create Student</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Email</label><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Department</label><input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Course</label>
              <select value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} className="input-field" required>
                <option value="">Select Course</option>
                {MOCK_COURSES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Semester</label><input type="number" min={1} max={8} value={form.semester} onChange={e => setForm({ ...form, semester: +e.target.value })} className="input-field" /></div>
            <div className="flex items-end"><button type="submit" className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-accent text-accent-foreground hover:opacity-90 transition-opacity">Create</button></div>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div></div>
      ) : (
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="table-header-cell">Student ID</th>
                <th className="table-header-cell">Name</th>
                <th className="table-header-cell">Email</th>
                <th className="table-header-cell">Department</th>
                <th className="table-header-cell">Course</th>
                <th className="table-header-cell">Sem</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="table-cell font-mono text-xs">{s.studentId}</td>
                  {editId === s.id ? (
                    <>
                      <td className="table-cell"><input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="input-field text-sm" /></td>
                      <td className="table-cell"><input value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="input-field text-sm" /></td>
                      <td className="table-cell"><input value={editForm.department} onChange={e => setEditForm({ ...editForm, department: e.target.value })} className="input-field text-sm" /></td>
                      <td className="table-cell"><input value={editForm.course} onChange={e => setEditForm({ ...editForm, course: e.target.value })} className="input-field text-sm" /></td>
                      <td className="table-cell"><input type="number" value={editForm.semester} onChange={e => setEditForm({ ...editForm, semester: +e.target.value })} className="input-field text-sm w-16" /></td>
                      <td className="table-cell">
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(s.id)} className="text-accent hover:underline text-sm flex items-center gap-1"><Save className="w-3.5 h-3.5" />Save</button>
                          <button onClick={() => setEditId(null)} className="text-muted-foreground hover:underline text-sm">Cancel</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="table-cell font-medium">{s.name}</td>
                      <td className="table-cell text-muted-foreground">{s.email}</td>
                      <td className="table-cell text-muted-foreground">{s.department}</td>
                      <td className="table-cell text-muted-foreground">{s.course}</td>
                      <td className="table-cell">{s.semester}</td>
                      <td className="table-cell">
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(s)} className="text-primary hover:underline text-sm flex items-center gap-1"><Pencil className="w-3.5 h-3.5" />Edit</button>
                          <button onClick={() => handleDelete(s.id)} className="text-destructive hover:underline text-sm flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" />Delete</button>
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
      )}
    </DashboardLayout>
  );
};

export default ManageStudents;
