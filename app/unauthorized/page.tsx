"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IconLock, IconArrowLeft, IconDashboard, IconLogin } from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Define route permissions for display
const routePermissions: Record<string, string[]> = {
  '/dashboard': ['admin', 'manager', 'driver', 'customer', 'vendor'],
  '/admin': ['admin'],
  '/manager': ['admin', 'manager'],
  '/profile': ['admin', 'manager', 'driver', 'customer', 'vendor'],
  '/bookings': ['admin', 'manager', 'driver', 'customer', 'vendor'],
  '/vehicle': ['admin', 'manager', 'vendor'],
  '/driver': ['admin', 'manager', 'driver', 'vendor'],
  '/users': ['admin'],
  '/reports': ['admin', 'manager'],
  '/analytics': ['admin', 'manager'],
  '/customer': ['admin', 'manager'],
  '/invoice': ['admin', 'manager', 'customer'],
  '/order': ['admin', 'manager', 'customer', 'vendor'],
  '/order-request': ['admin', 'manager', 'customer'],
  '/quote': ['admin', 'manager', 'vendor'],
  '/search-shipments': ['admin', 'manager', 'customer'],
};

// Route descriptions for better UX
const routeDescriptions: Record<string, string> = {
  '/dashboard': 'Main dashboard with overview and quick actions',
  '/admin': 'Administrative panel for system management',
  '/manager': 'Manager-specific tools and reports',
  '/profile': 'Your profile settings and preferences',
  '/bookings': 'Booking management and history',
  '/vehicle': 'Vehicle fleet management',
  '/driver': 'Driver management and assignments',
  '/users': 'User management (admin only)',
  '/reports': 'System reports and analytics',
  '/analytics': 'Business analytics and insights',
  '/customer': 'Customer management',
  '/invoice': 'Invoice management and billing',
  '/order': 'Order management and tracking',
  '/order-request': 'Order requests and approvals',
  '/quote': 'Quote management and pricing',
  '/search-shipments': 'Search and track shipments',
};

function getRoleColor(role: string): string {
  switch (role) {
    case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'manager': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'driver': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'customer': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'vendor': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
}

export default function UnauthorizedPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user || !user.isAuthenticated) {
      const callbackUrl = searchParams.get('from') || searchParams.get('callbackUrl') || '/dashboard';
      window.location.href = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
    } else {
      setIsLoading(false);
    }
  }, [user, searchParams]);

  if (isLoading || !user || !user.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const attemptedRoute = searchParams.get('from') || 'unknown route';
  
  // Get routes accessible to the user
  const accessibleRoutes = Object.entries(routePermissions)
    .filter(([, roles]) => roles.includes(user.role))
    .map(([route]) => route);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <IconLock className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
            Access Denied
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            You don&apos;t have permission to access this page
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* User Info */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Logged in as:</p>
                <p className="font-semibold">{user.email}</p>
              </div>
              <Badge className={getRoleColor(user.role)}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Attempted Route */}
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              You attempted to access:
            </p>
            <code className="text-red-600 dark:text-red-400 font-mono text-lg">
              {attemptedRoute}
            </code>
          </div>

          <Separator />

          {/* Accessible Routes */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <IconDashboard className="h-5 w-5" />
              Pages you can access:
            </h3>
            
            <div className="space-y-3">
              {accessibleRoutes.map((route) => (
                <div key={route} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-blue-600 dark:text-blue-400 font-mono">
                          {route}
                        </code>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {routeDescriptions[route] || 'Access this section of the application'}
                      </p>
                    </div>
                    <Link href={route}>
                      <Button variant="outline" size="sm">
                        Visit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full" variant="default">
                <IconDashboard className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              onClick={() => window.history.back()} 
              className="flex-1"
            >
              <IconArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            
            <Link href="/login" className="flex-1">
              <Button variant="outline" className="w-full">
                <IconLogin className="h-4 w-4 mr-2" />
                Login as Different User
              </Button>
            </Link>
          </div>

          {/* Help Text */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p>
              If you believe you should have access to this page, please contact your administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
