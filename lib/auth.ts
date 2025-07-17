import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { User, SessionUser } from './types';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export const TOKEN_NAMES = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
} as const;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

// Token management using Next.js cookies
export class TokenManager {
  static async setTokens(accessToken: string, refreshToken: string) {
    const cookieStore = await cookies();
    
    cookieStore.set(TOKEN_NAMES.ACCESS, accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60, // 15 minutes
    });

    cookieStore.set(TOKEN_NAMES.REFRESH, refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
  }

  static async getAccessToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(TOKEN_NAMES.ACCESS)?.value || null;
  }

  static async getRefreshToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(TOKEN_NAMES.REFRESH)?.value || null;
  }

  static async clearTokens() {
    const cookieStore = await cookies();
    cookieStore.delete(TOKEN_NAMES.ACCESS);
    cookieStore.delete(TOKEN_NAMES.REFRESH);
  }

  static async verifyToken(token: string): Promise<User | null> {
    try {
      const { payload } = await jwtVerify(token, secret);
      return payload as unknown as User;
    } catch {
      return null;
    }
  }
}

// Helper function to get current user from token
export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = await TokenManager.getAccessToken();
  
  if (!token) {
    return null;
  }

  const user = await TokenManager.verifyToken(token);
  
  if (!user) {
    return null;
  }

  return {
    ...user,
    isAuthenticated: true,
  };
}
