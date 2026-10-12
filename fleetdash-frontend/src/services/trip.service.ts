import { api } from './api';
import { Trip, CreateTripPayload } from '../types/trip.types';

export const tripService = {
  getTrips: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get('/trips', { params });
    return response.data.data;
  },

  getTripById: async (id: string): Promise<Trip> => {
    const response = await api.get(`/trips/${id}`);
    return response.data.data.trip;
  },

  createTrip: async (payload: CreateTripPayload): Promise<Trip> => {
    const response = await api.post('/trips', payload);
    return response.data.data.trip;
  },

  updateTrip: async (id: string, payload: Partial<CreateTripPayload>): Promise<Trip> => {
    const response = await api.put(`/trips/${id}`, payload);
    return response.data.data.trip;
  },

  deleteTrip: async (id: string): Promise<void> => {
    await api.delete(`/trips/${id}`);
  },

  updateStatus: async (id: string, status: string): Promise<Trip> => {
    const response = await api.patch(`/trips/${id}/status`, { status });
    return response.data.data.trip;
  },

  assignDriver: async (id: string, driverId: string): Promise<Trip> => {
    const response = await api.patch(`/trips/${id}/assign-driver`, { driverId });
    return response.data.data.trip;
  },

  assignVehicle: async (id: string, vehicleId: string): Promise<Trip> => {
    const response = await api.patch(`/trips/${id}/assign-vehicle`, { vehicleId });
    return response.data.data.trip;
  },
};
