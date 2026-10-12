import { api } from './api';
import { TelemetryPoint, TelemetryQueryResult } from '../types/telemetry.types';

export const telemetryService = {
  getTelemetryList: async (params?: { page?: number; limit?: number }): Promise<TelemetryQueryResult> => {
    const response = await api.get('/telemetry', { params });
    return response.data.data;
  },

  getLatestVehicleTelemetry: async (vehicleId: string): Promise<TelemetryPoint | null> => {
    const response = await api.get(`/telemetry/vehicle/${vehicleId}/latest`);
    return response.data.data.telemetry;
  },

  getVehicleTelemetryHistory: async (vehicleId: string): Promise<TelemetryPoint[]> => {
    const response = await api.get(`/telemetry/vehicle/${vehicleId}/history`);
    return response.data.data.telemetry;
  },

  getVehicleSpeed: async (vehicleId: string): Promise<number> => {
    const response = await api.get(`/telemetry/vehicle/${vehicleId}/speed`);
    return response.data.data.speed;
  },

  getVehicleDistance: async (vehicleId: string): Promise<number> => {
    const response = await api.get(`/telemetry/vehicle/${vehicleId}/distance`);
    return response.data.data.distance;
  },
};
