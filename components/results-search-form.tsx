import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

interface SearchFormProps {
  onSearch: (data: any) => void;
}

export const ResultsSearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  return (
    <div className="bg-blue-800 w-full py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            {/* Origin Pin Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-900">
                Origin Pin Code
              </label>
              <div className="relative">
                <Input
                  placeholder="Enter Destination"
                  className="pl-10"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>

            {/* Destination Pin Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-900">
                Destination Pin Code
              </label>
              <div className="relative">
                <Input
                  placeholder="Enter Destination"
                  className="pl-10"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>

            {/* Weights */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-900">
                Weights
              </label>
              <Input
                placeholder="76 tonnes"
                defaultValue="76 tonnes"
              />
            </div>

            {/* Vehicle Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-900">
                Vehicle Type
              </label>
              <Select defaultValue="wooden-crate">
                <option value="wooden-crate">Wooden Crate</option>
                <option value="truck">Truck</option>
                <option value="van">Van</option>
              </Select>
            </div>

            {/* Dates */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-900">
                Dates
              </label>
              <div className="relative">
                <Input
                  placeholder="26/1/25 - 28/1/25"
                  className="pl-10"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Find Options Button */}
            <div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3">
                Find Options
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
