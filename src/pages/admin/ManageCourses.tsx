import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAppDb } from '@/contexts/DataContext';
import { Plus, X, Pencil, Trash2, Save } from 'lucide-react';

const ManageCourses: React.FC = () => {
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', department: '', duration: 8 });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', code: '', department: '', duration: 8 });

  const handleCreate = (e: React.FormEvent) => {
  const { MOCK_USERS, MOCK_STUDENTS, MOCK_TEACHERS, MOCK_COURSES, MOCK_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_ATTENDANCE } = useAppDb();
    e.preventDefault();
    setCourses([...courses, { id: `c${Date.now()}`, ...form }]);
    setForm({ name: '', code: '', department: '', duration: 8 });
    setShowForm(false);
  };

  const startEdit = (c: typeof courses[0]) => {
  const { MOCK_USERS, MOCK_STUDENTS, MOCK_TEACHERS, MOCK_COURSES, MOCK_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_ATTENDANCE } = useAppDb();
    setEditId(c.id);
    setEditForm({ name: c.name, code: c.code, department: c.department, duration: c.duration });
  };

  const saveEdit = (id: string) => {
  const { MOCK_USERS, MOCK_STUDENTS, MOCK_TEACHERS, MOCK_COURSES, MOCK_SUBJECTS, MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_ATTENDANCE } = useAppDb();
    setCourses(courses.map(c => c.id === id ? { ...c, ...editForm } : c));
    setEditId(null);
  };

  const handleDelete = (id: string) => setCourses(courses.filter(c => c.id !== id));

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Manage Courses</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Course'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-card rounded-xl shadow-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Course Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Code</label><input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Department</label><input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Duration (semesters)</label><input type="number" min={1} value={form.duration} onChange={e => setForm({ ...form, duration: +e.target.value })} className="input-field" /></div>
            <div className="flex items-end"><button type="submit" className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-accent text-accent-foreground hover:opacity-90 transition-opacity">Create</button></div>
          </div>
        </form>
      )}

      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="table-header-cell">Code</th>
                <th className="table-header-cell">Name</th>
                <th className="table-header-cell">Department</th>
                <th className="table-header-cell">Duration</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  {editId === c.id ? (
                    <>
                      <td className="table-cell"><input value={editForm.code} onChange={e => setEditForm({ ...editForm, code: e.target.value })} className="input-field text-sm" /></td>
                      <td className="table-cell"><input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="input-field text-sm" /></td>
                      <td className="table-cell"><input value={editForm.department} onChange={e => setEditForm({ ...editForm, department: e.target.value })} className="input-field text-sm" /></td>
                      <td className="table-cell"><input type="number" value={editForm.duration} onChange={e => setEditForm({ ...editForm, duration: +e.target.value })} className="input-field text-sm w-20" /></td>
                      <td className="table-cell">
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(c.id)} className="text-accent hover:underline text-sm flex items-center gap-1"><Save className="w-3.5 h-3.5" />Save</button>
                          <button onClick={() => setEditId(null)} className="text-muted-foreground hover:underline text-sm">Cancel</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="table-cell font-mono text-xs">{c.code}</td>
                      <td className="table-cell font-medium">{c.name}</td>
                      <td className="table-cell text-muted-foreground">{c.department}</td>
                      <td className="table-cell">{c.duration} semesters</td>
                      <td className="table-cell">
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(c)} className="text-primary hover:underline text-sm flex items-center gap-1"><Pencil className="w-3.5 h-3.5" />Edit</button>
                          <button onClick={() => handleDelete(c.id)} className="text-destructive hover:underline text-sm flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" />Delete</button>
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

export default ManageCourses;
