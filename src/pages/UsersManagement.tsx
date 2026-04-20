import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { Loader2, Trash, Edit, Users } from 'lucide-react';

export default function UsersManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiClient('/users');
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient(`/users/${editingId}`, { method: 'PUT', body: JSON.stringify({name: formData.name, email: formData.email, role: formData.role}) });
      } else {
        await apiClient('/users', { method: 'POST', body: JSON.stringify(formData) });
      }
      setFormData({ name: '', email: '', password: '', role: 'student' });
      setEditingId(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await apiClient(`/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Users size={28} /></div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Users Management</h1>
          <p className="text-gray-500 font-medium mt-1">Manage global user credentials and access roles.</p>
        </div>
      </div>
      
      {/* Create / Edit Form */}
      <div className="bg-white p-6 shadow-xl shadow-gray-200/40 rounded-2xl border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{editingId ? 'Edit' : 'Create New'} User</h2>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 w-48 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Email</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 w-48 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="email@college.edu"/>
          </div>
          {!editingId && (
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-600">Password</label>
              <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 w-40 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="••••••••" />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Role</label>
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 w-32 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-indigo-200 text-white font-bold px-6 py-2.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 ml-2">
            {editingId ? 'Update' : 'Save'} User
          </button>
          {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData({name:'', email:'', password:'', role:'student'})}} className="text-gray-500 hover:text-gray-700 font-bold px-4 py-2 rounded-xl transition-all">Cancel</button>}
        </form>
      </div>

      {/* Main Table */}
      <div className="bg-white shadow-xl shadow-gray-200/40 rounded-2xl overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-bold text-gray-700">Display Name</th>
              <th className="p-4 font-bold text-gray-700">Email Address</th>
              <th className="p-4 font-bold text-gray-700">Role Level</th>
              <th className="p-4 font-bold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && <tr><td colSpan={4} className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-indigo-500" size={32}/></td></tr>}
            {error && <tr><td colSpan={4} className="p-12 text-center font-semibold text-red-500 bg-red-50/30">{error}</td></tr>}
            {!loading && !error && users.length === 0 && <tr><td colSpan={4} className="p-12 text-center text-gray-400 font-medium flex flex-col items-center"><Users size={32} className="mb-3 opacity-20"/>No users found in database.</td></tr>}
            
            {users.map((u: any) => (
              <tr key={u._id} className="hover:bg-indigo-50/30 transition-colors">
                <td className="p-4 font-semibold text-gray-800">{u.name}</td>
                <td className="p-4 text-gray-500 font-medium">{u.email}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-[11px] rounded-full font-bold uppercase tracking-wider ${
                    u.role === 'admin' ? 'bg-red-100 text-red-700' : 
                    u.role === 'teacher' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 flex gap-1">
                  <button onClick={() => {setEditingId(u._id); setFormData({name: u.name, email: u.email, password: '', role: u.role});}} className="p-2 text-indigo-500 hover:bg-indigo-100 rounded-lg transition-all focus:ring-2 focus:ring-indigo-300"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(u._id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all focus:ring-2 focus:ring-red-300"><Trash size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
