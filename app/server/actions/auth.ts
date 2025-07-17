'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { TokenManager, getCurrentUser } from '@/lib/auth';
import { ApiResponse, AuthResponse, SessionUser } from '@/lib/types';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone_number: z.string().min(1, 'Phone number is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

interface ActionResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export async function loginAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    const validatedData = loginSchema.parse(rawData);

    const response = await fetch(`${process.env.API_BASE_URL}/api/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        message: errorData?.message || 'Login failed',
        errors: errorData?.errors,
      };
    }

    const data: ApiResponse<AuthResponse> = await response.json();

    if (!data.success || !data.data) {
      return {
        success: false,
        message: data.message || 'Login failed',
      };
    }

    // Store tokens in HTTP-only cookies
    await TokenManager.setTokens(
      data.data.tokens.access,
      data.data.tokens.refresh
    );

    // Redirect based on user role
    const userRole = data.data.user.role;
    let redirectPath = '/dashboard';

    switch (userRole) {
      case 'admin':
        redirectPath = '/admin/dashboard';
        break;
      case 'manager':
        redirectPath = '/manager/dashboard';
        break;
      case 'driver':
        redirectPath = '/driver/dashboard';
        break;
      case 'customer':
      default:
        redirectPath = '/dashboard';
        break;
    }

    redirect(redirectPath);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      const processedErrors: Record<string, string[]> = {};
      
      Object.entries(fieldErrors).forEach(([key, value]) => {
        if (value) {
          processedErrors[key] = value;
        }
      });

      return {
        success: false,
        message: 'Validation failed',
        errors: processedErrors,
      };
    }

    console.error('Login error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}

export async function signupAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      phone_number: formData.get('phone_number'),
    };

    const validatedData = signupSchema.parse(rawData);

    const response = await fetch(`${process.env.API_BASE_URL}/api/auth/signup/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        message: errorData?.message || 'Signup failed',
        errors: errorData?.errors,
      };
    }

    const data: ApiResponse<AuthResponse> = await response.json();

    if (!data.success || !data.data) {
      return {
        success: false,
        message: data.message || 'Signup failed',
      };
    }

    // Store tokens in HTTP-only cookies
    await TokenManager.setTokens(
      data.data.tokens.access,
      data.data.tokens.refresh
    );

    // Redirect to customer dashboard (new users are customers by default)
    redirect('/dashboard');
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      const processedErrors: Record<string, string[]> = {};
      
      Object.entries(fieldErrors).forEach(([key, value]) => {
        if (value) {
          processedErrors[key] = value;
        }
      });

      return {
        success: false,
        message: 'Validation failed',
        errors: processedErrors,
      };
    }

    console.error('Signup error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}

export async function forgotPasswordAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = {
      email: formData.get('email'),
    };

    const validatedData = forgotPasswordSchema.parse(rawData);

    const response = await fetch(`${process.env.API_BASE_URL}/api/auth/forgot-password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        message: errorData?.message || 'Failed to send reset email',
        errors: errorData?.errors,
      };
    }

    return {
      success: true,
      message: 'Password reset email sent successfully',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      const processedErrors: Record<string, string[]> = {};
      
      Object.entries(fieldErrors).forEach(([key, value]) => {
        if (value) {
          processedErrors[key] = value;
        }
      });

      return {
        success: false,
        message: 'Validation failed',
        errors: processedErrors,
      };
    }

    console.error('Forgot password error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}

export async function logoutAction(): Promise<void> {
  try {
    // Clear tokens from cookies
    await TokenManager.clearTokens();
    
    // Optionally call backend logout endpoint to invalidate tokens
    // This is a fire-and-forget operation
    const refreshToken = await TokenManager.getRefreshToken();
    if (refreshToken) {
      fetch(`${process.env.API_BASE_URL}/api/auth/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      }).catch(() => {
        // Ignore errors as tokens are already cleared locally
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  redirect('/login');
}

export async function getCurrentUserAction(): Promise<SessionUser | null> {
  try {
    const user = await getCurrentUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function refreshTokenAction(): Promise<{ success: boolean; error?: string }> {
  try {
    const refreshToken = await TokenManager.getRefreshToken();
    
    if (!refreshToken) {
      return { success: false, error: 'No refresh token found' };
    }

    const response = await fetch(`${process.env.API_BASE_URL}/api/auth/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      await TokenManager.clearTokens();
      return { success: false, error: 'Token refresh failed' };
    }

    const data: ApiResponse<{ access: string }> = await response.json();
    
    if (data.success && data.data?.access) {
      await TokenManager.setTokens(data.data.access, refreshToken);
      return { success: true };
    }

    await TokenManager.clearTokens();
    return { success: false, error: 'Invalid refresh response' };
  } catch (error) {
    console.error('Token refresh error:', error);
    await TokenManager.clearTokens();
    return { success: false, error: 'Token refresh failed' };
  }
}
