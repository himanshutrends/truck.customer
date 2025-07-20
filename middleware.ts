import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { UserRole, User } from './lib/types';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

// Define route permissions
const routePermissions: Record<string, UserRole[]> = {
  '/admin': ['admin'],
  '/manager': ['admin', 'manager'],
  '/driver': ['admin', 'manager', 'driver'],
  '/dashboard': ['admin', 'manager', 'driver', 'customer'],
  '/profile': ['admin', 'manager', 'driver', 'customer'],
  '/bookings': ['admin', 'manager', 'driver', 'customer'],
  '/trucks': ['admin', 'manager'],
  '/users': ['admin'],
  '/reports': ['admin', 'manager'],
};

// Protected routes that require authentication
const protectedRoutes = [
  // '/dashboard',
  // '/profile',
  // '/bookings',
  '/admin',
  // '/manager',
  // '/driver',
  // '/trucks',
  // '/users',
  // '/reports',
];

// Public routes that should redirect to dashboard if authenticated
const authRoutes = ['/login', '/signup', '/forgot-password'];

async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as User;
  } catch {
    return null;
  }
}

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

function isAuthRoute(pathname: string): boolean {
  return authRoutes.some(route => pathname.startsWith(route));
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
      return '/admin/dashboard';
    case 'manager':
      return '/manager/dashboard';
    case 'driver':
      return '/driver/dashboard';
    case 'customer':
    default:
      return '/dashboard';
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

  const accessToken = request.cookies.get('access_token')?.value;
  const user = accessToken ? await verifyToken(accessToken) : null;

  // Handle authentication routes
  if (isAuthRoute(pathname)) {
    if (user) {
      // User is authenticated, redirect to appropriate dashboard
      const redirectUrl = getRedirectUrl(user.role);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    // User is not authenticated, allow access to auth routes
    return NextResponse.next();
  }

  // Handle protected routes
  if (isProtectedRoute(pathname)) {
    if (!user) {
      // User is not authenticated, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check role-based permissions
    if (!hasPermission(user.role, pathname)) {
      // User doesn't have permission, redirect to their dashboard
      const redirectUrl = getRedirectUrl(user.role);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // Handle root route
  if (pathname === '/') {
    if (user) {
      // Authenticated user, redirect to their dashboard
      const redirectUrl = getRedirectUrl(user.role);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    } else {
      // Not authenticated, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

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
