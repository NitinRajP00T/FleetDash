const ACCESS_TOKEN_KEY = 'fleetdash_access_token';
const REFRESH_TOKEN_KEY = 'fleetdash_refresh_token';
const USER_KEY = 'fleetdash_user';
const THEME_KEY = 'fleetdash_theme';

export const storage = {
  getAccessToken: (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string): void => localStorage.setItem(ACCESS_TOKEN_KEY, token),
  removeAccessToken: (): void => localStorage.removeItem(ACCESS_TOKEN_KEY),

  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string): void => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  removeRefreshToken: (): void => localStorage.removeItem(REFRESH_TOKEN_KEY),

  getUser: (): any | null => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUser: (user: any): void => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  removeUser: (): void => localStorage.removeItem(USER_KEY),

  getTheme: (): 'dark' | 'light' => {
    return (localStorage.getItem(THEME_KEY) as 'dark' | 'light') || 'light';
  },
  setTheme: (theme: 'dark' | 'light'): void => localStorage.setItem(THEME_KEY, theme),

  clearAll: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
