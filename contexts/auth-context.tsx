'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SessionUser } from '@/lib/types';
import { getCurrentUserAction, logoutAction } from '@/app/(auth)/login/server/actions/auth';

interface AuthContextType {
  user: SessionUser | null;
  loading: boolean;
  logout: () => void;
  updateUser: (userData: Partial<SessionUser>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser?: SessionUser | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<SessionUser | null>(initialUser || null);
  const [loading, setLoading] = useState(!initialUser);

  // Initialize user from server-side data
  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
      setLoading(false);
    } else {
      // Get user from server action
      refreshUser();
    }
  }, [initialUser]);

  const refreshUser = async () => {
    try {
      setLoading(true);
      const userData = await getCurrentUserAction();
      setUser(userData);
    } catch (error) {
      console.error('Error getting user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutAction();
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if server logout fails
      setUser(null);
      window.location.href = '/login';
    }
  };

  const updateUser = (userData: Partial<SessionUser>) => {
    if (user) {
      setUser({
        ...user,
        ...userData,
      });
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
