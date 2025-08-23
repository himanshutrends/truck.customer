'use server';

import { AuthManager } from '@/lib/auth-manager';
import { authAPIDelete, authAPIGet } from '@/lib/api';
import { ApiResponse } from '@/lib/types';
import { OrderRequest } from '@/lib/types';

/**
 * Get all order requests for the current user
 */
export async function getOrderRequests(): Promise<ApiResponse<OrderRequest[]>> {
    try {
        // 1. Authentication check
        const user = await AuthManager.getCurrentUser();
        if (!user) {
            return {
                success: false,
                error: 'User not authenticated'
            };
        }

        let response: ApiResponse<OrderRequest[]> = { success: false, data: [] };

        if (user.role === 'customer') {
            response = await authAPIGet<OrderRequest[]>('api/quotations/customer/requests/');
            console.log('Order requests fetched successfully:', response);
        }

        if (response.success && response.data) {
            return {
                success: true,
                data: response.data
            };
        }
        return {
            success: false,
            error: response.error || 'Failed to fetch order requests'
        };
    } catch (error) {
        console.error('getOrderRequests error:', error);
        return {
            success: false,
            error: 'Failed to fetch order requests'
        };
    }
}

/**
 * Get a specific order request by ID
 */
export async function getOrderRequestById(id: string): Promise<ApiResponse<OrderRequest>> {
    try {
        const response = await authAPIGet<OrderRequest>(`api/quotations/requests/${id}/`);
        return response;
    } catch (error) {
        console.error('getOrderRequestById error:', error);
        return {
            success: false,
            error: 'Failed to fetch order request'
        };
    }
}

/**
 * Cancel an order request
 */
export async function cancelOrderRequest(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
        const response = await authAPIDelete<{ message: string }>(`api/quotations/requests/${id}/`);
        return response;
    } catch (error) {
        console.error('cancelOrderRequest error:', error);
        return {
            success: false,
            error: 'Failed to cancel order request'
        };
    }
}
