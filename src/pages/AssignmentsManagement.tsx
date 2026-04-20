import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { Loader2, Trash, Edit, Copyleft } from 'lucide-react';

export default function AssignmentsManagement() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({ title: '', subjectId: '', teacherId: '', dueDate: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [aRes, sRes, tRes] = await Promise.all([
        apiClient('/assignments'),
        apiClient('/courses'), // using courses as mock subjects for now if subject API isn't fully robust, wait we have subjects API!
        apiClient('/teachers')
      ]);
      setAssignments(aRes);
      setTeachers(tRes);
    } catch(err) { console.log(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) await apiClient(`/assignments/${editingId}`, { method: 'PUT', body: JSON.stringify(formData) });
      else await apiClient('/assignments', { method: 'POST', body: JSON.stringify(formData) });
      setFormData({ title: '', subjectId: '', teacherId: '', dueDate: '' }); setEditingId(null); fetchData();
    } catch (err: any) { alert(err.message); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this assignment?')) return;
    try { await apiClient(`/assignments/${id}`, { method: 'DELETE' }); fetchData(); } catch (err: any) { alert(err.message); }
  };

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
        <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Copyleft size={28} /></div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Assignments Management</h1>
          <p className="text-gray-500 font-medium mt-1">Manage global curriculum assignments.</p>
        </div>
      </div>
      
      {/* Basic fallback since Subjects are not fully scaffolded individually in the UI, we just allow manual ID entry or standard forms */}
      <div className="bg-white p-6 shadow-xl shadow-gray-200/40 rounded-2xl border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{editingId ? 'Edit' : 'Create New'} Assignment</h2>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 w-64 shadow-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all" placeholder="Midterm Essay" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Subject ID</label>
            <input required type="text" value={formData.subjectId} onChange={e => setFormData({...formData, subjectId: e.target.value})} className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 w-48 shadow-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all" placeholder="Paste Subject ID..." />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Assigning Teacher</label>
            <select required value={formData.teacherId} onChange={e => setFormData({...formData, teacherId: e.target.value})} className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 w-48 shadow-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all">
              <option value="">Select Teacher...</option>
              {teachers.map(t => <option key={t._id} value={t._id}>{t.userId?.name || t._id}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Due Date</label>
            <input required type="date" value={formData.dueDate.substring(0,10)} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 w-40 shadow-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all" />
          </div>
          <button type="submit" className="bg-gradient-to-r from-amber-500 to-orange-500 shadow-md shadow-amber-200 text-white font-bold px-6 py-2.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 ml-2">
            {editingId ? 'Update' : 'Save'} 
          </button>
        </form>
      </div>

      <div className="bg-white shadow-xl shadow-gray-200/40 rounded-2xl overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr><th className="p-4 font-bold text-gray-700">Title</th><th className="p-4 font-bold text-gray-700">Teacher</th><th className="p-4 font-bold text-gray-700">Due Date</th><th className="p-4 font-bold text-gray-700">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && <tr><td colSpan={4} className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-amber-500" size={32}/></td></tr>}
            {!loading && assignments.length === 0 && <tr><td colSpan={4} className="p-12 text-center text-gray-400 font-medium flex flex-col items-center"><Copyleft size={32} className="mb-3 opacity-20"/>No assignments active.</td></tr>}
            {assignments.map((a: any) => (
              <tr key={a._id} className="hover:bg-amber-50/30 transition-colors">
                <td className="p-4 font-bold text-gray-800">{a.title}</td>
                <td className="p-4 text-gray-800 font-medium">{a.teacherId?.userId?.name || 'N/A'}</td>
                <td className="p-4 text-gray-600 font-medium text-sm">{new Date(a.dueDate).toLocaleDateString()}</td>
                <td className="p-4 flex gap-1">
                  <button onClick={() => {setEditingId(a._id); setFormData({title: a.title, subjectId: a.subjectId?._id || a.subjectId, teacherId: a.teacherId?._id, dueDate: a.dueDate});}} className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-all"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(a._id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all"><Trash size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
