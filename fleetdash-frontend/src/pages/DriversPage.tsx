import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search, UserCheck, Mail, Phone, Shield, Edit2, Trash2, Eye } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Table, Column } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Drawer } from '../components/common/Drawer';
import { Avatar } from '../components/common/Avatar';
import { Pagination } from '../components/common/Pagination';
import { useDriverStore } from '../store/useDriverStore';
import { driverService } from '../services/driver.service';
import { Driver, CreateDriverPayload } from '../types/driver.types';
import { formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

export const DriversPage: React.FC = () => {
  const { drivers, total, loading, fetchDrivers, selectedDriver, setSelectedDriver } =
    useDriverStore();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [deletingDriver, setDeletingDriver] = useState<Driver | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<CreateDriverPayload>();

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const filteredDrivers = drivers.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q) ||
      (d.licenseNumber && d.licenseNumber.toLowerCase().includes(q))
    );
  });

  const handleOpenAdd = () => {
    reset({
      name: '',
      email: '',
      phone: '',
      licenseNumber: '',
      status: 'off_duty',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (d: Driver, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDriver(d);
    setValue('name', d.name);
    setValue('email', d.email);
    setValue('phone', d.phone || '');
    setValue('licenseNumber', d.licenseNumber || '');
    setValue('status', d.status);
  };

  const handleOpenDelete = (d: Driver, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingDriver(d);
  };

  const onAddSubmit = async (data: CreateDriverPayload) => {
    setSubmitting(true);
    try {
      await driverService.createDriver(data);
      toast.success('Driver created successfully');
      setIsAddModalOpen(false);
      fetchDrivers();
    } catch {
      // Toast handled by API interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const onEditSubmit = async (data: CreateDriverPayload) => {
    if (!editingDriver) return;
    setSubmitting(true);
    try {
      await driverService.updateDriver(editingDriver._id, data);
      toast.success('Driver updated successfully');
      setEditingDriver(null);
      fetchDrivers();
    } catch {
      // Toast handled by API interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingDriver) return;
    setSubmitting(true);
    try {
      await driverService.deleteDriver(deletingDriver._id);
      toast.success('Driver deleted successfully');
      setDeletingDriver(null);
      fetchDrivers();
    } catch {
      // Toast handled by API interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const columns: Column<Driver>[] = [
    {
      header: 'Driver Name',
      cell: (d) => (
        <div className="flex items-center gap-3">
          <Avatar name={d.name} size="sm" />
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{d.name}</p>
            <p className="text-xs text-gray-500">{d.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'License #',
      accessorKey: 'licenseNumber',
      cell: (d) => <span className="font-mono font-semibold">{d.licenseNumber || 'DL-90823'}</span>,
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
      cell: (d) => <span>{d.phone || '+1 (555) 234-5678'}</span>,
    },
    {
      header: 'Duty Status',
      accessorKey: 'status',
      cell: (d) => (
        <Badge
          variant={
            d.status === 'driving'
              ? 'active'
              : d.status === 'on_duty'
              ? 'scheduled'
              : d.status === 'break'
              ? 'maintenance'
              : 'inactive'
          }
        >
          {d.status?.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (d) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setSelectedDriver(d)}
            className="p-1.5 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => handleOpenEdit(d, e)}
            className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => handleOpenDelete(d, e)}
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
            Driver Personnel
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Manage active driver accounts, commercial license numbers, and shift status.
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Register New Driver
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search driver name, email, license..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-xs text-gray-500 font-medium">
          Showing {filteredDrivers.length} of {total} registered drivers
        </div>
      </Card>

      {/* Driver Table */}
      <Table
        columns={columns}
        data={filteredDrivers}
        isLoading={loading}
        emptyText="No drivers registered"
        onRowClick={(d) => setSelectedDriver(d)}
      />

      <Pagination
        currentPage={page}
        totalPages={Math.ceil(filteredDrivers.length / 10) || 1}
        onPageChange={(p) => setPage(p)}
        totalItems={filteredDrivers.length}
      />

      {/* Driver Details Drawer */}
      <Drawer
        isOpen={!!selectedDriver}
        onClose={() => setSelectedDriver(null)}
        title="Driver Personnel Details"
      >
        {selectedDriver && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-dark-800">
              <Avatar name={selectedDriver.name} size="lg" />
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {selectedDriver.name}
                </h3>
                <p className="text-xs text-gray-500">{selectedDriver.email}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-800">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> License Number:
                </span>
                <span className="font-mono font-semibold">
                  {selectedDriver.licenseNumber || 'DL-90823'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-800">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Contact Phone:
                </span>
                <span>{selectedDriver.phone || '+1 (555) 234-5678'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-800">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" /> Shift Status:
                </span>
                <Badge variant="active">{selectedDriver.status}</Badge>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-800">
                <span className="text-gray-500">Registered On:</span>
                <span>{formatDate(selectedDriver.createdAt)}</span>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingDriver}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingDriver(null);
        }}
        title={editingDriver ? 'Edit Driver Information' : 'Register New Driver'}
      >
        <form
          onSubmit={handleSubmit(editingDriver ? onEditSubmit : onAddSubmit)}
          className="space-y-4"
        >
          <Input label="Full Name" placeholder="John Doe" {...register('name')} />
          <Input label="Email Address" type="email" placeholder="driver@fleetdash.com" {...register('email')} />
          <Input label="Phone Number" placeholder="+1 (555) 000-0000" {...register('phone')} />
          <Input label="License Number" placeholder="DL-90823" {...register('licenseNumber')} />

          <Select
            label="Shift Status"
            options={[
              { label: 'Off Duty', value: 'off_duty' },
              { label: 'On Duty', value: 'on_duty' },
              { label: 'Driving', value: 'driving' },
              { label: 'Break', value: 'break' },
            ]}
            {...register('status')}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingDriver(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting}>
              {editingDriver ? 'Save Changes' : 'Register Driver'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingDriver}
        onClose={() => setDeletingDriver(null)}
        title="Confirm Delete Driver"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Are you sure you want to delete driver{' '}
            <strong className="text-gray-900 dark:text-white">{deletingDriver?.name}</strong>?
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeletingDriver(null)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={submitting} onClick={confirmDelete}>
              Delete Driver
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
