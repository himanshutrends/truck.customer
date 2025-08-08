'use server';
import { redirect, RedirectType } from 'next/navigation'
import { AuthManager } from '@/lib/auth-manager';
import { apiPost } from '@/lib/api';
import { SessionUser, User } from '@/lib/types';
import { loginSchema, signupSchema, forgotPasswordSchema, ActionResult } from '../helpers/auth';
import { z } from 'zod';

/**
 * Login action
 */
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
    const response = await AuthManager.login(validatedData.email, validatedData.password);

    if (!response.success || !response.data) {
      return {
        success: false,
        message: response.error || 'Login failed',
      };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.issues.forEach((issue) => {
        if (issue.path) {
          const field = issue.path.join('.');
          errors[field] = errors[field] || [];
          errors[field].push(issue.message);
        }
      });
      return {
        success: false,
        message: 'Validation failed',
        errors,
      };
    }
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }

  // Redirect based on user role
  const redirectPath = '/dashboard';
  redirect(redirectPath, RedirectType.push);

}

/**
 * Signup action
 */
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

    // Make API call to signup endpoint
    const response = await apiPost<{ user: User; tokens: { access: string; refresh: string } }>(
      'api/auth/signup/',
      validatedData
    );

    if (!response.success || !response.data) {
      return {
        success: false,
        message: response.error || 'Signup failed',
      };
    }

    // Store tokens and user data
    await AuthManager.setTokens(response.data.tokens.access, response.data.tokens.refresh, response.data.user);

    redirect('/dashboard');

  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.issues.forEach((issue) => {
        if (issue.path) {
          const field = issue.path.join('.');
          errors[field] = errors[field] || [];
          errors[field].push(issue.message);
        }
      });
      return {
        success: false,
        message: 'Validation failed',
        errors,
      };
    }

    console.error('Signup error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}

/**
 * Forgot password action
 */
export async function forgotPasswordAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = {
      email: formData.get('email'),
    };

    const validatedData = forgotPasswordSchema.parse(rawData);

    // Make API call to forgot password endpoint
    const response = await apiPost<{ message: string }>(
      'api/auth/forgot-password/',
      validatedData
    );

    if (!response.success) {
      return {
        success: false,
        message: response.error || 'Failed to send reset email',
      };
    }

    return {
      success: true,
      message: 'Password reset email sent successfully',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.issues.forEach((issue) => {
        if (issue.path) {
          const field = issue.path.join('.');
          errors[field] = errors[field] || [];
          errors[field].push(issue.message);
        }
      });
      return {
        success: false,
        message: 'Validation failed',
        errors,
      };
    }

    console.error('Forgot password error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}

/**
 * Get current user - for use in client components via server actions
 */
export async function getCurrentUserAction(): Promise<SessionUser | null> {
  try {
    return await AuthManager.getCurrentUser();
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Token action - for use in client components
 */
export async function getTokenAction(): Promise<string | null> {
  try {
    const access_token = await AuthManager.getAccessToken();
    if (!access_token) {
      return null;
    }
    return access_token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
}

/**
 * Logout action - for use in client components
 */
export async function logoutAction(): Promise<void> {
  try {
    await AuthManager.logout();
  } catch (error) {
    console.error('Error during logout:', error);
  }
  redirect('/login');
}
