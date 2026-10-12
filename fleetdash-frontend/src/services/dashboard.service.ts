import { api } from './api';
import { DashboardOverview, DashboardKPIs, LiveSummary } from '../types/dashboard.types';

export const dashboardService = {
  getOverview: async (): Promise<DashboardOverview> => {
    const response = await api.get('/dashboard');
    return response.data.data;
  },

  getKpis: async (): Promise<DashboardKPIs> => {
    const response = await api.get('/dashboard/kpis');
    return response.data.data;
  },

  getRecentAlerts: async (limit = 10) => {
    const response = await api.get('/dashboard/recent-alerts', { params: { limit } });
    return response.data.data;
  },

  getRecentTrips: async (limit = 10) => {
    const response = await api.get('/dashboard/recent-trips', { params: { limit } });
    return response.data.data;
  },

  getLiveSummary: async (): Promise<LiveSummary> => {
    const response = await api.get('/dashboard/live-summary');
    return response.data.data;
  },
};
