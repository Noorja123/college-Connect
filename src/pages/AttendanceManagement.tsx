import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { Loader2, Trash, Edit, Calendar } from 'lucide-react';

export default function AttendanceManagement() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({ studentId: '', subjectId: '', date: new Date().toISOString().substring(0,10), status: 'present' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [attRes, stuRes] = await Promise.all([
        apiClient('/attendance'),
        apiClient('/students')
      ]);
      setAttendance(attRes);
      setStudents(stuRes);
    } catch(err) { console.log(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) await apiClient(`/attendance/${editingId}`, { method: 'PUT', body: JSON.stringify(formData) });
      else await apiClient('/attendance', { method: 'POST', body: JSON.stringify(formData) });
      setFormData({ studentId: '', subjectId: formData.subjectId, date: formData.date, status: 'present' }); setEditingId(null); fetchData();
    } catch (err: any) { alert(err.message); }
  };

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><Calendar size={28} /></div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Attendance Log</h1>
          <p className="text-gray-500 font-medium mt-1">Record and manage student daily attendance.</p>
        </div>
      </div>
      
      {/* Form */}
      <div className="bg-white p-6 shadow-xl shadow-gray-200/40 rounded-2xl border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{editingId ? 'Edit' : 'Mark'} Attendance</h2>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Student</label>
            <select required value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 w-64 shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
              <option value="">Select Student...</option>
              {students.map(s => <option key={s._id} value={s._id}>{s.userId?.name} ({s.rollNumber})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Subject ID</label>
            <input required type="text" value={formData.subjectId} onChange={e => setFormData({...formData, subjectId: e.target.value})} className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 w-48 shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Subject Object ID" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Date</label>
            <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 w-40 shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-600">Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 w-32 shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all">
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </div>
          <button type="submit" className="bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md shadow-emerald-200 text-white font-bold px-6 py-2.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 ml-2">
            Save
          </button>
        </form>
      </div>

      <div className="bg-white shadow-xl shadow-gray-200/40 rounded-2xl overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr><th className="p-4 font-bold text-gray-700">Student Name</th><th className="p-4 font-bold text-gray-700">Date</th><th className="p-4 font-bold text-gray-700">Status</th><th className="p-4 font-bold text-gray-700">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading && <tr><td colSpan={4} className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" size={32}/></td></tr>}
            {!loading && attendance.length === 0 && <tr><td colSpan={4} className="p-12 text-center text-gray-400 font-medium flex flex-col items-center"><Calendar size={32} className="mb-3 opacity-20"/>No records for today.</td></tr>}
            {attendance.map((a: any) => (
              <tr key={a._id} className="hover:bg-emerald-50/30 transition-colors">
                <td className="p-4 font-bold text-gray-800">{a.studentId?.userId?.name || 'N/A'} <span className="text-xs font-normal text-gray-500">({a.studentId?.rollNumber})</span></td>
                <td className="p-4 text-gray-600 font-medium">{new Date(a.date).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-[11px] rounded-full font-bold uppercase tracking-wider ${a.status === 'present' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{a.status}</span>
                </td>
                <td className="p-4 flex gap-1">
                  <button onClick={() => {setEditingId(a._id); setFormData({studentId: a.studentId?._id, subjectId: a.subjectId?._id || a.subjectId, date: a.date.substring(0,10), status: a.status});}} className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all"><Edit size={18} /></button>
                  <button onClick={async () => { if(confirm('Delete?')) { await apiClient(`/attendance/${a._id}`, {method:'DELETE'}); fetchData(); } }} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all"><Trash size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
