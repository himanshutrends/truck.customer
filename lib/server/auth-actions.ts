'use server';

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import CryptoJS from 'crypto-js';
import { User, SessionUser, ApiResponse } from '../types';

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY || 'your-encryption-key';

const secret = new TextEncoder().encode(JWT_SECRET);

// Cookie configuration
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

// Token names
const TOKEN_NAMES = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
  USER: 'user_data',
};

// Encryption utilities
class Crypto {
  static encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  }

  static decrypt(encryptedText: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      // Check if decryption was successful
      if (!decrypted) {
        throw new Error('Decryption failed - empty result');
      }

      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data - possibly corrupted or wrong key');
    }
  }
}

/**
 * Store encrypted tokens and user data
 */
export async function setTokens(accessToken: string, refreshToken: string, userData: User): Promise<void> {
  try {
    const cookieStore = await cookies();

    // Encrypt and store tokens
    const encryptedAccess = Crypto.encrypt(accessToken);
    const encryptedRefresh = Crypto.encrypt(refreshToken);
    const encryptedUser = Crypto.encrypt(JSON.stringify(userData));

    cookieStore.set(TOKEN_NAMES.ACCESS, encryptedAccess, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    cookieStore.set(TOKEN_NAMES.REFRESH, encryptedRefresh, {
      ...COOKIE_OPTIONS,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    cookieStore.set(TOKEN_NAMES.USER, encryptedUser, {
      ...COOKIE_OPTIONS,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
  } catch (error) {
    console.error('Failed to set tokens:', error);
    throw new Error('Failed to store authentication tokens');
  }
}

/**
 * Get decrypted access token
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const encryptedToken = cookieStore.get(TOKEN_NAMES.ACCESS)?.value;
    if (!encryptedToken) {
      return null;
    }
    return Crypto.decrypt(encryptedToken);
  } catch (error) {
    console.error('Failed to get access token:', error);
    // Clear corrupted token
    await clearTokens();
    return null;
  }
}

/**
 * Get decrypted refresh token
 */
export async function getRefreshToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const encryptedToken = cookieStore.get(TOKEN_NAMES.REFRESH)?.value;

    if (!encryptedToken) {
      return null;
    }

    return Crypto.decrypt(encryptedToken);
  } catch (error) {
    console.error('Failed to get refresh token:', error);
    // Clear corrupted token
    await clearTokens();
    return null;
  }
}

/**
 * Get user data from storage
 */
export async function getUserData(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const encryptedData = cookieStore.get(TOKEN_NAMES.USER)?.value;

    if (!encryptedData) {
      return null;
    }

    const decryptedData = Crypto.decrypt(encryptedData);
    return JSON.parse(decryptedData) as User;
  } catch (error) {
    console.error('Failed to get user data:', error);
    // Clear corrupted data
    await clearTokens();
    return null;
  }
}

/**
 * Clear all authentication data
 */
export async function clearTokens(): Promise<void> {
  try {
    const cookieStore = await cookies();

    cookieStore.set(TOKEN_NAMES.ACCESS, '', {
      ...COOKIE_OPTIONS,
      expires: new Date(0),
    });

    cookieStore.set(TOKEN_NAMES.REFRESH, '', {
      ...COOKIE_OPTIONS,
      expires: new Date(0),
    });

    cookieStore.set(TOKEN_NAMES.USER, '', {
      ...COOKIE_OPTIONS,
      expires: new Date(0),
    });
  } catch (error) {
    console.error('Failed to clear tokens:', error);
    // Don't throw here as this is often called during error recovery
  }
}

/**
 * Verify JWT token
 */
export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as User;
  } catch {
    return null;
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    // Try to get user data from storage first
    const userData = await getUserData();

    if (userData) {
      return {
        ...userData,
        isAuthenticated: true,
      };
    }

    // Fallback to token verification
    const token = await getAccessToken();
    if (!token) {
      return null;
    }

    const user = await verifyToken(token);
    if (!user) {
      await clearTokens();
      return null;
    }

    return {
      ...user,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

/**
 * Make authenticated API request
 */
export async function apiRequest<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: Record<string, unknown>;
    headers?: Record<string, string>;
  } = {}
): Promise<ApiResponse<T>> {
  // Import here to avoid circular dependency
  const { ApiHandler } = await import('../api');

  return ApiHandler.request<T>(endpoint, {
    ...options,
    requireAuth: true,
  });
}

/**
 * Login user
 */
export async function login(email: string, password: string): Promise<ApiResponse<{ user: User; tokens: { access: string; refresh: string } }>> {
  // Import here to avoid circular dependency
  const { ApiHandler } = await import('../api');

  const response = await ApiHandler.post<{ user: User; tokens: { access: string; refresh: string } }>(
    'api/auth/login/',
    { email, password }
  );

  if (response.success && response.data) {
    // Store tokens and user data
    await setTokens(response.data.tokens.access, response.data.tokens.refresh, response.data.user);
  }

  return response;
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  await clearTokens();
}
