import { LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
  const role = localStorage.getItem('role') || 'Unknown';
  const name = localStorage.getItem('userName') || 'User';

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
           <LayoutDashboard size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 font-medium mt-1">Role: <span className="uppercase text-indigo-600 font-bold">{role}</span> Access Tier</p>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome back, {name}!</h2>
        <p className="text-gray-500 mb-8 max-w-xl mx-auto">This dashboard gives you a clean overview of your metrics based on your designated role. Navigate using the sidebar to explore your active modules.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100/50">
             <h3 className="text-indigo-600 font-black text-4xl mb-2">Active</h3>
             <p className="text-gray-600 font-semibold text-sm">Session Status</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100/50">
             <h3 className="text-emerald-600 font-black text-4xl mb-2">100%</h3>
             <p className="text-gray-600 font-semibold text-sm">System Health</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100/50">
             <h3 className="text-amber-600 font-black text-4xl mb-2">{new Date().toISOString().substring(0,10)}</h3>
             <p className="text-gray-600 font-semibold text-sm">Current Date</p>
          </div>
        </div>
      </div>
    </div>
  );
}
