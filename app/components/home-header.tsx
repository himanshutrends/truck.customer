'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { IconTruckDelivery, IconLogin, IconDashboard, IconUserCircle } from '@tabler/icons-react';
import { SessionUser } from '@/lib/types';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth-context';

interface HomeHeaderProps {
  initialUser: SessionUser | null;
}

export function HomeHeader({ initialUser }: HomeHeaderProps) {
  const { user } = useAuth();
  
  // Use context user if available, fallback to initial user
  const currentUser = user || initialUser;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <IconTruckDelivery className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">TruckRent</span>
            </Link>
          </div>

          {/* User Authentication Status */}
          <div className="flex items-center space-x-4">
            {currentUser && currentUser.isAuthenticated ? (
              // Logged in user
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/profile.png" alt={currentUser.email} />
                    <AvatarFallback>
                      {currentUser.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      Welcome back, {currentUser.email.split('@')[0]}
                    </p>
                    <div className="flex items-center space-x-1">
                      <p className="text-xs text-gray-500">Role:</p>
                      <Badge variant="secondary" className="text-xs">
                        {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Link href="/dashboard">
                  <Button variant="default" size="sm" className="flex items-center space-x-1">
                    <IconDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
              </div>
            ) : (
              // Not logged in
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 hidden sm:inline">
                  Get access to your orders and more
                </span>
                <Link href="/login">
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <IconLogin className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="default" size="sm" className="flex items-center space-x-1">
                    <IconUserCircle className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
