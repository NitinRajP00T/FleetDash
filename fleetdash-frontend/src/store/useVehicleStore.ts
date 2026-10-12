import { create } from 'zustand';
import { Vehicle } from '../types/vehicle.types';
import { vehicleService } from '../services/vehicle.service';

const dummyVehicles: Vehicle[] = [
  {
    _id: 'vehicle_1',
    vin: '1HGCR2F83HA000001',
    make: 'Volvo',
    vehicleModel: 'FH16 Heavy Duty',
    year: 2023,
    licensePlate: 'CA-8921-X',
    status: 'active',
    assignedDriver: { _id: 'driver_1', name: 'John Doe', email: 'john.doe@fleetdash.com' },
    lastLocation: { lat: 37.7749, lon: -122.4194, timestamp: new Date().toISOString() },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'vehicle_2',
    vin: '1HGCR2F83HA000002',
    make: 'Scania',
    vehicleModel: 'R500 V8',
    year: 2022,
    licensePlate: 'CA-3342-Y',
    status: 'active',
    assignedDriver: { _id: 'driver_2', name: 'Jane Smith', email: 'jane.smith@fleetdash.com' },
    lastLocation: { lat: 37.7833, lon: -122.4167, timestamp: new Date().toISOString() },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'vehicle_3',
    vin: '1HGCR2F83HA000003',
    make: 'Freightliner',
    vehicleModel: 'Cascadia',
    year: 2024,
    licensePlate: 'CA-5582-Z',
    status: 'maintenance',
    assignedDriver: null,
    lastLocation: { lat: 37.7699, lon: -122.4468, timestamp: new Date().toISOString() },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'vehicle_4',
    vin: '1HGCR2F83HA000004',
    make: 'Kenworth',
    vehicleModel: 'T680',
    year: 2021,
    licensePlate: 'CA-7711-W',
    status: 'inactive',
    assignedDriver: null,
    lastLocation: { lat: 37.7599, lon: -122.4368, timestamp: new Date().toISOString() },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

interface VehicleState {
  vehicles: Vehicle[];
  total: number;
  loading: boolean;
  selectedVehicle: Vehicle | null;
  fetchVehicles: () => Promise<void>;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  upsertVehicle: (vehicle: Vehicle) => void;
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
  vehicles: dummyVehicles,
  total: dummyVehicles.length,
  loading: false,
  selectedVehicle: null,

  fetchVehicles: async () => {
    set({ loading: true });
    try {
      const data = await vehicleService.getVehicles({ limit: 100 });
      set({ vehicles: data.results && data.results.length > 0 ? data.results : dummyVehicles, total: data.total || dummyVehicles.length, loading: false });
    } catch {
      // API call failed, retain dummy vehicles
      set({ vehicles: dummyVehicles, total: dummyVehicles.length, loading: false });
    }
  },

  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),

  upsertVehicle: (vehicle) => {
    const list = get().vehicles;
    const index = list.findIndex((v) => v._id === vehicle._id);
    if (index >= 0) {
      const updated = [...list];
      updated[index] = { ...updated[index], ...vehicle };
      set({ vehicles: updated });
    } else {
      set({ vehicles: [vehicle, ...list], total: get().total + 1 });
    }
  },
}));
