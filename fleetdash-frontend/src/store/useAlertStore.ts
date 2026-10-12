import { create } from 'zustand';
import { Alert } from '../types/alert.types';
import { alertService } from '../services/alert.service';
import toast from 'react-hot-toast';

const dummyAlerts: Alert[] = [
  {
    _id: 'alert_1',
    type: 'speeding',
    title: 'Overspeeding Detected',
    message: 'Vehicle exceeded max speed limit of 100 km/h (112 km/h detected)',
    severity: 'high',
    status: 'active',
    vehicle: { _id: 'vehicle_1', make: 'Volvo', licensePlate: 'CA-8921-X' },
    driver: { _id: 'driver_1', name: 'John Doe' },
    createdAt: new Date(Date.now() - 600000).toISOString(),
    updatedAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    _id: 'alert_2',
    type: 'low_fuel',
    title: 'Low Fuel Warning',
    message: 'Fuel level dropped below 15% (12% remaining)',
    severity: 'medium',
    status: 'active',
    vehicle: { _id: 'vehicle_2', make: 'Scania', licensePlate: 'CA-3342-Y' },
    driver: { _id: 'driver_2', name: 'Jane Smith' },
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    _id: 'alert_3',
    type: 'engine_fault',
    title: 'Engine Fault Code P0300',
    message: 'Random/Multiple Cylinder Misfire Detected',
    severity: 'critical',
    status: 'resolved',
    vehicle: { _id: 'vehicle_3', make: 'Freightliner', licensePlate: 'CA-5582-Z' },
    driver: { _id: 'driver_3', name: 'Robert Johnson' },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  }
];

interface AlertState {
  alerts: Alert[];
  total: number;
  unreadCount: number;
  loading: boolean;
  fetchAlerts: () => Promise<void>;
  addAlert: (alert: Alert) => void;
  markResolved: (id: string) => Promise<void>;
}

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: dummyAlerts,
  total: dummyAlerts.length,
  unreadCount: dummyAlerts.filter((a) => a.status === 'active').length,
  loading: false,

  fetchAlerts: async () => {
    set({ loading: true });
    try {
      const data = await alertService.getAlerts({ limit: 100 });
      const list: Alert[] = data.results && data.results.length > 0 ? data.results : dummyAlerts;
      const unread = list.filter((a) => a.status === 'active').length;
      set({ alerts: list, total: data.total || dummyAlerts.length, unreadCount: unread, loading: false });
    } catch {
      // API call failed, retain dummy alerts
      const list = dummyAlerts;
      const unread = list.filter((a) => a.status === 'active').length;
      set({ alerts: list, total: dummyAlerts.length, unreadCount: unread, loading: false });
    }
  },

  addAlert: (alert) => {
    if (!alert || !alert._id) return;
    const current = get().alerts;
    if (current.some((a) => a._id === alert._id)) return;

    toast.error(`⚠️ Alert (${alert.severity?.toUpperCase()}): ${alert.title}`, {
      duration: 5000,
    });

    set({
      alerts: [alert, ...current],
      total: get().total + 1,
      unreadCount: get().unreadCount + 1,
    });
  },

  markResolved: async (id) => {
    try {
      const updated = await alertService.resolveAlert(id);
      const list = get().alerts.map((a) => (a._id === id ? updated : a));
      const unread = list.filter((a) => a.status === 'active').length;
      set({ alerts: list, unreadCount: unread });
      toast.success('Alert resolved');
    } catch {
      // Fallback local resolve if API fails
      const list = get().alerts.map((a) => (a._id === id ? { ...a, status: 'resolved' as const } : a));
      const unread = list.filter((a) => a.status === 'active').length;
      set({ alerts: list, unreadCount: unread });
      toast.success('Alert resolved (Local Fallback)');
    }
  },
}));
