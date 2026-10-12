import React, { useEffect, useState } from 'react';
import { Radio, Search, Gauge, Compass, MapPin, RefreshCw, Zap } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Table, Column } from '../components/common/Table';
import { Pagination } from '../components/common/Pagination';
import { useTelemetryStore } from '../store/useTelemetryStore';
import { TelemetryPoint } from '../types/telemetry.types';
import { formatDate, formatSpeed, formatDistance, formatHeading } from '../utils/formatters';

export const TelemetryPage: React.FC = () => {
  const { telemetryPoints, loading, fetchTelemetry } = useTelemetryStore();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTelemetry();
  }, [fetchTelemetry]);

  const filteredPoints = telemetryPoints.filter((p) => {
    if (!search) return true;
    return p.vehicleId?.toLowerCase().includes(search.toLowerCase());
  });

  const columns: Column<TelemetryPoint>[] = [
    {
      header: 'Vehicle ID',
      accessorKey: 'vehicleId',
      cell: (p) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
            <Radio className="w-3.5 h-3.5" />
          </div>
          <span className="font-mono font-bold text-gray-900 dark:text-gray-100">{p.vehicleId}</span>
        </div>
      ),
    },
    {
      header: 'GPS Coordinates',
      cell: (p) => (
        <div className="flex items-center gap-1 font-mono text-xs text-gray-600 dark:text-gray-400">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          <span>{p.latitude?.toFixed(4)}, {p.longitude?.toFixed(4)}</span>
        </div>
      ),
    },
    {
      header: 'Speed',
      accessorKey: 'speed',
      cell: (p) => (
        <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <Gauge className="w-3.5 h-3.5" />
          {formatSpeed(p.speed)}
        </span>
      ),
    },
    {
      header: 'Heading',
      accessorKey: 'heading',
      cell: (p) => (
        <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5" />
          {formatHeading(p.heading)}
        </span>
      ),
    },
    {
      header: 'Distance Delta',
      cell: (p) => <span className="font-mono text-xs">{formatDistance(p.distanceKm)}</span>,
    },
    {
      header: 'Timestamp',
      accessorKey: 'timestamp',
      cell: (p) => <span className="text-xs text-gray-500">{formatDate(p.timestamp)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Live Telemetry Streams
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <Zap className="w-3 h-3 animate-pulse" /> Streaming
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Real-time GPS coordinates, speed calculations, bearing angles, and distance tracking via Worker Threads.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          isLoading={loading}
          onClick={fetchTelemetry}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Refresh Feed
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search by Vehicle ID..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-xs text-gray-500 font-medium">
          Showing {filteredPoints.length} telemetry points
        </div>
      </Card>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredPoints}
        isLoading={loading}
        emptyText="No live telemetry points received yet"
      />

      <Pagination
        currentPage={page}
        totalPages={Math.ceil(filteredPoints.length / 10) || 1}
        onPageChange={(p) => setPage(p)}
        totalItems={filteredPoints.length}
      />
    </div>
  );
};
