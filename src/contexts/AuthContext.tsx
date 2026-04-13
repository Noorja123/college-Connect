import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, UserRole } from '@/types/models';
import { useAppDb } from '@/contexts/DataContext';
import { mutate } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  createUser: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { MOCK_USERS } = useAppDb();
  
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('cms_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((email: string, password: string) => {
    const found = MOCK_USERS.find((u: User & { password?: string }) => u.email === email && u.password === password);
    if (!found) return { success: false, error: 'Invalid email or password' };
    const { password: _, ...userData } = found;
    setUser(userData);
    localStorage.setItem('cms_user', JSON.stringify(userData));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('cms_user');
  }, []);

  const createUser = useCallback(async (name: string, email: string, password: string, role: UserRole) => {
    const exists = MOCK_USERS.find((u: User) => u.email === email);
    if (exists) return { success: false, error: 'Email already registered' };
    try {
      const newUser = { name, email, role, password };
      const created = await mutate.post('users', newUser);
      MOCK_USERS.push({ ...newUser, id: created._id || created.id || String(Date.now()) });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, [MOCK_USERS]);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    if (!user) return { success: false, error: 'Not logged in' };
    const found = MOCK_USERS.find((u: User & { password?: string }) => u.id === user.id);
    if (!found || found.password !== oldPassword) return { success: false, error: 'Current password is incorrect' };
    try {
      await mutate.put('users', user.id, { ...found, password: newPassword });
      found.password = newPassword;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, [user, MOCK_USERS]);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!user) return;
    try {
      await mutate.put('users', user.id, updates);
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('cms_user', JSON.stringify(updated));

      // Update mock user
      const mockUser = MOCK_USERS.find(u => u.id === user.id);
      if (mockUser) Object.assign(mockUser, updates);
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  }, [user, MOCK_USERS]);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, createUser, changePassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
