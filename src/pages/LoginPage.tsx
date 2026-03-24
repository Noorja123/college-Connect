import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (result.success) {
        const stored = JSON.parse(localStorage.getItem('cms_user') || '{}');
        navigate(`/${stored.role}/dashboard`);
      } else {
        setError(result.error || 'Login failed');
      }
    }, 500);
  };

  const quickLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, hsl(215 60% 16%), hsl(215 60% 28%), hsl(162 63% 30%))' }}>
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-card rounded-2xl p-8 shadow-elegant">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'hsl(162 63% 41%)' }}>
              <GraduationCap className="w-8 h-8" style={{ color: 'hsl(0 0% 100%)' }} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">College CMS</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg text-sm bg-destructive/10 text-destructive">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="Enter your email" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="input-field pr-10" placeholder="Enter your password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground transition-all duration-200 disabled:opacity-50 hover:opacity-90">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">Quick Login (Demo)</p>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => quickLogin('admin@college.com', 'admin123')} className="px-3 py-2 text-xs font-medium rounded-lg border border-border hover:bg-secondary transition-colors text-foreground">Admin</button>
              <button onClick={() => quickLogin('sarah@college.com', 'teacher123')} className="px-3 py-2 text-xs font-medium rounded-lg border border-border hover:bg-secondary transition-colors text-foreground">Teacher</button>
              <button onClick={() => quickLogin('alice@college.com', 'student123')} className="px-3 py-2 text-xs font-medium rounded-lg border border-border hover:bg-secondary transition-colors text-foreground">Student</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
