'use server';

import { AuthManager } from '@/lib/auth-manager';
import { authAPIGet, authAPIPost, authAPIPut, authAPIDelete } from '@/lib/api';
import { ApiResponse } from '@/lib/types';

export interface AssignedTruckInfo {
  id: string;
  registration_number: string;
  truck_type: string;
  capacity: string;
}

export interface Driver {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  license_number: string;
  license_expiry_date: string;
  experience_years: number;
  assigned_truck: string | null;
  assigned_truck_info: AssignedTruckInfo | null;
  profile_image: string | null;
  is_available: boolean;
  vendor_name: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get vendor's drivers from the API
 */
export async function getVendorDrivers(): Promise<ApiResponse<Driver[]>> {
  try {
    console.log("=== getVendorDrivers: Starting ===");

    // Check if user is authenticated
    const user = await AuthManager.getCurrentUser();
    if (!user) {
      console.log("getVendorDrivers: No user found");
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // Check if user is a vendor
    if (user.role !== 'vendor') {
      console.log(`getVendorDrivers: User role ${user.role} not allowed`);
      return {
        success: false,
        error: 'Access denied. Only vendors can view their drivers.'
      };
    }

    console.log(`getVendorDrivers: Making API request for user ${user.email}`);

    // Make API call using authAPIGet
    const response = await authAPIGet<Driver[]>('api/trucks/vendor/drivers/');

    console.log("getVendorDrivers: Request completed", response.success ? 'successfully' : 'with error');
    return response;
  } catch (error) {
    console.error('getVendorDrivers: Unexpected error:', error);
    return {
      success: false,
      error: 'Failed to fetch drivers. Please try again.'
    };
  }
}

/**
 * Get a specific driver by ID (vendor only)
 */
export async function getVendorDriverById(id: string): Promise<ApiResponse<Driver>> {
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
        error: 'Access denied. Only vendors can view their drivers.'
      };
    }

    const response = await authAPIGet<Driver>(`api/trucks/vendor/drivers/${id}`);
    return response;
  } catch (error) {
    console.error('getVendorDriverById: Unexpected error:', error);
    return {
      success: false,
      error: 'Failed to fetch driver details. Please try again.'
    };
  }
}

/**
 * Get all drivers (for admin/manager users)
 */
export async function getAllDrivers(): Promise<ApiResponse<Driver[]>> {
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
        error: 'Access denied. Only admins and managers can view all drivers.'
      };
    }

    const response = await authAPIGet<Driver[]>('api/drivers');
    return response;
  } catch (error) {
    console.error('getAllDrivers: Unexpected error:', error);
    return {
      success: false,
      error: 'Failed to fetch drivers. Please try again.'
    };
  }
}

/**
 * Get driver by ID
 */
export async function getDriverById(id: string): Promise<ApiResponse<Driver>> {
  try {
    const user = await AuthManager.getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    const response = await authAPIGet<Driver>(`api/drivers/${id}`);
    return response;
  } catch (error) {
    console.error('getDriverById: Unexpected error:', error);
    return {
      success: false,
      error: 'Failed to fetch driver details. Please try again.'
    };
  }
}

/**
 * Add a new driver (vendor only)
 */
export async function addDriver(driverData: Partial<Driver>): Promise<ApiResponse<Driver>> {
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
        error: 'Access denied. Only vendors can add drivers.'
      };
    }

    const response = await authAPIPost<Driver>('api/drivers', driverData);

    return response;
  } catch (error) {
    console.error('addDriver: Unexpected error:', error);
    return {
      success: false,
      error: 'Failed to add driver. Please try again.'
    };
  }
}

/**
 * Update driver (vendor only)
 */
export async function updateDriver(id: string, driverData: Partial<Driver>): Promise<ApiResponse<Driver>> {
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
        error: 'Access denied. Only vendors can update drivers.'
      };
    }

    const response = await authAPIPut<Driver>(`api/drivers/${id}`, driverData);

    return response;
  } catch (error) {
    console.error('updateDriver: Unexpected error:', error);
    return {
      success: false,
      error: 'Failed to update driver. Please try again.'
    };
  }
}

/**
 * Delete driver (vendor only)
 */
export async function deleteDriver(id: string): Promise<ApiResponse<{ message: string }>> {
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
        error: 'Access denied. Only vendors can delete drivers.'
      };
    }

    const response = await authAPIDelete<{ message: string }>(`api/drivers/${id}`);

    return response;
  } catch (error) {
    console.error('deleteDriver: Unexpected error:', error);
    return {
      success: false,
      error: 'Failed to delete driver. Please try again.'
    };
  }
}

/**
 * Assign truck to driver (vendor only)
 */
export async function assignTruckToDriver(driverId: string, truckId: string): Promise<ApiResponse<Driver>> {
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
        error: 'Access denied. Only vendors can assign trucks to drivers.'
      };
    }

    const response = await authAPIPut<Driver>(`api/drivers/${driverId}/assign-truck`, {
      truck_id: truckId
    });

    return response;
  } catch (error) {
    console.error('assignTruckToDriver: Unexpected error:', error);
    return {
      success: false,
      error: 'Failed to assign truck to driver. Please try again.'
    };
  }
}

/**
 * Unassign truck from driver (vendor only)
 */
export async function unassignTruckFromDriver(driverId: string): Promise<ApiResponse<Driver>> {
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
        error: 'Access denied. Only vendors can unassign trucks from drivers.'
      };
    }

    const response = await authAPIPut<Driver>(`api/drivers/${driverId}/unassign-truck`, {});

    return response;
  } catch (error) {
    console.error('unassignTruckFromDriver: Unexpected error:', error);
    return {
      success: false,
      error: 'Failed to unassign truck from driver. Please try again.'
    };
  }
}
