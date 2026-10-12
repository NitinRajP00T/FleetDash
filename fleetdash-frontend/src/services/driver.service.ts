import { api } from './api';
import { Driver, CreateDriverPayload, UpdateDriverPayload } from '../types/driver.types';

export const driverService = {
  getDrivers: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get('/drivers', { params });
    return response.data.data;
  },

  getDriverById: async (id: string): Promise<Driver> => {
    const response = await api.get(`/drivers/${id}`);
    return response.data.data.driver;
  },

  createDriver: async (payload: CreateDriverPayload): Promise<Driver> => {
    const response = await api.post('/drivers', payload);
    return response.data.data.driver;
  },

  updateDriver: async (id: string, payload: UpdateDriverPayload): Promise<Driver> => {
    const response = await api.put(`/drivers/${id}`, payload);
    return response.data.data.driver;
  },

  deleteDriver: async (id: string): Promise<void> => {
    await api.delete(`/drivers/${id}`);
  },
};
