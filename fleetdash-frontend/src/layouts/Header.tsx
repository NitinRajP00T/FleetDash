import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Search,
  User as UserIcon,
  LogOut,
  Settings,
  Activity,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useAlertStore } from '../store/useAlertStore';
import { Dropdown } from '../components/common/Dropdown';
import { Avatar } from '../components/common/Avatar';
import { useSocket } from '../socket/useSocket';

export const Header: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, theme, toggleTheme, logout } = useAuthStore();
  const { unreadCount, alerts } = useAlertStore();
  const { isConnected } = useSocket();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      label: 'View Profile',
      icon: <UserIcon className="w-4 h-4" />,
      onClick: () => navigate('/profile'),
    },
    {
      label: 'System Settings',
      icon: <Settings className="w-4 h-4" />,
      onClick: () => navigate('/settings'),
    },
    {
      label: 'Logout',
      icon: <LogOut className="w-4 h-4" />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <header className="h-16 bg-white dark:bg-dark-900 border-b border-gray-100 dark:border-dark-800 px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0">
      {/* Left: Mobile menu toggle + Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative hidden sm:flex items-center w-64 md:w-80">
          <Search className="w-4 h-4 absolute left-3 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search vehicles, drivers, trips..."
            className="w-full bg-gray-50 dark:bg-dark-800/60 text-xs rounded-xl pl-9 pr-4 py-2 border border-gray-200 dark:border-dark-700/80 focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 dark:text-gray-200"
          />
        </div>
      </div>

      {/* Right: Socket Status, Theme Toggle, Notification, User Profile */}
      <div className="flex items-center gap-3">
        {/* Socket Status Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-dark-800 text-[11px] font-medium text-gray-600 dark:text-gray-300">
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
            }`}
          />
          <span>{isConnected ? 'Socket Live' : 'Connecting'}</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
          title="Toggle Dark Mode"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications Dropdown */}
        <Dropdown
          align="right"
          trigger={
            <button className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          }
          items={
            alerts.length > 0
              ? alerts.slice(0, 5).map((alert) => ({
                  label: `${alert.title} — ${alert.message ? alert.message.slice(0, 30) : ''}...`,
                  icon: <Activity className="w-4 h-4 text-amber-500" />,
                  onClick: () => navigate('/alerts'),
                }))
              : [
                  {
                    label: 'No unread alerts',
                    onClick: () => {},
                  },
                ]
          }
        />

        {/* User Profile */}
        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center gap-2 pl-2 cursor-pointer focus:outline-none">
              <Avatar name={user ? `${user.firstName} ${user.lastName}` : 'User'} size="sm" />
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">
                  {user?.role || 'Dispatcher'}
                </p>
              </div>
            </button>
          }
          items={userMenuItems}
        />
      </div>
    </header>
  );
};
