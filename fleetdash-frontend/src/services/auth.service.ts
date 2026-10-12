import { api } from './api';
import { LoginResponse } from '../types/auth.types';

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore error on logout
    }
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },
};
