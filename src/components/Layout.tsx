import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Users, GraduationCap, Copyleft, LayoutDashboard, DoorOpen, Presentation, Calendar, BookOpen } from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'student';
  const name = localStorage.getItem('userName') || 'User';

  return (
    <div className="flex h-screen bg-gray-50/50 font-sans">
      <aside className="w-64 bg-white border-r border-gray-100 shadow-2xl shadow-gray-200/50 flex flex-col z-10 relative">
        <div className="p-8 pb-4">
          <h2 className="text-3xl font-black bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-700 text-transparent bg-clip-text drop-shadow-sm">EduConnect</h2>
          <div className="mt-4 px-3 py-2 bg-indigo-50/50 rounded-xl border border-indigo-100">
            <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wider">Welcome back</p>
            <p className="text-sm font-bold text-gray-800">{name}</p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pt-4">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-indigo-600 hover:shadow-sm border border-transparent hover:border-gray-100 transition-all font-semibold"><LayoutDashboard size={18} /> Dashboard</Link>
          {role === 'admin' && <Link to="/users" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-indigo-600 hover:shadow-sm border border-transparent hover:border-gray-100 transition-all font-semibold"><Users size={18} /> Users</Link>}
          {(role === 'admin' || role === 'teacher') && <Link to="/students" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-indigo-600 hover:shadow-sm border border-transparent hover:border-gray-100 transition-all font-semibold"><GraduationCap size={18} /> Students</Link>}
          {role === 'admin' && <Link to="/teachers" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-indigo-600 hover:shadow-sm border border-transparent hover:border-gray-100 transition-all font-semibold"><Presentation size={18} /> Teachers</Link>}
          <Link to="/courses" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-indigo-600 hover:shadow-sm border border-transparent hover:border-gray-100 transition-all font-semibold"><BookOpen size={18} /> Courses</Link>
          <Link to="/assignments" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-indigo-600 hover:shadow-sm border border-transparent hover:border-gray-100 transition-all font-semibold"><Copyleft size={18} /> Assignments</Link>
          {(role === 'admin' || role === 'teacher') && <Link to="/attendance" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-indigo-600 hover:shadow-sm border border-transparent hover:border-gray-100 transition-all font-semibold"><Calendar size={18} /> Attendance</Link>}
        </nav>
        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 hover:bg-red-50 hover:border-red-100 text-gray-700 hover:text-red-600 shadow-sm transition-all font-bold w-full"><DoorOpen size={18}/> Logout</button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/20 via-gray-50/50 to-white">
        <Outlet />
      </main>
    </div>
  );
}
