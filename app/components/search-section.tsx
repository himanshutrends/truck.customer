'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { MapPin, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { TruckType } from '@/lib/types';

// Available pin codes for development testing
const AVAILABLE_PIN_CODES = [
  { code: '400001', city: 'Mumbai' },
  { code: '110001', city: 'Delhi' },
  { code: '560001', city: 'Bangalore' },
  { code: '600001', city: 'Chennai' },
  { code: '411001', city: 'Pune' },
];

export interface SearchFormData {
  originPincode: string;
  destinationPincode: string;
  weight: number;
  weightUnit: 'kg' | 'tonnes';
  vehicleType?: string;
  pickupDate: Date;
  dropDate: Date;
  urgencyLevel: 'standard' | 'express' | 'urgent';
}

interface SearchSectionProps {
  truckTypes: TruckType[];
  onSearch: (data: SearchFormData) => void;
  isLoading?: boolean;
}

export function SearchSection({ truckTypes, onSearch, isLoading = false }: SearchSectionProps) {
  // Form state
  const [originPincode, setOriginPincode] = useState('400001');
  const [destinationPincode, setDestinationPincode] = useState('110001');
  const [weight, setWeight] = useState<number>(3);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'tonnes'>('tonnes');
  const [vehicleType, setVehicleType] = useState<string>('any');
  
  // Initialize dates properly to avoid hydration mismatch
  const [pickupDate, setPickupDate] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to avoid hydration mismatch
    return today;
  });
  const [dropDate, setDropDate] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to avoid hydration mismatch
    return addDays(today, 2);
  });
  
  const [urgencyLevel, setUrgencyLevel] = useState<'standard' | 'express' | 'urgent'>('standard');
  
  // UI state
  const [isPickupCalendarOpen, setIsPickupCalendarOpen] = useState(false);
  const [isDropCalendarOpen, setIsDropCalendarOpen] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

  const validateForm = (): string | null => {
    if (!originPincode.trim()) return 'Origin pincode is required';
    if (!destinationPincode.trim()) return 'Destination pincode is required';
    if (originPincode === destinationPincode) return 'Origin and destination pincode cannot be the same';
    if (!weight || weight <= 0) return 'Weight must be greater than 0';
    if (!pickupDate) return 'Pickup date is required';
    if (!dropDate) return 'Drop date is required';
    if (dropDate <= pickupDate) return 'Drop date must be after pickup date';
    return null;
  };

  const handleSearch = () => {
    const error = validateForm();
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError('');
    
    const searchData: SearchFormData = {
      originPincode,
      destinationPincode,
      weight,
      weightUnit,
      vehicleType: vehicleType === 'any' ? undefined : vehicleType,
      pickupDate,
      dropDate,
      urgencyLevel,
    };

    onSearch(searchData);
  };

  return (
    <Card className="p-6 mb-6 shadow-md">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Search for Trucks</h2>
        <p className="text-gray-600 text-sm">Find the perfect truck for your transportation needs</p>
      </div>

      {validationError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-red-700 text-sm">{validationError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-end">
        {/* Origin Pin Code */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-900">
            Origin Pincode <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <Select value={originPincode} onValueChange={setOriginPincode}>
              <SelectTrigger className="pl-10 h-10">
                <SelectValue placeholder="Select Origin" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_PIN_CODES.map((location) => (
                  <SelectItem key={location.code} value={location.code}>
                    {location.city} ({location.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Destination Pin Code */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-900">
            Destination Pincode <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <Select value={destinationPincode} onValueChange={setDestinationPincode}>
              <SelectTrigger className="pl-10 h-10">
                <SelectValue placeholder="Select Destination" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_PIN_CODES.map((location) => (
                  <SelectItem key={location.code} value={location.code}>
                    {location.city} ({location.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-900">
            Weight <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="h-10"
              min="0.1"
              step="0.1"
              placeholder="Enter weight"
            />
            <Select value={weightUnit} onValueChange={(value) => setWeightUnit(value as 'kg' | 'tonnes')}>
              <SelectTrigger className="w-24 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">KG</SelectItem>
                <SelectItem value="tonnes">Tonnes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Vehicle Type */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-900">Vehicle Type</Label>
          <Select value={vehicleType} onValueChange={setVehicleType}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Any Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Type</SelectItem>
              {truckTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pickup Date */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-900">
            Pickup Date <span className="text-red-500">*</span>
          </Label>
          <Popover open={isPickupCalendarOpen} onOpenChange={setIsPickupCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-10 justify-start font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(pickupDate, 'dd/MM/yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={pickupDate}
                onSelect={(date) => {
                  if (date) {
                    setPickupDate(date);
                    // Ensure drop date is after pickup date
                    if (dropDate <= date) {
                      setDropDate(addDays(date, 1));
                    }
                  }
                  setIsPickupCalendarOpen(false);
                }}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Drop Date */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-900">
            Drop Date <span className="text-red-500">*</span>
          </Label>
          <Popover open={isDropCalendarOpen} onOpenChange={setIsDropCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-10 justify-start font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(dropDate, 'dd/MM/yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dropDate}
                onSelect={(date) => {
                  if (date) setDropDate(date);
                  setIsDropCalendarOpen(false);
                }}
                disabled={(date) => date <= pickupDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Urgency Level */}
      <div className="mt-4 flex items-center gap-4">
        <Label className="text-sm font-medium text-gray-900">Urgency Level:</Label>
        <div className="flex gap-2">
          {[
            { value: 'standard', label: 'Standard' },
            { value: 'express', label: 'Express' },
            { value: 'urgent', label: 'Urgent' },
          ].map((option) => (
            <Button
              key={option.value}
              variant={urgencyLevel === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setUrgencyLevel(option.value as 'standard' | 'express' | 'urgent')}
              className="text-xs"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-6 flex justify-center">
        <Button 
          onClick={handleSearch}
          disabled={isLoading}
          size="lg"
          className="px-8"
        >
          {isLoading ? 'Searching...' : 'Search Trucks'}
        </Button>
      </div>
    </Card>
  );
}
