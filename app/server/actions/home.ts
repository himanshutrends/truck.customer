'use server';

import { authAPIPost, apiGet } from '@/lib/api';
import { AuthManager } from '@/lib/auth-manager';
import { ApiResponse, TruckType } from '@/lib/types';
import { VehicleDetails, QuotationSearchParams } from '@/contexts/quotation-context';
import { searchTrucks } from './trucks';

// Backend-compatible quotation request structure
export interface QuotationRequestPayload {
  vendor_id: number;
  vendor_name: string;
  total_amount: number;
  origin_pincode: string;
  destination_pincode: string;
  pickup_date: string; // ISO string
  drop_date: string; // ISO string
  weight: string;
  weight_unit: string;
  vehicle_type?: string;
  urgency_level: string;
  customer_proposed_amount?: number;
  customer_negotiation_message?: string;
  items: QuotationRequestItem[];
}

export interface QuotationRequestItem {
  vehicle_id: number;
  vehicle_model: string;
  vehicle_type: string;
  max_weight: string;
  gps_number: string;
  unit_price: string;
  quantity: number;
  estimated_delivery: string;
}

export interface QuotationRequestResponse {
  id: string;
  quotation_request_id: string;
  status: string;
  message: string;
}

/**
 * Get truck types for search form
 */
export async function getTruckTypes(): Promise<TruckType[]> {
  try {
    const response = await apiGet<TruckType[]>('api/trucks/types');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch truck types');
  } catch (error) {
    console.error('Error in getTruckTypes:', error);
    return []; // Return empty array instead of throwing
  }
}

/**
 * Search for trucks based on search parameters
 */
export async function searchForTrucks(searchData: {
  originPincode: string;
  destinationPincode: string;
  weight: number;
  weightUnit: 'kg' | 'tonnes';
  vehicleType?: string;
  pickupDate: Date;
  dropDate: Date;
  urgencyLevel: 'standard' | 'express' | 'urgent';
}): Promise<{ success: boolean; data?: VehicleDetails[]; error?: string }> {
  try {
    // Validate input
    if (!searchData.originPincode || !searchData.destinationPincode) {
      return {
        success: false,
        error: 'Origin and destination pincode are required'
      };
    }

    if (searchData.originPincode === searchData.destinationPincode) {
      return {
        success: false,
        error: 'Origin and destination pincode cannot be the same'
      };
    }

    if (searchData.weight <= 0) {
      return {
        success: false,
        error: 'Weight must be greater than 0'
      };
    }

    if (searchData.dropDate <= searchData.pickupDate) {
      return {
        success: false,
        error: 'Drop date must be after pickup date'
      };
    }

    // Convert to quotation search params format
    const quotationParams: QuotationSearchParams = {
      originPinCode: searchData.originPincode,
      destinationPinCode: searchData.destinationPincode,
      originLocation: searchData.originPincode,
      destinationLocation: searchData.destinationPincode,
      weight: searchData.weight,
      weightUnit: searchData.weightUnit,
      vehicleType: searchData.vehicleType,
      pickupDate: searchData.pickupDate,
      dropDate: searchData.dropDate,
      urgencyLevel: searchData.urgencyLevel,
    };

    // Use existing truck search logic
    const vehicles = await searchTrucks(quotationParams);
    
    return {
      success: true,
      data: vehicles
    };
  } catch (error) {
    console.error('Error in searchForTrucks:', error);
    return {
      success: false,
      error: 'Failed to search trucks. Please try again.'
    };
  }
}

/**
 * Create quotation request - matches backend expectations exactly
 */
export async function createQuotationRequest(
  quotationData: QuotationRequestPayload
): Promise<ApiResponse<QuotationRequestResponse>> {
  try {
    // Authentication check
    const user = await AuthManager.getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // Data validation
    if (!quotationData.items || quotationData.items.length === 0) {
      return {
        success: false,
        error: 'At least one vehicle must be selected'
      };
    }

    if (!quotationData.origin_pincode || !quotationData.destination_pincode) {
      return {
        success: false,
        error: 'Origin and destination are required'
      };
    }

    if (quotationData.origin_pincode === quotationData.destination_pincode) {
      return {
        success: false,
        error: 'Origin and destination pincode cannot be the same'
      };
    }

    // Prepare payload exactly as backend expects
    const payload = {
      vendor_id: quotationData.vendor_id,
      vendor_name: quotationData.vendor_name,
      total_amount: quotationData.total_amount,
      origin_pincode: quotationData.origin_pincode,
      destination_pincode: quotationData.destination_pincode,
      pickup_date: quotationData.pickup_date,
      drop_date: quotationData.drop_date,
      weight: quotationData.weight,
      weight_unit: quotationData.weight_unit,
      vehicle_type: quotationData.vehicle_type || 'Mixed',
      urgency_level: quotationData.urgency_level,
      customer_proposed_amount: quotationData.customer_proposed_amount || null,
      customer_negotiation_message: quotationData.customer_negotiation_message || '',
      items: quotationData.items
    };

    console.log('Creating quotation request with payload:', payload);

    // API call
    const response = await authAPIPost<QuotationRequestResponse>(
      'api/quotations/requests/create/', 
      payload
    );

    return response;
  } catch (error) {
    console.error('createQuotationRequest error:', error);
    return {
      success: false,
      error: 'Failed to create quotation request'
    };
  }
}
