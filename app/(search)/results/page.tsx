'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FiltersPanel } from '@/components/filters-panel';
import { VehicleCard } from '@/components/vehicle-card';
import { SearchForm } from '@/components/search-form';

// Sample vehicle data matching the Figma design
const sampleVehicles = [
  {
    id: '1',
    name: 'Mearsk Shipping',
    badge: 'Fastest Delivery',
    price: '₹28,000',
    vehicleType: 'Heavy Truck',
    maxWeight: '80 tonnes',
    model: 'Mercedes FreightMaster X2000',
    gpsNumber: '#33HEM 56',
    estimatedDelivery: '26 January 2025',
    route: {
      from: 'Delhi',
      to: 'Chinnwara',
      price: '₹10,000'
    },
    weight: {
      amount: '80 tonnes',
      rate: '₹1000 x 80',
      total: '₹80,00'
    },
    deliveryType: {
      type: 'Express',
      price: '₹1000'
    },
    total: '₹28,000',
    specs: {
      loadCapacity: '80 Ton',
      dimensions: '20 x 8 x 8 ft',
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
    name: 'Swift Logistics',
    badge: 'Best Value',
    price: '₹22,500',
    vehicleType: 'Medium Truck',
    maxWeight: '50 tonnes',
    model: 'TATA Prima 2528.K',
    gpsNumber: '#42ABC 89',
    estimatedDelivery: '28 January 2025',
    route: {
      from: 'Delhi',
      to: 'Chinnwara',
      price: '₹8,500'
    },
    weight: {
      amount: '50 tonnes',
      rate: '₹800 x 50',
      total: '₹40,00'
    },
    deliveryType: {
      type: 'Standard',
      price: '₹500'
    },
    total: '₹22,500',
    specs: {
      loadCapacity: '50 Ton',
      dimensions: '18 x 7 x 7 ft',
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
    name: 'Premium Freight Co.',
    price: '₹35,000',
    vehicleType: 'Heavy Truck',
    maxWeight: '100 tonnes',
    model: 'Volvo FH16 750',
    gpsNumber: '#67XYZ 12',
    estimatedDelivery: '25 January 2025',
    route: {
      from: 'Delhi',
      to: 'Chinnwara',
      price: '₹12,000'
    },
    weight: {
      amount: '100 tonnes',
      rate: '₹1200 x 100',
      total: '₹1,20,00'
    },
    deliveryType: {
      type: 'Premium Express',
      price: '₹2000'
    },
    total: '₹35,000',
    specs: {
      loadCapacity: '100 Ton',
      dimensions: '22 x 8.5 x 9 ft',
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
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);

  const handleVehicleSelection = (vehicleId: string, selected: boolean) => {
    setSelectedVehicles(prev => {
      if (selected) {
        return [...prev, vehicleId];
      } else {
        return prev.filter(id => id !== vehicleId);
      }
    });
  };

  const handleGetQuotation = () => {
    if (selectedVehicles.length === 0) {
      alert('Please select at least one vehicle to get a quotation.');
      return;
    }
    
    const selectedVehicleData = sampleVehicles.filter(vehicle => 
      selectedVehicles.includes(vehicle.id)
    );
    
    console.log('Selected vehicles for quotation:', selectedVehicleData);
    alert(`Getting quotation for ${selectedVehicles.length} selected vehicle(s)`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className='absolute top-0 left-0 right-0 bg-primary h-26 z-0'>
        </div>
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">

        {/* Search Form */}
        <SearchForm onSearch={(data) => console.log('Search data:', data)} />

         {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Available Trucks - Mumbai to Delhi
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-neutral-600">
              Showing 156 available vehicles for your route
              {selectedVehicles.length > 0 && (
                <span className="ml-2 text-blue-600 font-medium">
                  ({selectedVehicles.length} selected)
                </span>
              )}
            </p>
            <div className="flex items-center gap-4">
              {selectedVehicles.length > 0 && (
                <Button 
                  onClick={handleGetQuotation}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Get Quotation for {selectedVehicles.length} Vehicle(s)
                </Button>
              )}
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

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <FiltersPanel />

          {/* Results Content */}
          <div className="flex-1">
            <div className="space-y-6">
              {sampleVehicles.map((vehicle) => (
                <VehicleCard 
                  key={vehicle.id} 
                  vehicle={vehicle} 
                  isSelected={selectedVehicles.includes(vehicle.id)}
                  onSelectionChange={handleVehicleSelection}
                />
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
