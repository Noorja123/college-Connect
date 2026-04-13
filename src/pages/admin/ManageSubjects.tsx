import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppDb } from '@/contexts/DataContext';
import { api, mutate } from '@/lib/api';
import { Plus, X, Pencil, Trash2, Save } from 'lucide-react';

const ManageSubjects: React.FC = () => {
  const { MOCK_USERS, MOCK_STUDENTS, MOCK_TEACHERS, MOCK_COURSES, MOCK_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_ATTENDANCE } = useAppDb();

  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = () => {
    setLoading(true);
    api.getSubjects().then((data) => {
      setSubjects(data.map((s: any) => ({ ...s, id: s._id || s.id })));
    })
    .catch(() => alert("Failed to load subjects data"))
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSubjects();
  }, []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', courseName: '', semester: 1, credits: 3 });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', code: '', courseName: '', semester: 1, credits: 3 });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutate.post('subjects', form);
      fetchSubjects();
      setForm({ name: '', code: '', courseName: '', semester: 1, credits: 3 });
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (s: typeof subjects[0]) => {
    setEditId(s.id);
    setEditForm({ name: s.name, code: s.code, courseName: s.courseName, semester: s.semester, credits: s.credits });
  };

  const saveEdit = async (id: string) => {
    try {
      await mutate.put('subjects', id, editForm);
      fetchSubjects();
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await mutate.delete('subjects', id);
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Manage Subjects</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Subject'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-card rounded-xl shadow-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Code</label><input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Course</label>
              <select value={form.courseName} onChange={e => setForm({ ...form, courseName: e.target.value })} className="input-field" required>
                <option value="">Select</option>
                {MOCK_COURSES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Semester</label><input type="number" min={1} max={8} value={form.semester} onChange={e => setForm({ ...form, semester: +e.target.value })} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Credits</label><input type="number" min={1} max={6} value={form.credits} onChange={e => setForm({ ...form, credits: +e.target.value })} className="input-field" /></div>
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
                <th className="table-header-cell">Code</th>
                <th className="table-header-cell">Name</th>
                <th className="table-header-cell">Course</th>
                <th className="table-header-cell">Semester</th>
                <th className="table-header-cell">Credits</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(s => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  {editId === s.id ? (
                    <>
                      <td className="table-cell"><input value={editForm.code} onChange={e => setEditForm({ ...editForm, code: e.target.value })} className="input-field text-sm" /></td>
                      <td className="table-cell"><input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="input-field text-sm" /></td>
                      <td className="table-cell">
                        <select value={editForm.courseName} onChange={e => setEditForm({ ...editForm, courseName: e.target.value })} className="input-field text-sm">
                          {MOCK_COURSES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                      </td>
                      <td className="table-cell"><input type="number" value={editForm.semester} onChange={e => setEditForm({ ...editForm, semester: +e.target.value })} className="input-field text-sm w-16" /></td>
                      <td className="table-cell"><input type="number" value={editForm.credits} onChange={e => setEditForm({ ...editForm, credits: +e.target.value })} className="input-field text-sm w-16" /></td>
                      <td className="table-cell">
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(s.id)} className="text-accent hover:underline text-sm flex items-center gap-1"><Save className="w-3.5 h-3.5" />Save</button>
                          <button onClick={() => setEditId(null)} className="text-muted-foreground hover:underline text-sm">Cancel</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="table-cell font-mono text-xs">{s.code}</td>
                      <td className="table-cell font-medium">{s.name}</td>
                      <td className="table-cell text-muted-foreground">{s.courseName}</td>
                      <td className="table-cell">{s.semester}</td>
                      <td className="table-cell">{s.credits}</td>
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

export default ManageSubjects;
