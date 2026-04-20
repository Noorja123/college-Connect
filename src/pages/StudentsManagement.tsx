import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { Loader2, Trash, Edit, GraduationCap } from 'lucide-react';

export default function StudentsManagement() {
  const [students, setStudents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({ userId: '', rollNumber: '', courseId: '', semester: 1, division: 'A' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchDependencies = async () => {
    try {
      const [uRes, cRes] = await Promise.all([
        apiClient('/users'),
        apiClient('/courses')
      ]);
      setUsers(uRes.filter((u: any) => u.role === 'student'));
      setCourses(cRes);
    } catch(err) {
      console.log('Failed to fetch dependencies', err);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await apiClient('/students');
      setStudents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchDependencies();
    fetchStudents(); 
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient(`/students/${editingId}`, { method: 'PUT', body: JSON.stringify(formData) });
      } else {
        await apiClient('/students', { method: 'POST', body: JSON.stringify(formData) });
      }
      setFormData({ userId: '', rollNumber: '', courseId: '', semester: 1, division: 'A' });
      setEditingId(null);
      fetchStudents();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this student record?')) return;
    try {
      await apiClient(`/students/${id}`, { method: 'DELETE' });
      fetchStudents();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
        <div className="p-3 bg-teal-100 text-teal-600 rounded-xl"><GraduationCap size={28} /></div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Students Management</h1>
          <p className="text-gray-500 font-medium mt-1">Enroll users into courses, allocate rolls and divisions.</p>
        </div>
      </div>
      
      {/* Create / Edit Form */}
      <div className="bg-white p-6 shadow-xl shadow-gray-200/40 rounded-2xl border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{editingId ? 'Edit' : 'Enroll New'} Student</h2>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Student User Profile</label>
            <select required value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})} className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 w-48 shadow-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all">
              <option value="">Select User...</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Course</label>
            <select required value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value})} className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 w-48 shadow-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all">
              <option value="">Select Course...</option>
              {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Roll No.</label>
            <input required type="text" value={formData.rollNumber} onChange={e => setFormData({...formData, rollNumber: e.target.value})} className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 w-32 shadow-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all" placeholder="CS-101" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Semester</label>
            <input required type="number" min="1" value={formData.semester} onChange={e => setFormData({...formData, semester: Number(e.target.value)})} className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 w-24 shadow-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Division</label>
            <input required type="text" value={formData.division} onChange={e => setFormData({...formData, division: e.target.value})} className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 w-24 shadow-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all" placeholder="A" />
          </div>
          <button type="submit" className="bg-gradient-to-r from-teal-500 to-teal-700 shadow-md shadow-teal-200 text-white font-bold px-6 py-2.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 ml-2">
            {editingId ? 'Update' : 'Enroll'}
          </button>
          {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData({userId:'', rollNumber:'', courseId:'', semester:1, division:'A'})}} className="text-gray-500 hover:text-gray-700 font-bold px-4 py-2 rounded-xl transition-all">Cancel</button>}
        </form>
      </div>

      {/* Main Table */}
      <div className="bg-white shadow-xl shadow-gray-200/40 rounded-2xl overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-bold text-gray-700">Roll No.</th>
              <th className="p-4 font-bold text-gray-700">Name / Email</th>
              <th className="p-4 font-bold text-gray-700">Course</th>
              <th className="p-4 font-bold text-gray-700">Sem / Div</th>
              <th className="p-4 font-bold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && <tr><td colSpan={5} className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-teal-500" size={32}/></td></tr>}
            {error && <tr><td colSpan={5} className="p-12 text-center font-semibold text-red-500 bg-red-50/30">{error}</td></tr>}
            {!loading && !error && students.length === 0 && <tr><td colSpan={5} className="p-12 text-center text-gray-400 font-medium flex flex-col items-center"><GraduationCap size={32} className="mb-3 opacity-20"/>No students enrolled.</td></tr>}
            
            {students.map((s: any) => (
              <tr key={s._id} className="hover:bg-teal-50/30 transition-colors">
                <td className="p-4 font-bold text-gray-800">{s.rollNumber}</td>
                <td className="p-4">
                  <div className="font-semibold text-gray-800">{s.userId?.name || 'N/A'}</div>
                  <div className="text-xs text-gray-500">{s.userId?.email || 'N/A'}</div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-gray-800">{s.courseId?.name || 'N/A'}</div>
                  <div className="text-xs text-gray-500">{s.courseId?.department || 'N/A'}</div>
                </td>
                <td className="p-4 text-gray-600 font-medium">S{s.semester} / {s.division}</td>
                <td className="p-4 flex gap-1">
                  <button onClick={() => {setEditingId(s._id); setFormData({userId: s.userId?._id, rollNumber: s.rollNumber, courseId: s.courseId?._id, semester: s.semester, division: s.division});}} className="p-2 text-teal-600 hover:bg-teal-100 rounded-lg transition-all"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(s._id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all"><Trash size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
