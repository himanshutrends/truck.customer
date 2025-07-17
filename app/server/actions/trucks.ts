'use server';

import { z } from 'zod';
import { TokenManager } from '@/lib/auth';
import { ApiResponse } from '@/lib/types';

interface Truck {
  id: string;
  name: string;
  type: string;
  capacity: string;
  price_per_day: number;
  available: boolean;
  location: string;
  image_url?: string;
}

interface Booking {
  id: string;
  truck_id: string;
  truck_name: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
}

const bookingSchema = z.object({
  truck_id: z.string().min(1, 'Truck ID is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
});

interface ActionResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: unknown;
}

export async function getTrucksAction(): Promise<ActionResult> {
  try {
    const token = await TokenManager.getAccessToken();
    
    const response = await fetch(`${process.env.API_BASE_URL}/api/trucks/`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      return {
        success: false,
        message: 'Failed to fetch trucks',
      };
    }

    const data: ApiResponse<Truck[]> = await response.json();

    return {
      success: true,
      data: data.data || [],
    };
  } catch (error) {
    console.error('Error fetching trucks:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}

export async function createBookingAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const token = await TokenManager.getAccessToken();
    
    if (!token) {
      return {
        success: false,
        message: 'You must be logged in to create a booking',
      };
    }

    const rawData = {
      truck_id: formData.get('truck_id'),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date'),
    };

    const validatedData = bookingSchema.parse(rawData);

    const response = await fetch(`${process.env.API_BASE_URL}/api/bookings/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        message: errorData?.message || 'Failed to create booking',
        errors: errorData?.errors,
      };
    }

    const data: ApiResponse<Booking> = await response.json();

    return {
      success: true,
      message: 'Booking created successfully',
      data: data.data,
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

    console.error('Error creating booking:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}

export async function getUserBookingsAction(): Promise<ActionResult> {
  try {
    const token = await TokenManager.getAccessToken();
    
    if (!token) {
      return {
        success: false,
        message: 'You must be logged in to view bookings',
      };
    }

    const response = await fetch(`${process.env.API_BASE_URL}/api/bookings/my-bookings/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        message: 'Failed to fetch bookings',
      };
    }

    const data: ApiResponse<Booking[]> = await response.json();

    return {
      success: true,
      data: data.data || [],
    };
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}

export async function cancelBookingAction(bookingId: string): Promise<ActionResult> {
  try {
    const token = await TokenManager.getAccessToken();
    
    if (!token) {
      return {
        success: false,
        message: 'You must be logged in to cancel a booking',
      };
    }

    const response = await fetch(`${process.env.API_BASE_URL}/api/bookings/${bookingId}/cancel/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        message: errorData?.message || 'Failed to cancel booking',
      };
    }

    return {
      success: true,
      message: 'Booking cancelled successfully',
    };
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}
