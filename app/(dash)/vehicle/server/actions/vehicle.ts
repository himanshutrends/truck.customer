import { AuthManager } from '@/lib/auth-manager';
import { authAPIGet, authAPIPost, authAPIPut, authAPIDelete } from '@/lib/api';
import { ApiResponse, Vehicle, VehicleType } from '@/lib/types';

/**
 * Get vendor's trucks from the API (all trucks)
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

    // Make API call using authAPIGet
    const response = await authAPIGet<Vehicle[]>('api/trucks/vendor/my-trucks');

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
 * Get a specific vendor truck by ID
 */
export async function getVendorTruckById(id: string): Promise<ApiResponse<Vehicle>> {
  try {
    console.log("=== getVendorTruckById: Starting ===");

    // Check if user is authenticated
    const user = await AuthManager.getCurrentUser();
    if (!user) {
      console.log("getVendorTruckById: No user found");
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // Check if user is a vendor
    if (user.role !== 'vendor') {
      console.log(`getVendorTruckById: User role ${user.role} not allowed`);
      return {
        success: false,
        error: 'Access denied. Only vendors can view their trucks.'
      };
    }

    // Make API call using authAPIGet
    const response = await authAPIGet<Vehicle>(`api/trucks/vendor/my-trucks/${id}`);

    console.log("getVendorTruckById: Request completed", response.success ? 'successfully' : 'with error');
    return response;
  } catch (error) {
    console.error('getVendorTruckById: Unexpected error:', error);
    return {
      success: false,
      error: 'Failed to fetch vehicle details. Please try again.'
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

    const response = await authAPIGet<Vehicle[]>('api/trucks/');
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

    const response = await authAPIGet<Vehicle>(`api/trucks/${id}`);
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

    const response = await authAPIPost<Vehicle>('api/trucks', vehicleData);

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

    const response = await authAPIPut<Vehicle>(`api/trucks/${id}`, vehicleData);

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

    const response = await authAPIDelete<{ message: string }>(`api/trucks/${id}`);

    return response;
  } catch (error) {
    console.error('deleteVehicle: Unexpected error:', error);
    return {
      success: false,
      error: 'Failed to delete vehicle. Please try again.'
    };
  }
}
