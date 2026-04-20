import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { Loader2, Trash, Edit, BookOpen } from 'lucide-react';

export default function CoursesManagement() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({ name: '', duration: '', department: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await apiClient('/courses');
      setCourses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient(`/courses/${editingId}`, { method: 'PUT', body: JSON.stringify(formData) });
      } else {
        await apiClient('/courses', { method: 'POST', body: JSON.stringify(formData) });
      }
      setFormData({ name: '', duration: '', department: '' });
      setEditingId(null);
      fetchCourses();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await apiClient(`/courses/${id}`, { method: 'DELETE' });
      fetchCourses();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><BookOpen size={28} /></div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Courses Management</h1>
          <p className="text-gray-500 font-medium mt-1">Manage global curriculum streams and program durations.</p>
        </div>
      </div>
      
      {/* Create / Edit Form */}
      <div className="bg-white p-6 shadow-xl shadow-gray-200/40 rounded-2xl border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{editingId ? 'Edit' : 'Create New'} Course</h2>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Course Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 w-64 shadow-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all" placeholder="Bachelor of Science" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Duration (e.g. 4 Years)</label>
            <input required type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 w-40 shadow-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all" placeholder="4 Years" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Department</label>
            <input required type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 w-48 shadow-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all" placeholder="Sciences" />
          </div>
          <button type="submit" className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md shadow-purple-200 text-white font-bold px-6 py-2.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 ml-2">
            {editingId ? 'Update' : 'Save'} Course
          </button>
          {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData({name:'', duration:'', department:''})}} className="text-gray-500 hover:text-gray-700 font-bold px-4 py-2 rounded-xl transition-all">Cancel</button>}
        </form>
      </div>

      {/* Main Table */}
      <div className="bg-white shadow-xl shadow-gray-200/40 rounded-2xl overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-bold text-gray-700">Course Name</th>
              <th className="p-4 font-bold text-gray-700">Duration</th>
              <th className="p-4 font-bold text-gray-700">Department</th>
              <th className="p-4 font-bold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && <tr><td colSpan={4} className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-purple-500" size={32}/></td></tr>}
            {error && <tr><td colSpan={4} className="p-12 text-center font-semibold text-red-500 bg-red-50/30">{error}</td></tr>}
            {!loading && !error && courses.length === 0 && <tr><td colSpan={4} className="p-12 text-center text-gray-400 font-medium flex flex-col items-center"><BookOpen size={32} className="mb-3 opacity-20"/>No courses found.</td></tr>}
            
            {courses.map((c: any) => (
              <tr key={c._id} className="hover:bg-purple-50/30 transition-colors">
                <td className="p-4 font-bold text-gray-800">{c.name}</td>
                <td className="p-4 text-gray-600 font-medium">{c.duration}</td>
                <td className="p-4 text-gray-600 font-medium">{c.department}</td>
                <td className="p-4 flex gap-1">
                  <button onClick={() => {setEditingId(c._id); setFormData({name: c.name, duration: c.duration, department: c.department});}} className="p-2 text-purple-500 hover:bg-purple-100 rounded-lg transition-all"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(c._id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all"><Trash size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
