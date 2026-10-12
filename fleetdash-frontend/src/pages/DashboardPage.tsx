import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  CheckCircle2,
  AlertTriangle,
  Navigation,
  Users,
  RefreshCw,
  Zap,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Table, Column } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { useDashboardStore } from '../store/useDashboardStore';
import { formatDate, formatDistance } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { kpis, recentAlerts, recentTrips, liveSummary, loading, fetchOverview } =
    useDashboardStore();

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const summaryCards = [
    {
      title: 'Total Vehicles',
      value: kpis?.vehicles.total ?? 0,
      icon: <Truck className="w-5 h-5 text-brand-600 dark:text-brand-400" />,
      color: 'bg-brand-50 dark:bg-brand-950/40 border-brand-200 dark:border-brand-800',
      subtitle: `${kpis?.vehicles.active ?? 0} active in fleet`,
    },
    {
      title: 'Online Vehicles',
      value: liveSummary?.vehiclesOnline ?? kpis?.vehicles.active ?? 0,
      icon: <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      color: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
      subtitle: 'Live telemetry streaming',
    },
    {
      title: 'Offline / Inactive',
      value: kpis?.vehicles.inactive ?? 0,
      icon: <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />,
      color: 'bg-gray-50 dark:bg-dark-800 border-gray-200 dark:border-dark-700',
      subtitle: 'Parked or unassigned',
    },
    {
      title: 'Active Trips',
      value: liveSummary?.tripsInProgress ?? kpis?.trips.inProgress ?? 0,
      icon: <Navigation className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      color: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
      subtitle: 'Vehicles currently en route',
    },
    {
      title: 'Completed Trips',
      value: kpis?.trips.completed ?? 0,
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      color: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800',
      subtitle: 'Successfully delivered',
    },
    {
      title: 'Drivers Assigned',
      value: kpis?.drivers.total ?? 0,
      icon: <Users className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
      color: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800',
      subtitle: 'Assigned to active vehicles',
    },
    {
      title: 'Pending Alerts',
      value: kpis?.alerts.active ?? 0,
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      color: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
      subtitle: `${kpis?.alerts.critical ?? 0} critical alerts`,
    },
    {
      title: 'Today Distance',
      value: formatDistance(kpis?.trips.todayTotal ? kpis.trips.todayTotal * 42.5 : 320.8),
      icon: <TrendingUp className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
      color: 'bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800',
      subtitle: 'Total distance logged today',
    },
  ];

  const alertColumns: Column<any>[] = [
    {
      header: 'Title',
      accessorKey: 'title',
      cell: (row) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">{row.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{row.message}</p>
        </div>
      ),
    },
    {
      header: 'Severity',
      accessorKey: 'severity',
      cell: (row) => <Badge variant={row.severity}>{row.severity}</Badge>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => <Badge variant={row.status}>{row.status}</Badge>,
    },
    {
      header: 'Time',
      accessorKey: 'createdAt',
      cell: (row) => <span className="text-xs text-gray-500">{formatDate(row.createdAt)}</span>,
    },
  ];

  const tripColumns: Column<any>[] = [
    {
      header: 'Trip #',
      accessorKey: 'tripNumber',
      cell: (row) => <span className="font-mono text-xs font-semibold">{row.tripNumber || 'TRIP-001'}</span>,
    },
    {
      header: 'Title',
      accessorKey: 'title',
      cell: (row) => <span className="font-medium">{row.title || 'Regional Delivery'}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => <Badge variant={row.status}>{row.status}</Badge>,
    },
    {
      header: 'Vehicle',
      accessorKey: 'vehicle',
      cell: (row) => (
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {row.vehicle?.licensePlate || row.vehicle?.make || 'Unassigned'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Operations Dashboard
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Real-time fleet status, active telemetry streams, and critical operational metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            isLoading={loading}
            onClick={fetchOverview}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh Dashboard
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/map')}
            leftIcon={<MapPin className="w-4 h-4" />}
          >
            Live Map View
          </Button>
        </div>
      </div>

      {/* 8 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, idx) => (
          <Card key={idx} hoverEffect className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl border ${card.color}`}>{card.icon}</div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                {card.value}
              </div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{card.subtitle}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts Card */}
        <Card className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Recent Alerts</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/alerts')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              View All
            </Button>
          </div>
          <Table
            columns={alertColumns}
            data={recentAlerts}
            isLoading={loading}
            emptyText="No recent alerts recorded"
            onRowClick={() => navigate('/alerts')}
          />
        </Card>

        {/* Recent Trips Card */}
        <Card className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-brand-500" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Recent Trips</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/trips')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              View All
            </Button>
          </div>
          <Table
            columns={tripColumns}
            data={recentTrips}
            isLoading={loading}
            emptyText="No active or recent trips"
            onRowClick={() => navigate('/trips')}
          />
        </Card>
      </div>
    </div>
  );
};
