import { api } from './api';
import { Vehicle, CreateVehiclePayload, UpdateVehiclePayload } from '../types/vehicle.types';

export const vehicleService = {
  getVehicles: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get('/vehicles', { params });
    return response.data.data;
  },

  getVehicleById: async (id: string): Promise<Vehicle> => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data.data.vehicle;
  },

  createVehicle: async (payload: CreateVehiclePayload): Promise<Vehicle> => {
    const response = await api.post('/vehicles', payload);
    return response.data.data.vehicle;
  },

  updateVehicle: async (id: string, payload: UpdateVehiclePayload): Promise<Vehicle> => {
    const response = await api.put(`/vehicles/${id}`, payload);
    return response.data.data.vehicle;
  },

  deleteVehicle: async (id: string): Promise<void> => {
    await api.delete(`/vehicles/${id}`);
  },

  updateStatus: async (id: string, status: string): Promise<Vehicle> => {
    const response = await api.patch(`/vehicles/${id}/status`, { status });
    return response.data.data.vehicle;
  },

  assignDriver: async (id: string, driverId: string): Promise<Vehicle> => {
    const response = await api.patch(`/vehicles/${id}/assign-driver`, { driverId });
    return response.data.data.vehicle;
  },
};
