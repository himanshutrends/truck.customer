import { User, SessionUser, ApiResponse } from './types';

// Re-export server actions for backward compatibility
export {
  setTokens,
  getAccessToken,
  getRefreshToken,
  getUserData,
  clearTokens,
  verifyToken,
  getCurrentUser,
  apiRequest,
  login,
  logout
} from './server/auth-actions';

// Export legacy class interface for backward compatibility
export class AuthManager {
  static async setTokens(accessToken: string, refreshToken: string, userData: User): Promise<void> {
    const { setTokens } = await import('./server/auth-actions');
    return setTokens(accessToken, refreshToken, userData);
  }

  static async getAccessToken(): Promise<string | null> {
    const { getAccessToken } = await import('./server/auth-actions');
    return getAccessToken();
  }

  static async getRefreshToken(): Promise<string | null> {
    const { getRefreshToken } = await import('./server/auth-actions');
    return getRefreshToken();
  }

  static async getUserData(): Promise<User | null> {
    const { getUserData } = await import('./server/auth-actions');
    return getUserData();
  }

  static async clearTokens(): Promise<void> {
    const { clearTokens } = await import('./server/auth-actions');
    return clearTokens();
  }

  static async verifyToken(token: string): Promise<User | null> {
    const { verifyToken } = await import('./server/auth-actions');
    return verifyToken(token);
  }

  static async getCurrentUser(): Promise<SessionUser | null> {
    const { getCurrentUser } = await import('./server/auth-actions');
    return getCurrentUser();
  }

  static async apiRequest<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      body?: Record<string, unknown>;
      headers?: Record<string, string>;
    } = {}
  ): Promise<ApiResponse<T>> {
    const { apiRequest } = await import('./server/auth-actions');
    return apiRequest<T>(endpoint, options);
  }

  static async login(email: string, password: string): Promise<ApiResponse<{ user: User; tokens: { access: string; refresh: string } }>> {
    const { login } = await import('./server/auth-actions');
    return login(email, password);
  }

  static async logout(): Promise<void> {
    const { logout } = await import('./server/auth-actions');
    return logout();
  }
}
