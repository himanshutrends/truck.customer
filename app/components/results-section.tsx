'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VehicleCard } from '@/app/components/vehicle-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Truck, Search, AlertCircle } from 'lucide-react';
import { VehicleDetails } from '@/contexts/quotation-context';

interface ResultsSectionProps {
  vehicles: VehicleDetails[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  onRetry: () => void;
}

export function ResultsSection({ 
  vehicles, 
  isLoading, 
  error, 
  hasSearched, 
  onRetry 
}: ResultsSectionProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Searching for vehicles...</h2>
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Search Failed</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      </Card>
    );
  }

  // Initial state - no search performed
  if (!hasSearched) {
    return (
      <Card className="p-12 text-center">
        <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Find the Perfect Truck for Your Needs
        </h3>
        <p className="text-gray-600 mb-4">
          Enter your transportation details above to search for available trucks
        </p>
        <div className="text-gray-500 text-sm space-y-1">
          <p>• Compare prices from multiple vendors</p>
          <p>• View real-time truck availability</p>
          <p>• Get instant quotations</p>
        </div>
      </Card>
    );
  }

  // No results after search
  if (vehicles.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Trucks Found</h3>
        <p className="text-gray-600 mb-4">
          No trucks match your search criteria. Try adjusting your requirements.
        </p>
        <div className="text-gray-500 text-sm mb-4">
          <p>Try:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Different pickup/drop dates</li>
            <li>Different vehicle type</li>
            <li>Adjusting weight requirements</li>
          </ul>
        </div>
        <Button onClick={onRetry} variant="outline">
          Modify Search
        </Button>
      </Card>
    );
  }

  // Results display
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Available Trucks ({vehicles.length} found)
        </h2>
      </div>
      
      <div className="space-y-4">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
        
        {/* Load more placeholder - can be implemented later */}
        {vehicles.length >= 10 && (
          <Card className="p-4 text-center">
            <Button variant="outline" disabled>
              Load More Results (Coming Soon)
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
