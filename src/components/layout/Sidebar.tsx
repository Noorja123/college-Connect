import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, Users, BookOpen, FileText, ClipboardCheck,
  GraduationCap, Award, User, LogOut, Library, KeyRound, UserPlus
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const getNavItems = (): NavItem[] => {
    const common: NavItem[] = [
      { path: `/${user.role}/change-password`, label: 'Change Password', icon: <KeyRound className="w-5 h-5" /> },
    ];

    switch (user.role) {
      case 'admin':
        return [
          { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
          { path: '/admin/users', label: 'Users', icon: <UserPlus className="w-5 h-5" /> },
          { path: '/admin/students', label: 'Students', icon: <Users className="w-5 h-5" /> },
          { path: '/admin/teachers', label: 'Teachers', icon: <GraduationCap className="w-5 h-5" /> },
          { path: '/admin/courses', label: 'Courses', icon: <Library className="w-5 h-5" /> },
          { path: '/admin/subjects', label: 'Subjects', icon: <BookOpen className="w-5 h-5" /> },
          ...common,
        ];
      case 'teacher':
        return [
          { path: '/teacher/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
          { path: '/teacher/attendance', label: 'Attendance', icon: <ClipboardCheck className="w-5 h-5" /> },
          { path: '/teacher/assignments', label: 'Assignments', icon: <FileText className="w-5 h-5" /> },
          ...common,
        ];
      case 'student':
        return [
          { path: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
          { path: '/student/attendance', label: 'My Attendance', icon: <ClipboardCheck className="w-5 h-5" /> },
          { path: '/student/assignments', label: 'Assignments', icon: <FileText className="w-5 h-5" /> },
          { path: '/student/grades', label: 'Grades', icon: <Award className="w-5 h-5" /> },
          { path: '/student/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
          ...common,
        ];
      default:
        return [];
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 min-h-screen flex flex-col bg-sidebar-bg shrink-0">
      <div className="px-5 py-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-sidebar-active">
          <GraduationCap className="w-5 h-5 text-accent-foreground" />
        </div>
        <span className="text-lg font-bold text-sidebar-fg">College CMS</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {getNavItems().map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-sidebar-active/15 text-sidebar-active'
                  : 'text-sidebar-fg/70 hover:bg-sidebar-hover hover:text-sidebar-fg'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-fg/10">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-sidebar-fg truncate">{user.name}</p>
          <p className="text-xs text-sidebar-fg/50 capitalize">{user.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-fg/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
