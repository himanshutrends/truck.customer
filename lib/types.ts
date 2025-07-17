export interface User {
  email: string;
  role: string;
  phone_number: string;
}

export interface Tokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: User;
  tokens: Tokens;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export type UserRole = 'admin' | 'customer' | 'driver' | 'manager';

export interface SessionUser extends User {
  isAuthenticated: boolean;
}
