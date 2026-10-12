import { useAuthStore } from '../store/useAuthStore';

export const useAuth = () => {
  const { user, token, isAuthenticated, logout, setAuth } = useAuthStore();
  return {
    user,
    token,
    isAuthenticated,
    logout,
    setAuth,
    role: user?.role || 'Dispatcher',
  };
};
