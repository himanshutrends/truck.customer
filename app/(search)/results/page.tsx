'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FiltersPanel } from '@/components/filters-panel';
import { VehicleCard } from '@/components/vehicle-card';

const ResultsSearchForm: React.FC = () => {
  return (
    <Card className="p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Quick Search Inputs */}
        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-neutral-900 mb-2 block">Origin</label>
            <Input 
              placeholder="Mumbai"
              defaultValue="Mumbai"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-900 mb-2 block">Destination</label>
            <Input 
              placeholder="Delhi"
              defaultValue="Delhi"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-900 mb-2 block">Departure Date</label>
            <Input 
              type="date"
              defaultValue="2024-01-15"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-900 mb-2 block">Vehicle Type</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="All Vehicles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                <SelectItem value="tata-ace">TATA Ace</SelectItem>
                <SelectItem value="ashok-leyland">Ashok Leyland</SelectItem>
                <SelectItem value="volvo">Volvo S440</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Search Button */}
        <div className="flex items-end">
          <Button className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white">
            Search
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Sample vehicle data matching the Figma design
const sampleVehicles = [
  {
    id: '1',
    name: 'Ashok Leyland Dost Plus',
    description: 'Reliable heavy-duty truck for long distance transportation with excellent fuel efficiency and cargo capacity.',
    image: '/truck.jpg',
    specs: {
      loadCapacity: '1.5 Ton',
      dimensions: '10 x 6 x 4 ft',
      fuelType: 'Diesel',
      yearOfManufacture: '2020',
      kmDriven: '85,000 km',
      insuranceValidity: 'Valid till Dec 2024',
      permitType: 'National Permit',
      ownership: 'First Owner',
      registrationState: 'Maharashtra'
    },
    pricing: {
      perKm: '₹18',
      minimumFare: '₹2,500',
      driverAllowance: '₹500/day',
      perHour: '₹150'
    },
    operatingStates: ['Maharashtra', 'Delhi', 'Gujarat', 'Rajasthan'],
    isBookmarked: false
  },
  {
    id: '2',
    name: 'TATA Ace Gold',
    description: 'Compact and efficient mini truck perfect for city deliveries and medium distance transportation.',
    image: '/truck.jpg',
    specs: {
      loadCapacity: '750 kg',
      dimensions: '8 x 5 x 3.5 ft',
      fuelType: 'Diesel',
      yearOfManufacture: '2021',
      kmDriven: '45,000 km',
      insuranceValidity: 'Valid till Mar 2025',
      permitType: 'State Permit',
      ownership: 'First Owner',
      registrationState: 'Delhi'
    },
    pricing: {
      perKm: '₹15',
      minimumFare: '₹2,000',
      driverAllowance: '₹400/day',
      perHour: '₹120'
    },
    operatingStates: ['Delhi', 'UP', 'Haryana', 'Punjab'],
    isBookmarked: true
  },
  {
    id: '3',
    name: 'Volvo S440 Heavy Duty',
    description: 'Premium heavy-duty truck with advanced safety features and superior comfort for long haul transportation.',
    image: '/truck.jpg',
    specs: {
      loadCapacity: '25 Ton',
      dimensions: '20 x 8 x 8 ft',
      fuelType: 'Diesel',
      yearOfManufacture: '2019',
      kmDriven: '1,20,000 km',
      insuranceValidity: 'Valid till Jun 2024',
      permitType: 'National Permit',
      ownership: 'Second Owner',
      registrationState: 'Karnataka'
    },
    pricing: {
      perKm: '₹35',
      minimumFare: '₹5,000',
      driverAllowance: '₹800/day',
      perHour: '₹300'
    },
    operatingStates: ['Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Kerala'],
    isBookmarked: false
  }
];

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Available Trucks - Mumbai to Delhi
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-neutral-600">
              Showing 156 available vehicles for your route
            </p>
            <div className="flex items-center gap-4">
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
            </div>
          </div>
        </div>

        {/* Quick Search Form */}
        <ResultsSearchForm />

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <FiltersPanel />

          {/* Results Content */}
          <div className="flex-1">
            <div className="space-y-6">
              {sampleVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
              
              {/* Load More Button */}
              <div className="text-center py-8">
                <Button variant="outline" className="px-8">
                  Load More Vehicles
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
