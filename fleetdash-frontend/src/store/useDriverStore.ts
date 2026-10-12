import { create } from 'zustand';
import { Driver } from '../types/driver.types';
import { driverService } from '../services/driver.service';

const dummyDrivers: Driver[] = [
  {
    _id: 'driver_1',
    name: 'John Doe',
    email: 'john.doe@fleetdash.com',
    phone: '+1 (555) 019-2831',
    licenseNumber: 'DL-9082345',
    status: 'driving',
    assignedVehicle: { _id: 'vehicle_1', make: 'Volvo', vehicleModel: 'FH16 Heavy Duty', licensePlate: 'CA-8921-X' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'driver_2',
    name: 'Jane Smith',
    email: 'jane.smith@fleetdash.com',
    phone: '+1 (555) 014-9923',
    licenseNumber: 'DL-8837190',
    status: 'on_duty',
    assignedVehicle: { _id: 'vehicle_2', make: 'Scania', vehicleModel: 'R500 V8', licensePlate: 'CA-3342-Y' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'driver_3',
    name: 'Robert Johnson',
    email: 'robert.j@fleetdash.com',
    phone: '+1 (555) 012-3456',
    licenseNumber: 'DL-7728192',
    status: 'break',
    assignedVehicle: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'driver_4',
    name: 'Michael Brown',
    email: 'michael.b@fleetdash.com',
    phone: '+1 (555) 017-6543',
    licenseNumber: 'DL-6651234',
    status: 'off_duty',
    assignedVehicle: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

interface DriverState {
  drivers: Driver[];
  total: number;
  loading: boolean;
  selectedDriver: Driver | null;
  fetchDrivers: () => Promise<void>;
  setSelectedDriver: (driver: Driver | null) => void;
  upsertDriver: (driver: Driver) => void;
}

export const useDriverStore = create<DriverState>((set, get) => ({
  drivers: dummyDrivers,
  total: dummyDrivers.length,
  loading: false,
  selectedDriver: null,

  fetchDrivers: async () => {
    set({ loading: true });
    try {
      const data = await driverService.getDrivers({ limit: 100 });
      set({ drivers: data.results && data.results.length > 0 ? data.results : dummyDrivers, total: data.total || dummyDrivers.length, loading: false });
    } catch {
      // API call failed, retain dummy drivers
      set({ drivers: dummyDrivers, total: dummyDrivers.length, loading: false });
    }
  },

  setSelectedDriver: (driver) => set({ selectedDriver: driver }),

  upsertDriver: (driver) => {
    const list = get().drivers;
    const index = list.findIndex((d) => d._id === driver._id);
    if (index >= 0) {
      const updated = [...list];
      updated[index] = { ...updated[index], ...driver };
      set({ drivers: updated });
    } else {
      set({ drivers: [driver, ...list], total: get().total + 1 });
    }
  },
}));
