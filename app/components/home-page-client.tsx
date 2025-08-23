'use client';

import React, { useState } from 'react';
import { SearchSection, SearchFormData } from './search-section';
import { ResultsSection } from './results-section';
import { QuotationSection } from './quotation-section';
import { FiltersPanel } from './filters-panel';
import { HomeHeader } from './home-header';
import { VendorSwitchDialog } from './vendor-switch-dialog';
import { useQuotation } from '@/contexts/quotation-context';
import { searchForTrucks } from '../server/actions/home';
import { TruckType, SessionUser } from '@/lib/types';
import { VehicleDetails } from '@/contexts/quotation-context';

interface HomePageClientProps {
  initialTruckTypes: TruckType[];
  initialUser: SessionUser | null;
}

export function HomePageClient({ initialTruckTypes, initialUser }: HomePageClientProps) {
  const { getSelectedVehicleCount, setSearchParams } = useQuotation();
  
  // Search and results state
  const [vehicles, setVehicles] = useState<VehicleDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Quotation state
  const [showQuotation, setShowQuotation] = useState(false);
  
  const selectedCount = getSelectedVehicleCount();

  // Auto-show quotation when vehicles are selected
  React.useEffect(() => {
    if (selectedCount > 0 && !showQuotation) {
      setShowQuotation(true);
    } else if (selectedCount === 0 && showQuotation) {
      setShowQuotation(false);
    }
  }, [selectedCount, showQuotation]);

  const handleSearch = async (searchData: SearchFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setHasSearched(true);

      const result = await searchForTrucks(searchData);
      
      if (result.success && result.data) {
        setVehicles(result.data);
        
        // Set search params for quotation context
        setSearchParams({
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
        });
      } else {
        setError(result.error || 'Failed to search trucks');
        setVehicles([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('An unexpected error occurred. Please try again.');
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setHasSearched(false);
    setVehicles([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader initialUser={initialUser} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Truck Rental Service
          </h1>
          <p className="text-gray-600">
            Find and book trucks for your transportation needs across India
          </p>
        </div>

        {/* Search Section */}
        <SearchSection 
          truckTypes={initialTruckTypes}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {/* Main Layout with Filters */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Filters (hidden on mobile, can be toggled) */}
          <div className="lg:flex-shrink-0 lg:block">
            <FiltersPanel truckTypes={initialTruckTypes} />
          </div>

          {/* Center Content - Results */}
          <div className="flex-1 min-w-0">
            <ResultsSection
              vehicles={vehicles}
              isLoading={isLoading}
              error={error}
              hasSearched={hasSearched}
              onRetry={handleRetry}
            />
          </div>

          {/* Right Sidebar - Quotation */}
          {showQuotation && (
            <div className="lg:flex-shrink-0 lg:w-96">
              <div className="lg:sticky lg:top-6">
                <QuotationSection onClose={() => setShowQuotation(false)} />
              </div>
            </div>
          )}
        </div>

        {/* Selected Vehicles Indicator */}
        {selectedCount > 0 && !showQuotation && (
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={() => setShowQuotation(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
            >
              <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                {selectedCount}
              </span>
              View Quotation
            </button>
          </div>
        )}

        {/* Vendor Switch Dialog */}
        <VendorSwitchDialog />
      </div>
    </div>
  );
}
