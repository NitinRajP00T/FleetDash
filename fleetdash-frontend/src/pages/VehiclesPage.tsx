import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search, Edit2, Trash2, Eye, Truck, Shield, Calendar, MapPin } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Table, Column } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Drawer } from '../components/common/Drawer';
import { Pagination } from '../components/common/Pagination';
import { useVehicleStore } from '../store/useVehicleStore';
import { vehicleService } from '../services/vehicle.service';
import { Vehicle, CreateVehiclePayload } from '../types/vehicle.types';
import { formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

export const VehiclesPage: React.FC = () => {
  const { vehicles, total, loading, fetchVehicles, selectedVehicle, setSelectedVehicle } =
    useVehicleStore();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<CreateVehiclePayload>();

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const filteredVehicles = vehicles.filter((v) => {
    const q = search.toLowerCase();
    return (
      (v.make && v.make.toLowerCase().includes(q)) ||
      (v.vehicleModel && v.vehicleModel.toLowerCase().includes(q)) ||
      (v.licensePlate && v.licensePlate.toLowerCase().includes(q)) ||
      (v.vin && v.vin.toLowerCase().includes(q))
    );
  });

  const handleOpenAdd = () => {
    reset({
      make: '',
      vehicleModel: '',
      year: 2024,
      licensePlate: '',
      vin: '',
      status: 'active',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (v: Vehicle, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingVehicle(v);
    setValue('make', v.make || '');
    setValue('vehicleModel', v.vehicleModel || '');
    setValue('year', v.year || 2024);
    setValue('licensePlate', v.licensePlate || '');
    setValue('vin', v.vin || '');
    setValue('status', v.status);
  };

  const handleOpenDelete = (v: Vehicle, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingVehicle(v);
  };

  const onAddSubmit = async (data: CreateVehiclePayload) => {
    setSubmitting(true);
    try {
      await vehicleService.createVehicle(data);
      toast.success('Vehicle added successfully');
      setIsAddModalOpen(false);
      fetchVehicles();
    } catch {
      // Toast handled by API interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const onEditSubmit = async (data: CreateVehiclePayload) => {
    if (!editingVehicle) return;
    setSubmitting(true);
    try {
      await vehicleService.updateVehicle(editingVehicle._id, data);
      toast.success('Vehicle updated successfully');
      setEditingVehicle(null);
      fetchVehicles();
    } catch {
      // Toast handled by API interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingVehicle) return;
    setSubmitting(true);
    try {
      await vehicleService.deleteVehicle(deletingVehicle._id);
      toast.success('Vehicle deleted successfully');
      setDeletingVehicle(null);
      fetchVehicles();
    } catch {
      // Toast handled by API interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const columns: Column<Vehicle>[] = [
    {
      header: 'Vehicle',
      cell: (v) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-dark-800 text-brand-600 dark:text-brand-400">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {v.make || 'Generic'} {v.vehicleModel || 'Vehicle'}
            </p>
            <p className="text-xs text-gray-500 font-mono">VIN: {v.vin || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Plate',
      accessorKey: 'licensePlate',
      cell: (v) => <span className="font-mono font-semibold">{v.licensePlate || 'N/A'}</span>,
    },
    {
      header: 'Year',
      accessorKey: 'year',
      cell: (v) => <span>{v.year || '2024'}</span>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (v) => <Badge variant={v.status}>{v.status}</Badge>,
    },
    {
      header: 'Actions',
      cell: (v) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setSelectedVehicle(v)}
            className="p-1.5 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => handleOpenEdit(v, e)}
            className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => handleOpenDelete(v, e)}
            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Fleet Vehicles
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Manage your fleet inventory, vehicle status, and driver assignments.
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Add New Vehicle
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search make, model, VIN, plate..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-xs text-gray-500 font-medium">
          Showing {filteredVehicles.length} of {total} vehicles
        </div>
      </Card>

      {/* Vehicles Table */}
      <Table
        columns={columns}
        data={filteredVehicles}
        isLoading={loading}
        emptyText="No vehicles found matching search criteria"
        onRowClick={(v) => setSelectedVehicle(v)}
      />

      <Pagination
        currentPage={page}
        totalPages={Math.ceil(filteredVehicles.length / 10) || 1}
        onPageChange={(p) => setPage(p)}
        totalItems={filteredVehicles.length}
      />

      {/* Vehicle Details Drawer */}
      <Drawer
        isOpen={!!selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        title="Vehicle Details"
      >
        {selectedVehicle && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-dark-800">
              <div className="p-3 rounded-xl bg-brand-600 text-white">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {selectedVehicle.make} {selectedVehicle.vehicleModel}
                </h3>
                <p className="text-xs text-gray-500 font-mono">
                  Plate: {selectedVehicle.licensePlate || 'N/A'}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-800">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> VIN Number:
                </span>
                <span className="font-mono font-semibold">{selectedVehicle.vin || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-800">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Year:
                </span>
                <span className="font-semibold">{selectedVehicle.year || '2024'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-800">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Last Known Location:
                </span>
                <span className="font-mono">
                  {selectedVehicle.lastLocation
                    ? `${selectedVehicle.lastLocation.lat.toFixed(4)}, ${selectedVehicle.lastLocation.lon.toFixed(4)}`
                    : 'No telemetry logged'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-800">
                <span className="text-gray-500">Status:</span>
                <Badge variant={selectedVehicle.status}>{selectedVehicle.status}</Badge>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-800">
                <span className="text-gray-500">Created At:</span>
                <span>{formatDate(selectedVehicle.createdAt)}</span>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Add / Edit Vehicle Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingVehicle}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingVehicle(null);
        }}
        title={editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
      >
        <form
          onSubmit={handleSubmit(editingVehicle ? onEditSubmit : onAddSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Input label="Make" placeholder="Volvo" {...register('make')} />
            <Input label="Model" placeholder="FH16" {...register('vehicleModel')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Year"
              type="number"
              placeholder="2024"
              {...register('year', { valueAsNumber: true })}
            />
            <Input label="License Plate" placeholder="CA-9876" {...register('licensePlate')} />
          </div>

          <Input label="VIN Number" placeholder="1HGCR2F83HA000000" {...register('vin')} />

          <Select
            label="Operational Status"
            options={[
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
              { label: 'Maintenance', value: 'maintenance' },
            ]}
            {...register('status')}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingVehicle(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              {editingVehicle ? 'Save Changes' : 'Create Vehicle'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingVehicle}
        onClose={() => setDeletingVehicle(null)}
        title="Confirm Delete Vehicle"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Are you sure you want to permanently delete vehicle{' '}
            <strong className="text-gray-900 dark:text-white">
              {deletingVehicle?.make} {deletingVehicle?.vehicleModel} ({deletingVehicle?.licensePlate})
            </strong>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeletingVehicle(null)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={submitting} onClick={confirmDelete}>
              Delete Vehicle
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
