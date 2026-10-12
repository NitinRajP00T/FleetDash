import { create } from 'zustand';
import { TelemetryPoint } from '../types/telemetry.types';
import { telemetryService } from '../services/telemetry.service';

const dummyTelemetry: TelemetryPoint[] = [
  {
    vehicleId: 'vehicle_1',
    latitude: 37.7749,
    longitude: -122.4194,
    speed: 65,
    heading: 180,
    altitude: 12,
    distanceKm: 42.5,
    timestamp: new Date().toISOString(),
  },
  {
    vehicleId: 'vehicle_2',
    latitude: 37.7833,
    longitude: -122.4167,
    speed: 72,
    heading: 90,
    altitude: 15,
    distanceKm: 18.2,
    timestamp: new Date().toISOString(),
  },
  {
    vehicleId: 'vehicle_3',
    latitude: 37.7699,
    longitude: -122.4468,
    speed: 0,
    heading: 0,
    altitude: 8,
    distanceKm: 0,
    timestamp: new Date().toISOString(),
  },
];

const initialMap: Record<string, TelemetryPoint> = {};
dummyTelemetry.forEach(p => {
  initialMap[p.vehicleId] = p;
});

interface TelemetryState {
  telemetryPoints: TelemetryPoint[];
  latestMap: Record<string, TelemetryPoint>; // vehicleId -> latest point
  loading: boolean;
  fetchTelemetry: () => Promise<void>;
  addTelemetryPoint: (point: TelemetryPoint) => void;
}

export const useTelemetryStore = create<TelemetryState>((set, get) => ({
  telemetryPoints: dummyTelemetry,
  latestMap: initialMap,
  loading: false,

  fetchTelemetry: async () => {
    set({ loading: true });
    try {
      const data = await telemetryService.getTelemetryList({ limit: 50 });
      const points: TelemetryPoint[] = [];
      const map: Record<string, TelemetryPoint> = {};

      (data.results || []).forEach((item) => {
        if (item.latestPoint) {
          points.push(item.latestPoint);
          map[item.latestPoint.vehicleId] = item.latestPoint;
        }
      });

      if (points.length > 0) {
        set({ telemetryPoints: points, latestMap: map, loading: false });
      } else {
        set({ telemetryPoints: dummyTelemetry, latestMap: initialMap, loading: false });
      }
    } catch {
      // API call failed, retain dummy telemetry
      set({ telemetryPoints: dummyTelemetry, latestMap: initialMap, loading: false });
    }
  },

  addTelemetryPoint: (point) => {
    if (!point || !point.vehicleId) return;
    const currentList = get().telemetryPoints;
    const currentMap = { ...get().latestMap, [point.vehicleId]: point };
    set({
      telemetryPoints: [point, ...currentList.slice(0, 99)],
      latestMap: currentMap,
    });
  },
}));
