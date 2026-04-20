import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { Loader2, Trash, Edit, Presentation } from 'lucide-react';

export default function TeachersManagement() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({ userId: '', department: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchDependencies = async () => {
    try {
      const uRes = await apiClient('/users');
      setUsers(uRes.filter((u: any) => u.role === 'teacher'));
    } catch(err) { console.log(err); }
  };

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await apiClient('/teachers');
      setTeachers(data);
    } catch (err: any) { setError(err.message); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDependencies(); fetchTeachers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) await apiClient(`/teachers/${editingId}`, { method: 'PUT', body: JSON.stringify(formData) });
      else await apiClient('/teachers', { method: 'POST', body: JSON.stringify(formData) });
      setFormData({ userId: '', department: '' }); setEditingId(null); fetchTeachers();
    } catch (err: any) { alert(err.message); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this teacher profile?')) return;
    try { await apiClient(`/teachers/${id}`, { method: 'DELETE' }); fetchTeachers(); }
    catch (err: any) { alert(err.message); }
  };

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
        <div className="p-3 bg-rose-100 text-rose-600 rounded-xl"><Presentation size={28} /></div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Teachers Management</h1>
          <p className="text-gray-500 font-medium mt-1">Allocate teachers to departments.</p>
        </div>
      </div>
      
      {/* Form */}
      <div className="bg-white p-6 shadow-xl shadow-gray-200/40 rounded-2xl border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{editingId ? 'Edit' : 'Create New'} Teacher Profile</h2>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Teacher User Profile</label>
            <select required value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})} className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 w-64 shadow-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all">
              <option value="">Select User...</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Department</label>
            <input required type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 w-64 shadow-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all" placeholder="Computer Science" />
          </div>
          <button type="submit" className="bg-gradient-to-r from-rose-500 to-pink-600 shadow-md shadow-rose-200 text-white font-bold px-6 py-2.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 ml-2">
            {editingId ? 'Update' : 'Save'} Profile
          </button>
          {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData({userId:'', department:''})}} className="text-gray-500 hover:text-gray-700 font-bold px-4 py-2 rounded-xl transition-all">Cancel</button>}
        </form>
      </div>

      {/* Table */}
      <div className="bg-white shadow-xl shadow-gray-200/40 rounded-2xl overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr><th className="p-4 font-bold text-gray-700">Name / Email</th><th className="p-4 font-bold text-gray-700">Department</th><th className="p-4 font-bold text-gray-700">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && <tr><td colSpan={3} className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-rose-500" size={32}/></td></tr>}
            {!loading && teachers.length === 0 && <tr><td colSpan={3} className="p-12 text-center text-gray-400 font-medium flex flex-col items-center"><Presentation size={32} className="mb-3 opacity-20"/>No teachers found.</td></tr>}
            {teachers.map((t: any) => (
              <tr key={t._id} className="hover:bg-rose-50/30 transition-colors">
                <td className="p-4"><div className="font-semibold text-gray-800">{t.userId?.name || 'N/A'}</div><div className="text-xs text-gray-500">{t.userId?.email || 'N/A'}</div></td>
                <td className="p-4 text-gray-800 font-medium">{t.department}</td>
                <td className="p-4 flex gap-1">
                  <button onClick={() => {setEditingId(t._id); setFormData({userId: t.userId?._id, department: t.department});}} className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition-all"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(t._id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all"><Trash size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
