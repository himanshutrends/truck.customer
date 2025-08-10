'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FiltersPanel } from '@/app/components/filters-panel';
import { VehicleCard } from '@/app/components/vehicle-card';
import { SearchForm } from '@/app/components/search-form';
import { QuotationForm } from '@/app/components/quotation-form';
import { VendorSwitchDialog } from '@/app/components/vendor-switch-dialog';
import { HomeHeader } from '@/app/components/home-header';
import { useQuotation, VehicleDetails } from '@/contexts/quotation-context';
import { searchTrucks } from '@/app/server/actions/trucks';
import { Skeleton } from '@/components/ui/skeleton';
import { DateRange } from 'react-day-picker';
import { TruckType, SessionUser } from '@/lib/types';

interface SearchFormData {
  originPinCode: string;
  destinationPinCode: string;
  weight: string;
  vehicleType?: TruckType; // Optional, can be selected in the form
  dateRange: DateRange | undefined;
}

interface TrucksResultsClientProps {
  initialVehicles: VehicleDetails[];
  truckTypes: TruckType[];
  initialUser: SessionUser | null;
}

export function TrucksResultsClient({ initialVehicles, truckTypes, initialUser }: TrucksResultsClientProps) {
  const { getSelectedVehicleCount, getTotalQuotationAmount, setSearchParams, state } = useQuotation();
  const [vehicles, setVehicles] = useState<VehicleDetails[]>(initialVehicles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showQuotationForm, setShowQuotationForm] = useState(false);

  const selectedVehicleCount = getSelectedVehicleCount();
  const totalAmount = getTotalQuotationAmount();

  // Auto-show quotation form when vehicles are selected
  React.useEffect(() => {
    if (selectedVehicleCount > 0 && !showQuotationForm) {
      setShowQuotationForm(true);
    }
  }, [selectedVehicleCount, showQuotationForm]);

  // Handle search form submission
  const handleSearch = useCallback(async (searchData: SearchFormData) => {
    // Validate required parameters
    if (!searchData.originPinCode || !searchData.destinationPinCode) {
      setError('Origin and destination pin codes are required');
      return;
    }

    // try {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    // Convert SearchFormData to the format expected by TrucksService
    const searchParams = {
      originPinCode: searchData.originPinCode,
      destinationPinCode: searchData.destinationPinCode,
      originLocation: searchData.originPinCode, // You might want to get actual location names
      destinationLocation: searchData.destinationPinCode,
      weight: searchData.weight,
      weightUnit: 'tonnes' as const,
      vehicleType: searchData.vehicleType?.id,
      pickupDate: searchData.dateRange?.from || new Date(),
      dropDate: searchData.dateRange?.to || new Date(Date.now() + 24 * 60 * 60 * 1000),
      urgencyLevel: 'standard' as const,
    };

    const response = await searchTrucks(searchParams);
    console.log('Search results:', response);

    setVehicles(response);
    setSearchParams(searchParams);
    // } catch (err) {
    //   setError('Failed to search trucks. Please try again.');
    //   console.error('Search error:', err);
    // } finally {
    setLoading(false);
    // }
  }, [setSearchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Home Header */}
      <HomeHeader initialUser={initialUser} />
      
      <div className="max-w-7xl mx-auto px-2 py-8">

        {/* Search Form */}
        <SearchForm onSearch={handleSearch} />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            {!hasSearched ?
              'Truck Rental Service' :
              `Available Trucks - ${state.searchParams?.originLocation || 'Origin'} to ${state.searchParams?.destinationLocation || 'Destination'}`
            }
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-neutral-600">
              {loading ? 'Searching for vehicles...' :
                error ? 'Error loading vehicles' :
                  !hasSearched ? 'Enter your route details to find available trucks' :
                    `Showing ${vehicles.length} available vehicles for your route`}
              {selectedVehicleCount > 0 && (
                <span className="ml-2 text-blue-600 font-medium">
                  ({selectedVehicleCount} selected)
                </span>
              )}
            </p>
            <div className="flex items-center gap-4">
              {selectedVehicleCount > 0 && (
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setShowQuotationForm(true)}
                >
                  View Quotation (₹{totalAmount.toLocaleString()})
                </Button>
              )}
              {hasSearched && (
                <>
                  <span className="text-sm text-neutral-600">Sort by:</span>
                  <Select defaultValue="price-low">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="capacity">Load Capacity</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <FiltersPanel truckTypes={truckTypes} />

          {/* Results Content */}
          <div className="flex-1">
            <div className="space-y-6">
              {loading ? (
                // Loading skeleton
                <>
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-32" />
                      </div>
                    </div>
                  ))}
                </>
              ) : error ? (
                // Error state
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Try Again
                  </Button>
                </div>
              ) : !hasSearched ? (
                // Initial state - no search performed
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-12 text-center">
                  <h3 className="text-blue-900 text-xl font-semibold mb-2">Find the Perfect Truck for Your Needs</h3>
                  <p className="text-blue-700 mb-4">Enter your origin and destination pin codes above to search for available trucks</p>
                  <div className="text-blue-600 text-sm">
                    <p>• Origin pin code is required</p>
                    <p>• Destination pin code is required</p>
                    <p>• Select your preferred vehicle type and weight</p>
                  </div>
                </div>
              ) : vehicles.length === 0 ? (
                // No results state after search
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                  <p className="text-gray-600 text-lg mb-2">No trucks found</p>
                  <p className="text-gray-500 mb-4">Try adjusting your search criteria or check different routes</p>
                  <Button variant="outline" onClick={() => setHasSearched(false)}>
                    Search Again
                  </Button>
                </div>
              ) : (
                // Vehicles list
                <>
                  {vehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                    />
                  ))}

                  {/* Load More Button - only show if we have results */}
                  {vehicles.length > 0 && (
                    <div className="text-center py-8">
                      <Button variant="outline" className="px-8">
                        Load More Vehicles
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Quotation Form Sidebar */}
          {showQuotationForm && (
            <div className="lg:w-96">
              <div className="sticky top-6">
                <QuotationForm 
                  onClose={() => setShowQuotationForm(false)}
                  className="h-[calc(100vh-2rem)] max-h-[800px]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Vendor Switch Dialog */}
        <VendorSwitchDialog />
      </div>
    </div>
  );
}
