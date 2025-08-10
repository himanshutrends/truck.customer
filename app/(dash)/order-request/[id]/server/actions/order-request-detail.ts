'use server';

import { AuthManager } from '@/lib/auth-manager';
import { authAPIGet, authAPIPost } from '@/lib/api';
import { ApiResponse } from '@/lib/types';

// Types for order request detail
export interface OrderRequestDetail {
    id: number;
    origin_city: string;
    destination_city: string;
    origin_pincode: string;
    destination_pincode: string;
    pickup_date: string;
    drop_date: string;
    weight: string;
    weight_unit: string;
    urgency_level: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface QuotationItem {
    vehicle_id: number;
    vehicle_model: string;
    vehicle_type: string;
    max_weight: string;
    gps_number: string;
    unit_price: string;
    quantity: number;
    estimated_delivery: string;
}

export interface Quotation {
    id: number;
    vendor_name: string;
    frontend_vendor_id: string;
    total_amount: string;
    base_price: string;
    fuel_charges: string;
    toll_charges: string;
    loading_charges: string;
    unloading_charges: string;
    additional_charges: string;
    status: string;
    items: QuotationItem;
    created_at: string;
    updated_at: string;
}

export interface OrderRequestDetailResponse extends OrderRequestDetail {
    quotations: Quotation[];
}

/**
 * Get order request details by ID
 */
export async function getOrderRequestById(orderId: string): Promise<ApiResponse<OrderRequestDetailResponse>> {
    try {
        // 1. Authentication check
        const user = await AuthManager.getCurrentUser();
        if (!user) {
            return {
                success: false,
                error: 'User not authenticated'
            };
        }
        // 2. Authorization check - customers, managers, and admins can view order request details
        if (!['admin', 'manager', 'customer'].includes(user.role)) {
            return {
                success: false,
                error: 'Insufficient permissions'
            };
        }
        // 3. API call to get order request details
        const response = await authAPIGet<OrderRequestDetailResponse>(`api/quotations/requests/${orderId}/`);
        console.log('Order request details fetched successfully:', response);
        return response;
    } catch (error) {
        console.error('getOrderRequestById error:', error);
        return {
            success: false,
            error: 'Failed to fetch order request details'
        };
    }
}

/**
 * Accept a quotation for an order request
 */
export async function acceptQuotation(quotationId: number): Promise<ApiResponse<{ message: string }>> {
    try {
        const user = await AuthManager.getCurrentUser();
        if (!user || !['admin', 'manager', 'customer'].includes(user.role)) {
            return {
                success: false,
                error: 'Insufficient permissions'
            };
        }
        const response = await authAPIPost<{ message: string }>(`api/quotations/${quotationId}/accept/`, {});
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
 * Reject a quotation for an order request
 */
export async function rejectQuotation(quotationId: number): Promise<ApiResponse<{ message: string }>> {
    try {
        const user = await AuthManager.getCurrentUser();
        if (!user || !['admin', 'manager', 'customer'].includes(user.role)) {
            return {
                success: false,
                error: 'Insufficient permissions'
            };
        }
        const response = await authAPIPost<{ message: string }>(`api/quotations/${quotationId}/reject/`, {});
        return response;
    } catch (error) {
        console.error('rejectQuotation error:', error);
        return {
            success: false,
            error: 'Failed to reject quotation'
        };
    }
}
