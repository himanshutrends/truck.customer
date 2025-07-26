import { getTokenAction } from '@/app/(auth)/login/server/actions/auth';
import { AuthManager } from './auth-manager';
import { ApiResponse } from './types';

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: Record<string, unknown> | FormData;
  headers?: Record<string, string>;
  requireAuth?: boolean;
}

export class ApiHandler {
  /**
   * Make an API request (authenticated or public)
   */
  static async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const {
        method = 'GET',
        body,
        headers = {},
        requireAuth = false
      } = options;

      // Build URL
      const url = `${API_BASE_URL}/${endpoint.replace(/^\//, '')}`;

      // Prepare headers
      const requestHeaders: Record<string, string> = {
        ...headers,
      };

      // Add Content-Type if body is not FormData
      if (body && !(body instanceof FormData)) {
        requestHeaders['Content-Type'] = 'application/json';
      }

      // Add authorization header if auth is required
      if (requireAuth) {
        const token = await getTokenAction();
        console.log("API Request Token from request handler:", token);
        if (!token) {
          return {
            success: false,
            error: 'Authentication required',
          };
        }
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }

      // Prepare body
      let requestBody: string | FormData | undefined;
      if (body) {
        requestBody = body instanceof FormData ? body : JSON.stringify(body);
      }

      console.log(`API Request: ${method} ${url}`, {
        headers: requestHeaders,
        body: requestBody,
      });

      // Make request
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: requestBody,
      });
      
      console.log(`API Response: ${response.status} ${response.statusText}`);


      // Handle response
      if (!response.ok) {
        if (response.status === 401 && requireAuth) {
          // Token expired, clear auth data
          await AuthManager.clearTokens();
          return {
            success: false,
            error: 'Authentication expired',
          };
        }

        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.message || errorData.detail || `HTTP ${response.status}`,
          data: errorData,
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Convenience methods for authenticated requests
  static async authGet<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', requireAuth: true, headers });
  }

  static async authPost<T>(endpoint: string, body?: Record<string, unknown>, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body, requireAuth: true, headers });
  }

  static async authPut<T>(endpoint: string, body?: Record<string, unknown>, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body, requireAuth: true, headers });
  }

  static async authPatch<T>(endpoint: string, body?: Record<string, unknown>, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', body, requireAuth: true, headers });
  }

  static async authDelete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', requireAuth: true, headers });
  }

  // Convenience methods for public requests
  static async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  static async post<T>(endpoint: string, body?: Record<string, unknown>, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body, headers });
  }

  static async put<T>(endpoint: string, body?: Record<string, unknown>, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body, headers });
  }

  static async patch<T>(endpoint: string, body?: Record<string, unknown>, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', body, headers });
  }

  static async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }

  // File upload methods
  static async authUpload<T>(endpoint: string, formData: FormData, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body: formData, requireAuth: true, headers });
  }

  static async upload<T>(endpoint: string, formData: FormData, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body: formData, headers });
  }
}
