import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Search, Filter, ShieldAlert } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Table, Column } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { Pagination } from '../components/common/Pagination';
import { useAlertStore } from '../store/useAlertStore';
import { Alert } from '../types/alert.types';
import { formatDate } from '../utils/formatters';

export const AlertsPage: React.FC = () => {
  const { alerts, total, loading, fetchAlerts, markResolved } = useAlertStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const filteredAlerts = alerts.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.message.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || a.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const columns: Column<Alert>[] = [
    {
      header: 'Alert Title & Description',
      cell: (a) => (
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-gray-100">{a.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm">{a.message}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Severity',
      accessorKey: 'severity',
      cell: (a) => <Badge variant={a.severity}>{a.severity}</Badge>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (a) => <Badge variant={a.status}>{a.status}</Badge>,
    },
    {
      header: 'Vehicle / Driver',
      cell: (a) => (
        <div className="text-xs">
          <p className="font-semibold text-gray-800 dark:text-gray-200">
            {typeof a.vehicle === 'object' && a.vehicle?.make
              ? `${a.vehicle.make} (${a.vehicle.licensePlate})`
              : 'Vehicle System'}
          </p>
          <p className="text-gray-400">
            {typeof a.driver === 'object' && a.driver?.name ? a.driver.name : 'Automated Trigger'}
          </p>
        </div>
      ),
    },
    {
      header: 'Time Logged',
      accessorKey: 'createdAt',
      cell: (a) => <span className="text-xs text-gray-500">{formatDate(a.createdAt)}</span>,
    },
    {
      header: 'Actions',
      cell: (a) => (
        <div>
          {a.status !== 'resolved' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markResolved(a._id)}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
            >
              Resolve
            </Button>
          ) : (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            Alerts & Exception Center
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Real-time speeding violations, geofence breaches, low fuel warnings, and engine fault alerts.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <Card className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3">
        <Input
          placeholder="Search alert title..."
          leftIcon={<Search className="w-4 h-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          label="Filter by Status"
          options={[
            { label: 'All Statuses', value: 'all' },
            { label: 'Active / Unresolved', value: 'active' },
            { label: 'Read', value: 'read' },
            { label: 'Resolved', value: 'resolved' },
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />

        <Select
          label="Filter by Severity"
          options={[
            { label: 'All Severities', value: 'all' },
            { label: 'Critical', value: 'critical' },
            { label: 'High', value: 'high' },
            { label: 'Medium', value: 'medium' },
            { label: 'Low', value: 'low' },
          ]}
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
        />
      </Card>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredAlerts}
        isLoading={loading}
        emptyText="No alerts found matching filter criteria"
      />

      <Pagination
        currentPage={page}
        totalPages={Math.ceil(filteredAlerts.length / 10) || 1}
        onPageChange={(p) => setPage(p)}
        totalItems={filteredAlerts.length}
      />
    </div>
  );
};
