import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Truck,
  Users,
  Navigation,
  Radio,
  Bell,
  BarChart3,
  Settings,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Live Map', path: '/map', icon: <MapPin className="w-5 h-5" /> },
  { label: 'Vehicles', path: '/vehicles', icon: <Truck className="w-5 h-5" /> },
  { label: 'Drivers', path: '/drivers', icon: <Users className="w-5 h-5" /> },
  { label: 'Trips', path: '/trips', icon: <Navigation className="w-5 h-5" /> },
  { label: 'Telemetry', path: '/telemetry', icon: <Radio className="w-5 h-5" /> },
  { label: 'Alerts', path: '/alerts', icon: <Bell className="w-5 h-5" /> },
  { label: 'Analytics', path: '/analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { label: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
];

export const Sidebar: React.FC<{ isOpen: boolean; onCloseMobile?: () => void }> = ({
  isOpen,
  onCloseMobile,
}) => {
  const { user } = useAuthStore();

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-dark-900 border-r border-gray-100 dark:border-dark-800 flex flex-col transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-dark-800 gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-600/30">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
            FleetDash
          </h1>
          <p className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 tracking-wide uppercase">
            Telemetry Platform
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Main Menu
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-semibold shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-800/60 hover:text-gray-900 dark:hover:text-gray-100'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Role Footer */}
      <div className="p-4 border-t border-gray-100 dark:border-dark-800">
        <div className="bg-gray-50 dark:bg-dark-800/60 rounded-xl p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
            <Shield className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
              {user ? `${user.firstName} ${user.lastName}` : 'User'}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
              {user?.role || 'Dispatcher'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
