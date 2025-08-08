import { apiGet } from '@/lib/api';
import { TruckType, TruckSearchParams, TruckSearchResponse } from '@/lib/types';
import { VehicleDetails, QuotationSearchParams } from '@/contexts/quotation-context';
import { extractWeightNumber, transformTruckResultsToVehicleDetails } from '../helpers/trucks';

/**
 * Get all available truck types
 */
export async function getTruckTypes(): Promise<TruckType[]> {
  try {
    const response = await apiGet<TruckType[]>('api/trucks/types');;
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch truck types');
  } catch (error) {
    console.error('Error in getTruckTypes service:', error);
    throw error;
  }
}

/**
 * Search for trucks based on search parameters
 */
export async function searchTrucks(searchParams: QuotationSearchParams): Promise<VehicleDetails[]> {
  try {
    // Transform quotation search params to truck search params
    const truckSearchParams: TruckSearchParams = {
      origin_pincode: searchParams.originPinCode,
      destination_pincode: searchParams.destinationPinCode,
      truck_type: searchParams.vehicleType,
      pickup_date: searchParams.pickupDate.toISOString().split('T')[0],
      drop_date: searchParams.dropDate.toISOString().split('T')[0],
      weight: extractWeightNumber(searchParams.weight, searchParams.weightUnit),
      capacity_min: extractWeightNumber(searchParams.weight, searchParams.weightUnit),
      capacity_max: extractWeightNumber(searchParams.weight, searchParams.weightUnit) * 1.5, // Allow 50% more capacity
      availability_status: 'available',
      limit: 50, // Default limit
    };

    const params = new URLSearchParams();

    Object.entries(truckSearchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `api/trucks/search?${queryString}` : 'api/trucks/search';

    const response = await apiGet<TruckSearchResponse>(endpoint);

    if (response.success && response.data && response.data.trucks) {
      return transformTruckResultsToVehicleDetails(
        response.data.trucks,
        searchParams,
        response.data.search_criteria
      );
    }
    throw new Error(response.error || 'Failed to search trucks');
  } catch (error) {
    console.error('Error in searchTrucks service:', error);
    throw error;
  }
}
