'use client';

import React from 'react';
import { TruckSearchForm } from '../../../components/truck-search-form';
import { SearchResults } from '../../../components/search-results';

export type SearchFormData = {
  originPinCode: string;
  destinationPinCode: string;
  weight: string;
  vehicleType?: string;
  commodityType?: string;
  packageType?: string;
  packageDimensions?: string;
  packageQuantity?: string;
  hasHazardousMaterials?: boolean;
};

export default function TruckSearchPage() {
  const handleSearch = (data: SearchFormData) => {
    console.log('Search data:', data);
    // Handle search logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <div 
        className="relative h-[380px]"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 100%), url('/truck.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Hero Text */}
        <div className="absolute left-[86px] top-[104px]">
          <h1 className="text-4xl font-bold text-white leading-[44px] tracking-[-0.72px] max-w-2xl font-satoshi">
            Deliver Goods from one place to another
          </h1>
        </div>

        {/* Search Form */}
        <div className="absolute left-[82px] top-[205px] z-20">
          <TruckSearchForm onSearch={handleSearch} />
        </div>
      </div>

      {/* Search Results Section */}
      <SearchResults />
    </div>
  );
}
