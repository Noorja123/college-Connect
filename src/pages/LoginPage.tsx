import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { Loader2, GraduationCap } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@college.edu');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('userName', data.name);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed Check credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px] opacity-20"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px] opacity-20"></div>
      
      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/40 w-full max-w-md z-10 relative">
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 mb-6">
            <GraduationCap className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-gray-800 to-gray-600 text-transparent bg-clip-text mb-2">Welcome Back</h1>
          <p className="text-gray-500 font-medium">Log in to your EduConnect portal.</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl mb-6 text-sm font-semibold text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-gray-800 shadow-sm" placeholder="admin@college.edu"/>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-gray-800 shadow-sm" placeholder="••••••••"/>
          </div>
          <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center mt-4">
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Secure Login'}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
           <p className="text-xs text-gray-400 font-medium">Test Accounts Seeded to DB:<br/>admin@college.edu | smith@college.edu | john@student.edu<br/>Pass for all: password123</p>
        </div>
      </div>
    </div>
  );
}
