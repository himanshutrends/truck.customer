import { TruckSearchResult } from '@/lib/types';
import { VehicleDetails, QuotationSearchParams } from '@/contexts/quotation-context';

/**
 * Transform API truck results to VehicleDetails format
 */
export function transformTruckResultsToVehicleDetails(
    trucks: TruckSearchResult[],
    searchParams: QuotationSearchParams,
    searchCriteria: {
        origin_city: string;
        destination_city: string;
        total_distance_km: number;
        delivery_date: string | null;
        pickup_date: string;
        number_of_trucks: number;
        weight_tons: number;
    }
): VehicleDetails[] {
    return trucks.map((truck, index) => {
        const basePricePerKm = parseFloat(truck.base_price_per_km) || 0;
        const estimatedDistance = searchCriteria.total_distance_km || 500; // Use actual distance from API
        const totalPrice = basePricePerKm * estimatedDistance;
        const capacity = parseFloat(truck.capacity) || 0; // Convert capacity to number
        const weightAmount = searchCriteria.weight_tons; // Use search weight

        // Generate estimated delivery date (pickup date + 1-3 days based on urgency)
        const deliveryDate = new Date(searchParams.dropDate);
        const urgencyDays = searchParams.urgencyLevel === 'urgent' ? 1 :
            searchParams.urgencyLevel === 'express' ? 2 : 3;
        deliveryDate.setDate(deliveryDate.getDate() + urgencyDays);

        return {
            id: truck.id,
            vendorId: truck.vendor_id,
            vendorName: truck.vendor_name,
            name: truck.vendor_name,
            badge: generateBadge(truck, index),
            price: `₹${totalPrice.toLocaleString()}`,
            vehicleType: truck.truck_type,
            maxWeight: capacity, // Now a number
            model: `${truck.make} ${truck.model}`,
            gpsNumber: truck.registration_number,
            estimatedDelivery: deliveryDate.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }),
            route: {
                from: searchCriteria.origin_city,
                to: searchCriteria.destination_city,
                price: `₹${(totalPrice * 0.6).toLocaleString()}` // Base route price
            },
            weight: {
                amount: weightAmount, // Weight amount from search criteria
                rate: Math.round(basePricePerKm * 100) / 100, // Rate rounded to 2 decimal places
                total: Math.round(totalPrice * 0.8 * 100) / 100 // Total rounded to 2 decimal places
            },
            deliveryType: {
                type: searchParams.urgencyLevel === 'urgent' ? 'Express' :
                    searchParams.urgencyLevel === 'express' ? 'Standard' : 'Economy',
                price: Math.round(totalPrice * 0.1 * 100) / 100 // Price rounded to 2 decimal places
            },
            total: Math.round(totalPrice * 100) / 100, // Total rounded to 2 decimal places
            specs: {
                loadCapacity: truck.capacity,
                dimensions: '20 x 8 x 8 ft', // Default dimensions - you might want to add this to API
                fuelType: 'Diesel',
                yearOfManufacture: truck.year,
                kmDriven: 'N/A', // Not provided in API
                insuranceValidity: 'Valid', // Not provided in API
                permitType: 'National Permit', // Default
                ownership: 'Fleet Owner',
                registrationState: 'N/A' // Extract from registration if needed
            },
            pricing: {
                perKm: `₹${basePricePerKm}`,
                minimumFare: `₹${(basePricePerKm * 50).toLocaleString()}`, // 50km minimum
                driverAllowance: '₹500/day',
                perHour: `₹${(basePricePerKm * 10).toLocaleString()}` // Estimated
            },
            operatingStates: [truck.current_location_address], // Use current location as operating area
            isBookmarked: false
        };
    });
}

/**
 * Extract numeric weight value from weight and unit
 */
export function extractWeightNumber(weight: number, unit: 'kg' | 'tonnes'): number {
    return unit === 'kg' ? weight / 1000 : weight; // Convert to tonnes
}

/**
 * Generate badge based on truck characteristics
 */
export function generateBadge(truck: TruckSearchResult, index: number): string | undefined {
    const badges = ['Best Value', 'Fastest Delivery', 'Most Reliable', 'Economy Choice', 'Premium Service'];

    // Simple logic to assign badges
    if (index === 0) return 'Recommended';
    if (parseFloat(truck.base_price_per_km) < 15) return 'Best Value';
    if (truck.availability_status === 'available') return 'Available Now';

    return badges[index % badges.length];
}
