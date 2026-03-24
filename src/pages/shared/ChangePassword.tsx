import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, CheckCircle } from 'lucide-react';

const ChangePassword: React.FC = () => {
  const { changePassword } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const result = changePassword(oldPassword, newPassword);
    if (result.success) {
      setSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setError(result.error || 'Failed to change password');
    }
  };

  return (
    <DashboardLayout>
      <h1 className="page-title mb-6">Change Password</h1>
      <div className="bg-card rounded-xl shadow-card p-8 max-w-md">
        {success && (
          <div className="mb-4 px-4 py-3 rounded-lg text-sm flex items-center gap-2 bg-accent/10 text-accent">
            <CheckCircle className="w-4 h-4" /> Password changed successfully!
          </div>
        )}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg text-sm bg-destructive/10 text-destructive">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Current Password</label>
            <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input-field" placeholder="Min 6 characters" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input-field" required />
          </div>
          <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            <Lock className="w-4 h-4" /> Update Password
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ChangePassword;
