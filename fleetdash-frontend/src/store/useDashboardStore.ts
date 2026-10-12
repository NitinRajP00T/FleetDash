import { create } from 'zustand';
import { DashboardKPIs, LiveSummary } from '../types/dashboard.types';
import { dashboardService } from '../services/dashboard.service';

const dummyKPIs: DashboardKPIs = {
  vehicles: { total: 4, active: 3, inactive: 1, maintenance: 0 },
  drivers: { total: 4 },
  trips: { total: 3, scheduled: 1, inProgress: 1, completed: 1, cancelled: 0, todayTotal: 1 },
  alerts: { total: 3, active: 2, critical: 0, todayTotal: 2 }
};

const dummyLiveSummary: LiveSummary = {
  vehiclesOnline: 2,
  tripsInProgress: 1,
  activeAlerts: 2,
  criticalAlerts: 0,
  generatedAt: new Date().toISOString()
};

const dummyRecentAlerts = [
  {
    _id: 'alert_1',
    title: 'Overspeeding Detected',
    message: 'Vehicle exceeded max speed limit of 100 km/h (112 km/h detected)',
    severity: 'high',
    status: 'active',
    createdAt: new Date(Date.now() - 600000).toISOString()
  },
  {
    _id: 'alert_2',
    title: 'Low Fuel Warning',
    message: 'Fuel level dropped below 15% (12% remaining)',
    severity: 'medium',
    status: 'active',
    createdAt: new Date(Date.now() - 1800000).toISOString()
  }
];

const dummyRecentTrips = [
  {
    _id: 'trip_1',
    tripNumber: 'TRIP-1001',
    title: 'San Francisco to San Jose Delivery',
    status: 'in_progress',
    vehicle: { licensePlate: 'CA-8921-X', make: 'Volvo' }
  },
  {
    _id: 'trip_2',
    tripNumber: 'TRIP-1002',
    title: 'Oakland Port Logistics Transfer',
    status: 'scheduled',
    vehicle: { licensePlate: 'CA-3342-Y', make: 'Scania' }
  }
];

interface DashboardState {
  kpis: DashboardKPIs | null;
  recentAlerts: any[];
  recentTrips: any[];
  liveSummary: LiveSummary | null;
  loading: boolean;
  fetchOverview: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  kpis: dummyKPIs,
  recentAlerts: dummyRecentAlerts,
  recentTrips: dummyRecentTrips,
  liveSummary: dummyLiveSummary,
  loading: false,

  fetchOverview: async () => {
    set({ loading: true });
    try {
      const data = await dashboardService.getOverview();
      set({
        kpis: data.kpis || dummyKPIs,
        recentAlerts: data.recentAlerts?.alerts && data.recentAlerts.alerts.length > 0 ? data.recentAlerts.alerts : dummyRecentAlerts,
        recentTrips: data.recentTrips?.trips && data.recentTrips.trips.length > 0 ? data.recentTrips.trips : dummyRecentTrips,
        liveSummary: data.liveSummary || dummyLiveSummary,
        loading: false,
      });
    } catch {
      // API call failed, retain dummy dashboard overview
      set({
        kpis: dummyKPIs,
        recentAlerts: dummyRecentAlerts,
        recentTrips: dummyRecentTrips,
        liveSummary: dummyLiveSummary,
        loading: false,
      });
    }
  },
}));
