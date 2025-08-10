'use server';

import { AuthManager } from '@/lib/auth-manager';
import { authAPIGet, authAPIPut, authAPIPost } from '@/lib/api';
import { ApiResponse } from '@/lib/types';

export interface QuotationItem {
  id: string;
  vehicle_id: string;
  vehicle_details?: {
    registration_number: string;
    truck_type: string;
    capacity: string;
    make: string;
    model: string;
  };
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface Negotiation {
  id: string;
  quotation: string;
  initiated_by: 'customer' | 'vendor';
  proposed_amount: string;
  message: string;
  proposed_base_price?: string;
  proposed_fuel_charges?: string;
  proposed_toll_charges?: string;
  proposed_loading_charges?: string;
  proposed_unloading_charges?: string;
  proposed_additional_charges?: string;
  created_at: string;
}

export interface NegotiationHistory {
  quotation: {
    id: string;
    original_amount: string;
    current_negotiated_amount: string;
    status: string;
    vendor_name: string;
    can_negotiate: boolean;
  };
  negotiations: Negotiation[];
  total_negotiations: number;
  latest_negotiation: Negotiation | null;
  next_negotiator: 'customer' | 'vendor';
}

export interface Quotation {
  id: string;
  quotation_request_id: string;
  vendor: string;
  vendor_name: string;
  items: QuotationItem[];
  total_amount: string;
  terms_and_conditions: string;
  validity_hours: number;
  customer_suggested_price?: string;
  vendor_response_to_suggestion?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'draft' | 'negotiating' | 'sent';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Negotiation-related fields
  current_negotiated_amount?: string;
  total_negotiations?: number;
  can_negotiate?: boolean;
  next_negotiator?: 'customer' | 'vendor';
}

/**
 * Get quotations based on user role
 * Customers see quotations they received
 * Vendors see quotations they created
 */
export async function getQuotations(): Promise<ApiResponse<Quotation[]>> {
  try {
    // 1. Authentication check
    const user = await AuthManager.getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // 2. Authorization check
    if (!['admin', 'manager', 'customer', 'vendor'].includes(user.role)) {
      return {
        success: false,
        error: 'Insufficient permissions'
      };
    }

    // 3. Role-based API endpoint selection
    let endpoint: string;
    
    if (user.role === 'customer') {
      endpoint = 'api/quotations/customer/quotations';
    } else if (user.role === 'vendor') {
      endpoint = 'api/quotations/vendor/quotations/';
    } else {
      // Admin/Manager - default to customer view for now
      // Can be enhanced later to show all quotations
      endpoint = 'customer/quotations/customer/quotations';
    }

    // 4. API call
    const response = await authAPIGet<Quotation[]>(endpoint);

    return response;
  } catch (error) {
    console.error('getQuotations error:', error);
    return {
      success: false,
      error: 'Failed to fetch quotations'
    };
  }
}

/**
 * Get quotation by ID
 */
export async function getQuotationById(id: string): Promise<ApiResponse<Quotation>> {
  try {
    const user = await AuthManager.getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    if (!['admin', 'manager', 'customer', 'vendor'].includes(user.role)) {
      return {
        success: false,
        error: 'Insufficient permissions'
      };
    }

    // For individual quotation, use generic endpoint
    const response = await authAPIGet<Quotation>(`customer/quotations/${id}`);
    return response;
  } catch (error) {
    console.error('getQuotationById error:', error);
    return {
      success: false,
      error: 'Failed to fetch quotation details'
    };
  }
}

/**
 * Update quotation status (for customer responses)
 */
export async function updateQuotationStatus(
  id: string, 
  status: 'accepted' | 'rejected',
  customerSuggestedPrice?: string
): Promise<ApiResponse<Quotation>> {
  try {
    const user = await AuthManager.getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // Only customers can update quotation status
    if (user.role !== 'customer') {
      return {
        success: false,
        error: 'Only customers can update quotation status'
      };
    }

    const updateData: { status: string; customer_suggested_price?: string } = { status };
    if (customerSuggestedPrice) {
      updateData.customer_suggested_price = customerSuggestedPrice;
    }

    const response = await authAPIPut<Quotation>(`customer/quotations/${id}/status`, updateData);

    return response;
  } catch (error) {
    console.error('updateQuotationStatus error:', error);
    return {
      success: false,
      error: 'Failed to update quotation status'
    };
  }
}

/**
 * Get negotiation history for a quotation
 */
export async function getNegotiationHistory(quotationId: string): Promise<ApiResponse<NegotiationHistory>> {
  try {
    const user = await AuthManager.getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    if (!['admin', 'manager', 'customer', 'vendor'].includes(user.role)) {
      return {
        success: false,
        error: 'Insufficient permissions'
      };
    }

    const response = await authAPIGet<NegotiationHistory>(`api/quotations/${quotationId}/negotiations/`);
    return response;
  } catch (error) {
    console.error('getNegotiationHistory error:', error);
    return {
      success: false,
      error: 'Failed to fetch negotiation history'
    };
  }
}

/**
 * Create a new negotiation offer
 */
export async function createNegotiation(
  quotationId: string,
  proposedAmount: number,
  message: string,
  breakdown?: {
    proposed_base_price?: number;
    proposed_fuel_charges?: number;
    proposed_toll_charges?: number;
    proposed_loading_charges?: number;
    proposed_unloading_charges?: number;
    proposed_additional_charges?: number;
  }
): Promise<ApiResponse<{ negotiation: Negotiation; quotation_status: string }>> {
  try {
    const user = await AuthManager.getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    if (!['customer', 'vendor'].includes(user.role)) {
      return {
        success: false,
        error: 'Only customers and vendors can create negotiations'
      };
    }

    const requestData = {
      proposed_amount: proposedAmount,
      message: message,
      ...breakdown
    };

    const response = await authAPIPost<{ negotiation: Negotiation; quotation_status: string }>(
      `api/quotations/${quotationId}/negotiations/create/`,
      requestData
    );

    return response;
  } catch (error) {
    console.error('createNegotiation error:', error);
    return {
      success: false,
      error: 'Failed to create negotiation offer'
    };
  }
}

/**
 * Accept a negotiation offer
 */
export async function acceptNegotiation(negotiationId: string): Promise<ApiResponse<{
  negotiation_accepted: {
    id: string;
    initiated_by: string;
    accepted_by: string;
    original_amount: string;
    final_amount: string;
    savings: string;
    message: string;
  };
  quotation: {
    id: string;
    vendor_name: string;
    status: string;
    total_negotiations: number;
  };
  quotation_request_id: string;
  other_quotations_rejected: number;
}>> {
  try {
    const user = await AuthManager.getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    if (!['customer', 'vendor'].includes(user.role)) {
      return {
        success: false,
        error: 'Only customers and vendors can accept negotiations'
      };
    }

    const response = await authAPIPost<{
      negotiation_accepted: {
        id: string;
        initiated_by: string;
        accepted_by: string;
        original_amount: string;
        final_amount: string;
        savings: string;
        message: string;
      };
      quotation: {
        id: string;
        vendor_name: string;
        status: string;
        total_negotiations: number;
      };
      quotation_request_id: string;
      other_quotations_rejected: number;
    }>(`api/quotations/negotiations/${negotiationId}/accept/`, {});

    return response;
  } catch (error) {
    console.error('acceptNegotiation error:', error);
    return {
      success: false,
      error: 'Failed to accept negotiation'
    };
  }
}

/**
 * Accept quotation directly (without negotiation)
 */
export async function acceptQuotation(quotationId: string): Promise<ApiResponse<{
  quotation: {
    id: string;
    vendor_name: string;
    original_amount: string;
    final_amount: string;
    status: string;
    negotiations_count: number;
  };
  quotation_request_id: string;
  other_quotations_rejected: number;
  has_negotiations: boolean;
}>> {
  try {
    const user = await AuthManager.getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    if (!['customer', 'vendor'].includes(user.role)) {
      return {
        success: false,
        error: 'Only customers and vendors can accept quotations'
      };
    }

    const response = await authAPIPost<{
      quotation: {
        id: string;
        vendor_name: string;
        original_amount: string;
        final_amount: string;
        status: string;
        negotiations_count: number;
      };
      quotation_request_id: string;
      other_quotations_rejected: number;
      has_negotiations: boolean;
    }>(`api/quotations/${quotationId}/accept/`, {});

    return response;
  } catch (error) {
    console.error('acceptQuotation error:', error);
    return {
      success: false,
      error: 'Failed to accept quotation'
    };
  }
}

/**
 * Reject quotation
 */
export async function rejectQuotation(quotationId: string): Promise<ApiResponse<{
  quotation: {
    id: string;
    vendor_name: string;
    original_amount: string;
    status: string;
    negotiations_count: number;
  };
  quotation_request_id: string;
  had_negotiations: boolean;
  latest_negotiated_amount?: string;
}>> {
  try {
    const user = await AuthManager.getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    if (!['customer', 'vendor'].includes(user.role)) {
      return {
        success: false,
        error: 'Only customers and vendors can reject quotations'
      };
    }

    const response = await authAPIPost<{
      quotation: {
        id: string;
        vendor_name: string;
        original_amount: string;
        status: string;
        negotiations_count: number;
      };
      quotation_request_id: string;
      had_negotiations: boolean;
      latest_negotiated_amount?: string;
    }>(`api/quotations/${quotationId}/reject/`, {});

    return response;
  } catch (error) {
    console.error('rejectQuotation error:', error);
    return {
      success: false,
      error: 'Failed to reject quotation'
    };
  }
}