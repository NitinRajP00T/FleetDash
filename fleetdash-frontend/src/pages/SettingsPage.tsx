import React from 'react';
import { Settings as SettingsIcon, Bell, Radio, Shield, Save } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('System settings saved successfully');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          System Settings & Thresholds
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Configure telemetry processing thresholds, alert notification triggers, and API settings.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Telemetry Thresholds Card */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-dark-800 pb-3">
            <Radio className="w-4 h-4 text-brand-600" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              GPS & Telemetry Thresholds
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Max Speeding Limit (km/h)" type="number" defaultValue={100} />
            <Input label="Idle Timeout Threshold (minutes)" type="number" defaultValue={15} />
            <Input label="Low Fuel Alert Threshold (%)" type="number" defaultValue={15} />
            <Input label="Harsh Braking G-Force Limit" type="number" step="0.1" defaultValue={0.4} />
          </div>
        </Card>

        {/* Notifications & Pub/Sub Settings */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-dark-800 pb-3">
            <Bell className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              Alert Notification Settings
            </h2>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Critical Alert Sound Notifications
                </p>
                <p className="text-gray-500">Play audio chime when critical alert is broadcast</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand-600 rounded" />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  Real-time Socket.io Toast Popups
                </p>
                <p className="text-gray-500">Show instant toast on new alert</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand-600 rounded" />
            </div>
          </div>
        </Card>

        {/* Database & Bucket Retentions */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-dark-800 pb-3">
            <Shield className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              Data Retention & Bucket Configuration
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="MongoDB Bucket Aggregation Interval"
              options={[
                { label: 'Hourly Buckets (Recommended)', value: '1h' },
                { label: 'Daily Buckets', value: '24h' },
              ]}
            />
            <Select
              label="Redis Cache TTL"
              options={[
                { label: '5 Minutes (300s)', value: '300' },
                { label: '15 Minutes (900s)', value: '900' },
              ]}
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
            Save System Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
