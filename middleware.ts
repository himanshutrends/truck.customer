import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from './lib/types';
import { AuthManager } from './lib/auth-manager';

// Define route permissions
const routePermissions: Record<string, UserRole[]> = {
  '/dashboard': ['admin', 'manager', 'customer', 'vendor'],
  '/order': ['admin', 'manager', 'customer', 'vendor'],
  '/order-request': ['admin', 'manager', 'customer', 'vendor'],
  '/quote-requests': ['admin', 'manager', 'vendor', 'customer'],
  '/profile': ['admin', 'manager', 'customer', 'vendor'],
  '/search-shipments': ['admin', 'manager'],
  
  '/vehicle': ['admin', 'manager', 'vendor'],
  '/driver': ['admin', 'manager', 'vendor'],

  '/analytics': ['admin', 'manager', 'vendor'],
  '/customer': ['admin', 'manager'],
  '/invoice': ['admin', 'manager', 'customer', 'vendor'],
  
  '/unauthorized': ['admin', 'manager', 'driver', 'customer', 'vendor'],
};

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/order',
  '/order-request',
  '/quote',
  '/search-shipments',
  '/profile',

  '/vehicle',
  '/driver',
  
  '/analytics',
  '/customer',
  '/invoice',
];

// Public routes that should redirect to dashboard if authenticated
const authRoutes = ['/login', '/signup', '/forgot-password'];

// Public routes that don't require authentication and don't redirect
const publicRoutes = ['/results', '/unauthorized'];

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

function isAuthRoute(pathname: string): boolean {
  return authRoutes.some(route => pathname.startsWith(route));
}

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname.startsWith(route));
}

function hasPermission(userRole: string, pathname: string): boolean {
  // Check if route has specific role requirements
  for (const [route, allowedRoles] of Object.entries(routePermissions)) {
    if (pathname.startsWith(route)) {
      return allowedRoles.includes(userRole as UserRole);
    }
  }
  
  // If no specific permission is set, allow access for authenticated users
  return true;
}

function getRedirectUrl(userRole: string): string {
  switch (userRole) {
    case 'admin':
    case 'manager':
    case 'driver':
    case 'customer':
    case 'vendor':
    default:
      return '/dashboard'; // All authenticated users go to dashboard
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and API routes (except auth APIs)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  console.log('Middleware processing:', pathname);

  // Get user data from secure token manager
  let user = null;
  try {
    user = await AuthManager.getCurrentUser();
    console.log('User from token manager:', user ? `${user.email} (${user.role})` : 'null');
  } catch (error) {
    console.error('Error getting user data:', error);
    user = null;
  }

  // Handle public routes (don't redirect, allow access)
  if (isPublicRoute(pathname)) {
    console.log(`Allowing access to public route: ${pathname}`);
    return NextResponse.next();
  }

  // Handle authentication routes
  if (isAuthRoute(pathname)) {
    if (user) {
      // User is authenticated, redirect to appropriate dashboard
      const redirectUrl = getRedirectUrl(user.role);
      if (pathname !== redirectUrl) {
        console.log(`Redirecting authenticated user from ${pathname} to ${redirectUrl}`);
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    }
    // User is not authenticated, allow access to auth routes
    console.log(`Allowing access to auth route: ${pathname}`);
    return NextResponse.next();
  }

  // Handle protected routes
  if (isProtectedRoute(pathname)) {
    if (!user) {
      // User is not authenticated, redirect to login
      console.log(`Redirecting unauthenticated user from ${pathname} to /login`);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role-based permissions
    if (!hasPermission(user.role, pathname)) {
      // User doesn't have permission, redirect to unauthorized page
      console.log(`User ${user.email} doesn't have permission for ${pathname}, redirecting to unauthorized`);
      const unauthorizedUrl = new URL('/unauthorized', request.url);
      unauthorizedUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(unauthorizedUrl);
    }
    
    // User has permission, allow access
    console.log(`Allowing access to protected route: ${pathname} for user: ${user.email}`);
    return NextResponse.next();
  }

  // Handle root route
  if (pathname === '/') {
    if (user) {
      // Authenticated user, redirect to their dashboard
      console.log(`Redirecting authenticated user from ${pathname} to /dashboard`);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      // Not authenticated, redirect to login
      console.log(`Redirecting unauthenticated user from ${pathname} to /login`);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  console.log(`Allowing access to ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
