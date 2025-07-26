'use client';

import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { DualRangeSlider } from '@/components/ui/dual-range-slider';
import { ChevronDown, Info } from 'lucide-react';

export const FiltersPanel: React.FC = () => {
  const [selectedVehicles, setSelectedVehicles] = useState(['ashok-leyland']);
  const [priceRange, setPriceRange] = useState([0, 28000]);
  const [fromPrice, setFromPrice] = useState('₹0');
  const [toPrice, setToPrice] = useState('₹28,000');
  const [dimensions, setDimensions] = useState('22 | 45 | 21');
  const [numberOfBoxes, setNumberOfBoxes] = useState('34');
  
  // Collapsible states
  const [isVehicleTypesOpen, setIsVehicleTypesOpen] = useState(true);
  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(true);
  const [isLoadCapacityOpen, setIsLoadCapacityOpen] = useState(true);

  const vehicleTypes = [
    { id: 'tata-ace', label: 'TATA Ace' },
    { id: 'tata-407', label: 'Tata 407' },
    { id: 'volvo-s440', label: 'Volvo S440' },
    { id: 'mahindra-evo', label: 'Mahindra EVO' },
    { id: 'ashok-leyland', label: 'Ashok Leyland' },
  ];

  const handleVehicleChange = (vehicleId: string, checked: boolean) => {
    setSelectedVehicles(prev => 
      checked 
        ? [...prev, vehicleId]
        : prev.filter(id => id !== vehicleId)
    );
  };

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values);
    setFromPrice(`₹${values[0].toLocaleString()}`);
    setToPrice(`₹${values[1].toLocaleString()}`);
  };

  return (
    <TooltipProvider>
      <div className="w-64 space-y-4">
        {/* Filters Header */}
        <div>
          <h2 className="text-lg font-bold text-black">Filters</h2>
        </div>

        {/* Vehicle Types Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-900">VEHICLE TYPES</h3>
            <button
              onClick={() => setIsVehicleTypesOpen(!isVehicleTypesOpen)}
              className="p-1"
            >
              <ChevronDown 
                className={`h-4 w-4 transition-transform ${
                  isVehicleTypesOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>
          </div>
          
          {isVehicleTypesOpen && (
            <div className="space-y-3">
              {vehicleTypes.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={vehicle.id}
                    checked={selectedVehicles.includes(vehicle.id)}
                    onCheckedChange={(checked) => handleVehicleChange(vehicle.id, checked as boolean)}
                  />
                  <label
                    htmlFor={vehicle.id}
                    className="text-sm font-medium text-neutral-900 cursor-pointer"
                  >
                    {vehicle.label}
                  </label>
                </div>
              ))}
              
              <Button variant="link" className="text-sm text-neutral-900 underline p-0 h-auto">
                Show More...
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* Price Range Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-900">PRICE RANGE</h3>
            <button
              onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)}
              className="p-1"
            >
              <ChevronDown 
                className={`h-4 w-4 transition-transform ${
                  isPriceRangeOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>
          </div>
          
          {isPriceRangeOpen && (
            <div className="space-y-3">
              {/* From Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-neutral-900">From</label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-neutral-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Minimum price for your shipment</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input 
                  value={fromPrice} 
                  onChange={(e) => setFromPrice(e.target.value)}
                  className="w-full"
                />
              </div>
              
              {/* To Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-neutral-900">To</label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-neutral-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Maximum price for your shipment</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input 
                  value={toPrice} 
                  onChange={(e) => setToPrice(e.target.value)}
                  className="w-full"
                />
              </div>
              
              {/* Price Range Slider */}
              <div className="mt-8">
                <DualRangeSlider
                  label={(value) => `₹${value?.toLocaleString() || '0'}`}
                  value={priceRange}
                  onValueChange={handlePriceRangeChange}
                  min={0}
                  max={200000}
                  step={1000}
                />
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Load Capacity Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-900">LOAD CAPACITY</h3>
            <button
              onClick={() => setIsLoadCapacityOpen(!isLoadCapacityOpen)}
              className="p-1"
            >
              <ChevronDown 
                className={`h-4 w-4 transition-transform ${
                  isLoadCapacityOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>
          </div>
          
          {isLoadCapacityOpen && (
            <div className="space-y-3">
              {/* Dimensions Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-neutral-900">Dimensions</label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-neutral-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Length | Width | Height in centimeters</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex">
                  <Input 
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="rounded-r-none border-r-0"
                  />
                  <div className="bg-blue-50 px-4 py-2 border border-l-0 rounded-r-md flex items-center">
                    <span className="text-sm text-neutral-900">cm</span>
                  </div>
                </div>
              </div>
              
              {/* Number of Boxes Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-neutral-900">Number of boxes</label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-neutral-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total number of boxes in your shipment</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input 
                  value={numberOfBoxes}
                  onChange={(e) => setNumberOfBoxes(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
