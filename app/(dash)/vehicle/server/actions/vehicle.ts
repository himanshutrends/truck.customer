'use server';

import { AuthManager } from '@/lib/auth-manager';
import { ApiHandler } from '@/lib/api';
import { ApiResponse } from '@/lib/types';

export interface VehicleType {
  created_at: string;
  id: number;
  description: string;
  name: string;
}

export interface Vehicle {
  id: string;
  truck_type: VehicleType;
  registration_number: string;
  capacity: string;
  make: string;
  model: string;
  year: string;
  color: string;
  availability_status: string;
  base_price_per_km: string;
  current_location_latitude: string;
  current_location_longitude: string;
  current_location_address: string;
  vendor_name: string;
  vendor_phone: string;
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Get vendor's trucks from the API
 */
export async function getVendorTrucks(): Promise<ApiResponse<Vehicle[]>> {
  try {
    console.log("=== getVendorTrucks: Starting ===");

    // Check if user is authenticated
    const user = await AuthManager.getCurrentUser();
    if (!user) {
      console.log("getVendorTrucks: No user found");
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // Check if user is a vendor
    if (user.role !== 'vendor') {
      console.log(`getVendorTrucks: User role ${user.role} not allowed`);
      return {
        success: false,
        error: 'Access denied. Only vendors can view their trucks.'
      };
    }

    console.log(`getVendorTrucks: Making API request for user ${user.email}`);

    // Make API call using ApiHandler
    const response = await ApiHandler.authGet<Vehicle[]>('api/trucks/vendor/my-trucks');

    console.log("getVendorTrucks: Request completed", response.success ? 'successfully' : 'with error');
    return response;
  } catch (error) {
    console.error('getVendorTrucks: Unexpected error:', error);
    return {
      success: false,
      error: 'Failed to fetch vehicles. Please try again.'
    };
  }
}

/**
 * Get all vehicles (for admin/manager users)
 */
export async function getAllVehicles(): Promise<ApiResponse<Vehicle[]>> {
  try {
    const user = await AuthManager.getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    if (!['admin', 'manager'].includes(user.role)) {
      return {
        success: false,
        error: 'Access denied. Only admins and managers can view all vehicles.'
      };
    }

    const response = await ApiHandler.authGet<Vehicle[]>('api/trucks');
    return response;
  } catch (error) {
    console.error('getAllVehicles: Unexpected error:', error);
    return {
      success: false,
      error: 'Failed to fetch vehicles. Please try again.'
    };
  }
}

/**
 * Get vehicle by ID
 */
export async function getVehicleById(id: string): Promise<ApiResponse<Vehicle>> {
  try {
    const user = await AuthManager.getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    const response = await ApiHandler.authGet<Vehicle>(`api/trucks/${id}`);
    return response;
  } catch (error) {
    console.error('getVehicleById: Unexpected error:', error);
    return {
      success: false,
      error: 'Failed to fetch vehicle details. Please try again.'
    };
  }
}

/**
 * Add a new vehicle (vendor only)
 */
export async function addVehicle(vehicleData: Partial<Vehicle>): Promise<ApiResponse<Vehicle>> {
  try {
    const user = await AuthManager.getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    if (user.role !== 'vendor') {
      return {
        success: false,
        error: 'Access denied. Only vendors can add vehicles.'
      };
    }

    const response = await ApiHandler.authPost<Vehicle>('api/trucks', vehicleData);

    return response;
  } catch (error) {
    console.error('addVehicle: Unexpected error:', error);
    return {
      success: false,
      error: 'Failed to add vehicle. Please try again.'
    };
  }
}

/**
 * Update vehicle (vendor only)
 */
export async function updateVehicle(id: string, vehicleData: Partial<Vehicle>): Promise<ApiResponse<Vehicle>> {
  try {
    const user = await AuthManager.getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    if (user.role !== 'vendor') {
      return {
        success: false,
        error: 'Access denied. Only vendors can update vehicles.'
      };
    }

    const response = await ApiHandler.authPut<Vehicle>(`api/trucks/${id}`, vehicleData);

    return response;
  } catch (error) {
    console.error('updateVehicle: Unexpected error:', error);
    return {
      success: false,
      error: 'Failed to update vehicle. Please try again.'
    };
  }
}

/**
 * Delete vehicle (vendor only)
 */
export async function deleteVehicle(id: string): Promise<ApiResponse<{ message: string }>> {
  try {
    const user = await AuthManager.getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    if (user.role !== 'vendor') {
      return {
        success: false,
        error: 'Access denied. Only vendors can delete vehicles.'
      };
    }

    const response = await ApiHandler.authDelete<{ message: string }>(`api/trucks/${id}`);

    return response;
  } catch (error) {
    console.error('deleteVehicle: Unexpected error:', error);
    return {
      success: false,
      error: 'Failed to delete vehicle. Please try again.'
    };
  }
}
