import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface VehicleCardProps {
  vehicle: {
    id: string;
    name: string;
    description: string;
    image: string;
    specs: {
      loadCapacity: string;
      dimensions: string;
      fuelType: string;
      yearOfManufacture: string;
      kmDriven: string;
      insuranceValidity: string;
      permitType: string;
      ownership: string;
      registrationState: string;
    };
    pricing: {
      perKm: string;
      minimumFare: string;
      driverAllowance: string;
      perHour: string;
    };
    operatingStates: string[];
    isBookmarked?: boolean;
  };
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Vehicle Image */}
        <div className="lg:w-80 h-64 lg:h-auto relative">
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 right-4">
            <Button variant="ghost" size="sm" className="bg-white/80 p-2">
              <svg className="w-4 h-4" fill={vehicle.isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="flex-1 p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">{vehicle.name}</h3>
              <p className="text-sm text-neutral-600 mb-3">{vehicle.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {vehicle.operatingStates.map((state) => (
                  <Badge key={state} variant="secondary" className="text-xs">
                    {state}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-xs text-neutral-500 mb-1">Load Capacity</p>
              <p className="text-sm font-medium">{vehicle.specs.loadCapacity}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 mb-1">Dimensions</p>
              <p className="text-sm font-medium">{vehicle.specs.dimensions}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 mb-1">Fuel Type</p>
              <p className="text-sm font-medium">{vehicle.specs.fuelType}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 mb-1">Year of Manufacture</p>
              <p className="text-sm font-medium">{vehicle.specs.yearOfManufacture}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 mb-1">KM Driven</p>
              <p className="text-sm font-medium">{vehicle.specs.kmDriven}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 mb-1">Insurance Validity</p>
              <p className="text-sm font-medium">{vehicle.specs.insuranceValidity}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 mb-1">Permit Type</p>
              <p className="text-sm font-medium">{vehicle.specs.permitType}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 mb-1">Ownership</p>
              <p className="text-sm font-medium">{vehicle.specs.ownership}</p>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h4 className="text-sm font-bold text-neutral-900 mb-3">Price Breakdown</h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-neutral-500 mb-1">Per KM</p>
                <p className="text-lg font-bold text-blue-600">{vehicle.pricing.perKm}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-1">Minimum Fare</p>
                <p className="text-sm font-medium">{vehicle.pricing.minimumFare}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-1">Driver Allowance</p>
                <p className="text-sm font-medium">{vehicle.pricing.driverAllowance}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-1">Per Hour</p>
                <p className="text-sm font-medium">{vehicle.pricing.perHour}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1">
              View More Details
            </Button>
            <Button variant="outline" className="flex-1">
              See Price Breakdown
            </Button>
            <Button variant="outline" className="flex-1">
              Negotiate Quote
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
              Book this vehicle
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
