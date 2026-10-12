import React from 'react';
import { User, Shield, Mail, Lock, Key, Check } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Password updated successfully');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          User Profile & Security
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Manage your account credentials, role permissions, and security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1 flex flex-col items-center text-center p-6 space-y-4">
          <Avatar name={user ? `${user.firstName} ${user.lastName}` : 'User'} size="lg" className="w-20 h-20 text-2xl" />
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{user ? `${user.firstName} ${user.lastName}` : '—'}</h2>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <Badge variant="active" className="text-xs py-1 px-3">
            <Shield className="w-3.5 h-3.5 mr-1" />
            {user?.role || 'Dispatcher'}
          </Badge>
        </Card>

        {/* Change Password Form */}
        <Card className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-dark-800 pb-3">
            <Key className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Change Security Password
            </h3>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
            />
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" leftIcon={<Check className="w-4 h-4" />}>
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
