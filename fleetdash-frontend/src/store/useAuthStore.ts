import { create } from 'zustand';
import { User } from '../types/auth.types';
import { storage } from '../utils/storage';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  theme: 'dark' | 'light';
  setAuth: (user: User, token: string, refreshToken: string) => void;
  logout: () => Promise<void>;
  toggleTheme: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: storage.getUser(),
  token: storage.getAccessToken(),
  isAuthenticated: !!storage.getAccessToken(),
  theme: storage.getTheme(),

  setAuth: (user, token, refreshToken) => {
    storage.setUser(user);
    storage.setAccessToken(token);
    storage.setRefreshToken(refreshToken);
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    await authService.logout();
    storage.clearAll();
    set({ user: null, token: null, isAuthenticated: false });
  },

  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    storage.setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme: newTheme });
  },

  initialize: () => {
    const theme = storage.getTheme();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({
      user: storage.getUser(),
      token: storage.getAccessToken(),
      isAuthenticated: !!storage.getAccessToken(),
      theme,
    });
  },
}));
