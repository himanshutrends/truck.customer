import { ApiResponse } from './types';

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  requireAuth?: boolean;
}

class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      requireAuth = false,
    } = config;

    const requestHeaders = { 
      ...this.defaultHeaders, 
      ...headers,
      // Add credentials to include cookies automatically
      ...(requireAuth && { 'credentials': 'include' })
    };

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      credentials: requireAuth ? 'include' : 'same-origin',
    };

    if (body && method !== 'GET') {
      requestConfig.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, requestConfig);
      
      if (!response.ok) {
        // Handle 401 unauthorized
        if (response.status === 401 && requireAuth) {
          // Clear any client state and redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          
          throw new ApiError(401, 'Session expired - Please login again');
        }

        const errorData = await response.json().catch(() => null);
        throw new ApiError(
          response.status,
          errorData?.message || response.statusText,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        500,
        'Network error - Please check your connection',
        error
      );
    }
  }

  // Convenience methods
  async get<T>(endpoint: string, requireAuth = false): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', requireAuth });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    requireAuth = false
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body, requireAuth });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    requireAuth = false
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body, requireAuth });
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    requireAuth = false
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', body, requireAuth });
  }

  async delete<T>(endpoint: string, requireAuth = false): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', requireAuth });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

export { ApiError };
