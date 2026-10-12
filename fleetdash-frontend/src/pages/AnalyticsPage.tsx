import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { BarChart3, TrendingUp, Zap, Clock, ShieldCheck } from 'lucide-react';
import { Card } from '../components/common/Card';

const distanceData = [
  { day: 'Mon', distance: 1240, avgSpeed: 62 },
  { day: 'Tue', distance: 1580, avgSpeed: 68 },
  { day: 'Wed', distance: 1890, avgSpeed: 71 },
  { day: 'Thu', distance: 1420, avgSpeed: 64 },
  { day: 'Fri', distance: 2100, avgSpeed: 74 },
  { day: 'Sat', distance: 980, avgSpeed: 58 },
  { day: 'Sun', distance: 650, avgSpeed: 52 },
];

const vehicleUtilizationData = [
  { name: 'Active In Service', value: 65, color: '#10b981' },
  { name: 'Idle / Parked', value: 20, color: '#6b7280' },
  { name: 'Maintenance', value: 15, color: '#f59e0b' },
];

const tripStatsData = [
  { month: 'Jan', completed: 340, cancelled: 12 },
  { month: 'Feb', completed: 420, cancelled: 8 },
  { month: 'Mar', completed: 510, cancelled: 15 },
  { month: 'Apr', completed: 480, cancelled: 10 },
  { month: 'May', completed: 610, cancelled: 14 },
  { month: 'Jun', completed: 730, cancelled: 9 },
];

const driverPerformanceData = [
  { driver: 'Alex M.', score: 94, safetyKm: 4200 },
  { driver: 'Sarah K.', score: 98, safetyKm: 5800 },
  { driver: 'David L.', score: 88, safetyKm: 3100 },
  { driver: 'James T.', score: 91, safetyKm: 4900 },
  { driver: 'Elena R.', score: 96, safetyKm: 5200 },
];

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          Fleet Operations Analytics
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Executive performance metrics, fleet utilization breakdown, and driver safety scores.
        </p>
      </div>

      {/* Top 4 High-Level Metric Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Distance (Week)</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">9,860 km</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Average Fleet Speed</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">65.4 km/h</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Fleet Utilization Rate</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">82.5%</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Safety Index Score</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">93.4 / 100</p>
          </div>
        </Card>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distance Travelled Chart */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Daily Distance Travelled (km)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={distanceData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="distance" stroke="#0070cc" fill="#36abfa" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Vehicle Utilization Pie Chart */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Vehicle Fleet Utilization Breakdown
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleUtilizationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {vehicleUtilizationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly Trip Statistics Bar Chart */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Monthly Completed vs Cancelled Trips
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tripStatsData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip />
                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cancelled" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Driver Performance Chart */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            Top Driver Safety & Performance Scores
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={driverPerformanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" domain={[0, 100]} stroke="#888888" fontSize={12} />
                <YAxis dataKey="driver" type="category" stroke="#888888" fontSize={12} />
                <Tooltip />
                <Bar dataKey="score" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
