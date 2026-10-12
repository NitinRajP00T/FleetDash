export type UserRole =
  | 'Super Admin'
  | 'Company Admin'
  | 'Fleet Manager'
  | 'Operations Manager'
  | 'Dispatcher'
  | 'Analyst'
  | 'admin'
  | 'manager'
  | 'dispatcher'
  | 'analyst';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenResponse {
  accessToken: string;
}
