import { useAuthStore } from '../store/useAuthStore';

export const useTheme = () => {
  const { theme, toggleTheme } = useAuthStore();
  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  };
};
