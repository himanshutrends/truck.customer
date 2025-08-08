'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { MapPin, Calendar as CalendarIcon, Info } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

interface SearchFormProps {
  onSearch?: (searchData: SearchFormData) => void;
}

interface SearchFormData {
  originPinCode: string;
  destinationPinCode: string;
  weight: string;
  dateRange: DateRange | undefined;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [originPinCode, setOriginPinCode] = useState('');
  const [destinationPinCode, setDestinationPinCode] = useState('');
  const [weight, setWeight] = useState('76 tonnes');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSearch = () => {
    const searchData: SearchFormData = {
      originPinCode,
      destinationPinCode,
      weight,
      dateRange,
    };
    
    onSearch?.(searchData);
    // console.log('Search data:', searchData);
  };

  const formatDateRange = () => {
    if (!dateRange?.from) return '26/1/25 - 28/1/25';
    
    if (dateRange.to) {
      return `${format(dateRange.from, 'dd/MM/yy')} - ${format(dateRange.to, 'dd/MM/yy')}`;
    } else {
      return format(dateRange.from, 'dd/MM/yy');
    }
  };

  return (
    <TooltipProvider>
      <Card className="p-6 mb-6 shadow-md">
        <div className="flex flex-col lg:flex-row gap-5 items-end">
          {/* Origin Pin Code */}
          <div className="flex-1 space-y-1">
            <Label className="text-sm font-medium text-neutral-900">
              Origin Pin Code
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <Input
                placeholder="Enter Origin"
                value={originPinCode}
                onChange={(e) => setOriginPinCode(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>

          {/* Destination Pin Code */}
          <div className="flex-1 space-y-1">
            <Label className="text-sm font-medium text-neutral-900">
              Destination Pin Code
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <Input
                placeholder="Enter Destination"
                value={destinationPinCode}
                onChange={(e) => setDestinationPinCode(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>

          {/* Weights */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-neutral-900">
                Weights
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-neutral-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total weight of your shipment in tonnes</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Dates */}
          <div className="flex-1 space-y-1">
            <Label className="text-sm font-medium text-neutral-900">
              Dates
            </Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-11 justify-start font-normal text-neutral-400"
                >
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {formatDateRange()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Find Options Button */}
          <div className="shrink-0">
            <Button 
              onClick={handleSearch}
              className="px-6 h-11 font-bold"
            >
              Find Options
            </Button>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
};
