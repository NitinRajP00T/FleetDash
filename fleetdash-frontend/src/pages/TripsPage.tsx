import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search, Navigation, Clock, Truck, User, CheckCircle2, Play, AlertCircle } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Table, Column } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Drawer } from '../components/common/Drawer';
import { Pagination } from '../components/common/Pagination';
import { useTripStore } from '../store/useTripStore';
import { useVehicleStore } from '../store/useVehicleStore';
import { useDriverStore } from '../store/useDriverStore';
import { tripService } from '../services/trip.service';
import { Trip, CreateTripPayload } from '../types/trip.types';
import { formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

export const TripsPage: React.FC = () => {
  const { trips, total, loading, fetchTrips, selectedTrip, setSelectedTrip } = useTripStore();
  const { vehicles, fetchVehicles } = useVehicleStore();
  const { drivers, fetchDrivers } = useDriverStore();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm<CreateTripPayload>();

  useEffect(() => {
    fetchTrips();
    fetchVehicles();
    fetchDrivers();
  }, [fetchTrips, fetchVehicles, fetchDrivers]);

  const filteredTrips = trips.filter((t) => {
    const q = search.toLowerCase();
    return (
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.tripNumber && t.tripNumber.toLowerCase().includes(q))
    );
  });

  const handleOpenAdd = () => {
    reset({
      title: '',
      description: '',
      driverId: '',
      vehicleId: '',
    });
    setIsAddModalOpen(true);
  };

  const onAddSubmit = async (data: CreateTripPayload) => {
    setSubmitting(true);
    try {
      await tripService.createTrip(data);
      toast.success('Trip scheduled successfully');
      setIsAddModalOpen(false);
      fetchTrips();
    } catch {
      // Toast handled by API interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (tripId: string, status: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await tripService.updateStatus(tripId, status);
      toast.success(`Trip status updated to ${status}`);
      fetchTrips();
    } catch {
      // Toast handled by API interceptor
    }
  };

  const columns: Column<Trip>[] = [
    {
      header: 'Trip Number & Title',
      cell: (t) => (
        <div>
          <p className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
            {t.tripNumber || 'TRIP-1092'}
          </p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">{t.title || 'Logistics Route'}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (t) => <Badge variant={t.status}>{t.status}</Badge>,
    },
    {
      header: 'Vehicle',
      cell: (t) => (
        <span className="text-xs font-mono">
          {typeof t.vehicle === 'object' && t.vehicle?.make
            ? `${t.vehicle.make} (${t.vehicle.licensePlate})`
            : 'Unassigned'}
        </span>
      ),
    },
    {
      header: 'Driver',
      cell: (t) => (
        <span className="text-xs">
          {typeof t.driver === 'object' && t.driver?.name ? t.driver.name : 'Unassigned'}
        </span>
      ),
    },
    {
      header: 'Quick Update',
      cell: (t) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {t.status === 'scheduled' && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => handleStatusChange(t._id, 'in_progress', e)}
              leftIcon={<Play className="w-3.5 h-3.5 text-emerald-500" />}
            >
              Start
            </Button>
          )}
          {t.status === 'in_progress' && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => handleStatusChange(t._id, 'completed', e)}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
            >
              Complete
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Dispatch & Trips
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Schedule route dispatches, assign drivers and vehicles, and track live timeline progress.
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Create New Trip
        </Button>
      </div>

      {/* Search Filter */}
      <Card className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search trip number, title..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-xs text-gray-500 font-medium">
          Showing {filteredTrips.length} of {total} trips
        </div>
      </Card>

      {/* Trips Table */}
      <Table
        columns={columns}
        data={filteredTrips}
        isLoading={loading}
        emptyText="No trips created yet"
        onRowClick={(t) => setSelectedTrip(t)}
      />

      <Pagination
        currentPage={page}
        totalPages={Math.ceil(filteredTrips.length / 10) || 1}
        onPageChange={(p) => setPage(p)}
        totalItems={filteredTrips.length}
      />

      {/* Trip Details & Timeline Drawer */}
      <Drawer
        isOpen={!!selectedTrip}
        onClose={() => setSelectedTrip(null)}
        title="Trip Timeline & Details"
      >
        {selectedTrip && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                  {selectedTrip.tripNumber || 'TRIP-1092'}
                </span>
                <Badge variant={selectedTrip.status}>{selectedTrip.status}</Badge>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {selectedTrip.title}
              </h3>
              {selectedTrip.description && (
                <p className="text-xs text-gray-500">{selectedTrip.description}</p>
              )}
            </div>

            {/* Timeline Section */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                Trip Timeline Log
              </h4>
              <div className="space-y-4 relative pl-4 border-l-2 border-brand-500/30">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full bg-brand-600 border-2 border-white dark:border-dark-900" />
                  <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                    Trip Scheduled
                  </p>
                  <p className="text-[10px] text-gray-400">{formatDate(selectedTrip.createdAt)}</p>
                </div>
                {selectedTrip.status === 'in_progress' && (
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-dark-900 animate-ping" />
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      Vehicle En Route
                    </p>
                    <p className="text-[10px] text-gray-400">Active Live Telemetry Stream</p>
                  </div>
                )}
                {selectedTrip.status === 'completed' && (
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white dark:border-dark-900" />
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      Trip Completed
                    </p>
                    <p className="text-[10px] text-gray-400">Successfully Delivered</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Create Trip Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Trip">
        <form onSubmit={handleSubmit(onAddSubmit)} className="space-y-4">
          <Input label="Trip Title" placeholder="Chicago to Detroit Transit" {...register('title')} />
          <Input label="Description" placeholder="Hauling 20 tons perishable cargo" {...register('description')} />

          <Select
            label="Assign Vehicle"
            options={[
              { label: '-- Select Vehicle --', value: '' },
              ...vehicles.map((v) => ({
                label: `${v.make} ${v.vehicleModel} (${v.licensePlate})`,
                value: v._id,
              })),
            ]}
            {...register('vehicleId')}
          />

          <Select
            label="Assign Driver"
            options={[
              { label: '-- Select Driver --', value: '' },
              ...drivers.map((d) => ({
                label: `${d.name} (${d.email})`,
                value: d._id,
              })),
            ]}
            {...register('driverId')}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              Schedule Trip
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
