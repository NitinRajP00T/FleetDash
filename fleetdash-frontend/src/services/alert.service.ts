import { api } from './api';
import { Alert } from '../types/alert.types';

export const alertService = {
  getAlerts: async (params?: { page?: number; limit?: number; status?: string; severity?: string }) => {
    const response = await api.get('/alerts', { params });
    return response.data.data;
  },

  getAlertById: async (id: string): Promise<Alert> => {
    const response = await api.get(`/alerts/${id}`);
    return response.data.data.alert;
  },

  markRead: async (id: string): Promise<Alert> => {
    const response = await api.patch(`/alerts/${id}/read`);
    return response.data.data.alert;
  },

  resolveAlert: async (id: string): Promise<Alert> => {
    const response = await api.patch(`/alerts/${id}/resolve`);
    return response.data.data.alert;
  },

  deleteAlert: async (id: string): Promise<void> => {
    await api.delete(`/alerts/${id}`);
  },
};
