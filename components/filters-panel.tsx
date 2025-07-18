import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const FiltersPanel: React.FC = () => {
  const [selectedVehicles, setSelectedVehicles] = useState(['ashok-leyland']);

  const vehicleTypes = [
    { id: 'tata-ace', label: 'TATA Ace' },
    { id: 'tata-407', label: 'Tata 407' },
    { id: 'volvo-s440', label: 'Volvo S440' },
    { id: 'mahindra-evo', label: 'Mahindra EVO' },
    { id: 'ashok-leyland', label: 'Ashok Leyland' },
  ];

  const handleVehicleChange = (vehicleId: string) => {
    setSelectedVehicles(prev => 
      prev.includes(vehicleId) 
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  return (
    <div className="w-64 space-y-6">
      {/* Filters Header */}
      <div>
        <h2 className="text-lg font-bold text-black">Filters</h2>
      </div>

      {/* Vehicle Types */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-900">VEHICLE TYPES</h3>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          <div className="space-y-3">
            {vehicleTypes.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center space-x-2">
                <Checkbox
                  id={vehicle.id}
                  checked={selectedVehicles.includes(vehicle.id)}
                  onCheckedChange={() => handleVehicleChange(vehicle.id)}
                />
                <label
                  htmlFor={vehicle.id}
                  className="text-sm font-medium text-neutral-900 cursor-pointer"
                >
                  {vehicle.label}
                </label>
              </div>
            ))}
          </div>
          
          <Button variant="link" className="text-sm text-neutral-900 underline p-0">
            Show More...
          </Button>
        </div>
      </Card>

      {/* Price Range */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-900">PRICE RANGE</h3>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium text-neutral-900">From</label>
              <Input defaultValue="₹0" />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-900">To</label>
              <Input defaultValue="₹28,000" />
            </div>
          </div>
          
          {/* Price Range Slider */}
          <div className="flex items-center space-x-2">
            <span className="text-sm">0</span>
            <div className="flex-1 relative">
              <div className="w-full h-1.5 bg-gray-200 rounded-full">
                <div className="w-1/3 h-full bg-blue-600 rounded-full"></div>
              </div>
              <div className="absolute left-0 top-0 w-6 h-6 bg-white border-2 border-blue-600 rounded-full transform -translate-y-1/2"></div>
              <div className="absolute left-1/3 top-0 w-6 h-6 bg-blue-600 rounded-full transform -translate-y-1/2 flex items-center justify-center">
                <span className="text-xs text-white">28000</span>
              </div>
            </div>
            <span className="text-sm">2L</span>
          </div>
        </div>
      </Card>

      {/* Load Capacity */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-900">LOAD CAPACITY</h3>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium text-neutral-900">Dimensions</label>
              <div className="flex">
                <Input defaultValue="22 | 45 | 21" className="rounded-r-none" />
                <div className="bg-blue-50 px-4 py-2 border border-l-0 rounded-r-md flex items-center">
                  <span className="text-sm">cm</span>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-900">Number of boxes</label>
              <Input defaultValue="34" />
            </div>
          </div>
        </div>
      </Card>

      {/* Material Type */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-900">MATERIAL TYPE</h3>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="hazardous" defaultChecked />
            <label htmlFor="hazardous" className="text-sm font-medium text-neutral-900">
              This shipment contains hazardous materials
            </label>
          </div>
        </div>
      </Card>
    </div>
  );
};
