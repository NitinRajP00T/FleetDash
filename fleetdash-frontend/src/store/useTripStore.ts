import { create } from 'zustand';
import { Trip } from '../types/trip.types';
import { tripService } from '../services/trip.service';

const dummyTrips: Trip[] = [
  {
    _id: 'trip_1',
    tripNumber: 'TRIP-1001',
    title: 'San Francisco to San Jose Delivery',
    description: 'Hauling high-value electronic components',
    status: 'in_progress',
    driver: { _id: 'driver_1', name: 'John Doe' },
    vehicle: { _id: 'vehicle_1', make: 'Volvo', vehicleModel: 'FH16 Heavy Duty', licensePlate: 'CA-8921-X' },
    startTime: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      { type: 'scheduled', message: 'Trip scheduled successfully', timestamp: new Date(Date.now() - 7200000).toISOString() },
      { type: 'started', message: 'Vehicle left the warehouse', timestamp: new Date(Date.now() - 3600000).toISOString() }
    ]
  },
  {
    _id: 'trip_2',
    tripNumber: 'TRIP-1002',
    title: 'Oakland Port Logistics Transfer',
    description: 'Container transport from dock to depot',
    status: 'scheduled',
    driver: { _id: 'driver_2', name: 'Jane Smith' },
    vehicle: { _id: 'vehicle_2', make: 'Scania', vehicleModel: 'R500 V8', licensePlate: 'CA-3342-Y' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      { type: 'scheduled', message: 'Trip scheduled successfully', timestamp: new Date().toISOString() }
    ]
  },
  {
    _id: 'trip_3',
    tripNumber: 'TRIP-1003',
    title: 'Sacramento Hub Supply Run',
    description: 'Scheduled regional supply run',
    status: 'completed',
    driver: { _id: 'driver_3', name: 'Robert Johnson' },
    vehicle: { _id: 'vehicle_3', make: 'Freightliner', vehicleModel: 'Cascadia', licensePlate: 'CA-5582-Z' },
    startTime: new Date(Date.now() - 86400000).toISOString(),
    endTime: new Date(Date.now() - 86400000 + 14400000).toISOString(),
    createdAt: new Date(Date.now() - 100000000).toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      { type: 'scheduled', message: 'Trip scheduled successfully', timestamp: new Date(Date.now() - 100000000).toISOString() },
      { type: 'started', message: 'Trip started', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { type: 'completed', message: 'Trip completed successfully', timestamp: new Date(Date.now() - 86400000 + 14400000).toISOString() }
    ]
  }
];

interface TripState {
  trips: Trip[];
  total: number;
  loading: boolean;
  selectedTrip: Trip | null;
  fetchTrips: () => Promise<void>;
  setSelectedTrip: (trip: Trip | null) => void;
  upsertTrip: (trip: Trip) => void;
}

export const useTripStore = create<TripState>((set, get) => ({
  trips: dummyTrips,
  total: dummyTrips.length,
  loading: false,
  selectedTrip: null,

  fetchTrips: async () => {
    set({ loading: true });
    try {
      const data = await tripService.getTrips({ limit: 100 });
      set({ trips: data.results && data.results.length > 0 ? data.results : dummyTrips, total: data.total || dummyTrips.length, loading: false });
    } catch {
      // API call failed, retain dummy trips
      set({ trips: dummyTrips, total: dummyTrips.length, loading: false });
    }
  },

  setSelectedTrip: (trip) => set({ selectedTrip: trip }),

  upsertTrip: (trip) => {
    const list = get().trips;
    const index = list.findIndex((t) => t._id === trip._id);
    if (index >= 0) {
      const updated = [...list];
      updated[index] = { ...updated[index], ...trip };
      set({ trips: updated });
    } else {
      set({ trips: [trip, ...list], total: get().total + 1 });
    }
  },
}));
