'use server';
import { authAPIGet, authAPIPost } from '@/lib/api';
import { ApiResponse, QuotationRequestResponse } from '@/lib/types';

// Types for quotation request
export interface QuotationRequest {
  vendorId: number;
  vendorName: string;
  items: QuotationItem[];
  totalAmount: number;
  searchParams: {
    originPinCode: string;
    destinationPinCode: string;
    pickupDate: string;
    dropDate: string;
    weight: string;
    weightUnit: string;
    vehicleType?: string;
    urgencyLevel: string;
  };
}

export interface QuotationItem {
  vehicle: {
    id: string;
    model: string;
    vehicleType: string;
    maxWeight: string;
    gpsNumber: string;
    total: string;
    estimatedDelivery: string;
  };
  quantity: number;
}

/**
 * Create a new quotation request
 */
export async function createQuotationRequest(
  quotationData: QuotationRequest
): Promise<ApiResponse<QuotationRequestResponse>> {
  try {
    // 1. Data validation
    if (!quotationData.items || quotationData.items.length === 0) {
      return {
        success: false,
        error: 'At least one vehicle must be selected'
      };
    }

    if (!quotationData.searchParams.originPinCode || !quotationData.searchParams.destinationPinCode) {
      return {
        success: false,
        error: 'Origin and destination are required'
      };
    }

    // 2. Prepare request payload
    const requestPayload = {
      vendor_id: quotationData.vendorId,
      vendor_name: quotationData.vendorName,
      total_amount: quotationData.totalAmount,
      origin_pincode: quotationData.searchParams.originPinCode,
      destination_pincode: quotationData.searchParams.destinationPinCode,
      pickup_date: quotationData.searchParams.pickupDate,
      drop_date: quotationData.searchParams.dropDate,
      weight: quotationData.searchParams.weight,
      weight_unit: quotationData.searchParams.weightUnit,
      vehicle_type: quotationData.searchParams.vehicleType,
      urgency_level: quotationData.searchParams.urgencyLevel,
      items: quotationData.items.map(item => ({
        vehicle_id: item.vehicle.id,
        vehicle_model: item.vehicle.model,
        vehicle_type: item.vehicle.vehicleType,
        max_weight: item.vehicle.maxWeight,
        gps_number: item.vehicle.gpsNumber,
        unit_price: item.vehicle.total,
        quantity: item.quantity,
        estimated_delivery: item.vehicle.estimatedDelivery
      }))
    };

    // 3. API call
    const response = await authAPIPost<QuotationRequestResponse>('api/quotations/requests/create/', requestPayload);

    return response;
  } catch (error) {
    console.error('createQuotationRequest error:', error);
    return {
      success: false,
      error: 'Failed to create quotation request'
    };
  }
}

/**
 * Get quotation requests for the current user
 */
export async function getQuotationRequests(): Promise<ApiResponse<QuotationRequestResponse[]>> {
  try {
    const response = await authAPIGet<QuotationRequestResponse[]>('api/quotations/requests/');
    return response;
  } catch (error) {
    console.error('getQuotationRequests error:', error);
    return {
      success: false,
      error: 'Failed to fetch quotation requests'
    };
  }
}
