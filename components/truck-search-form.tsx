'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SearchInput } from './search-input';
import { SelectInput } from './select-input';

// Create dynamic schema based on expanded state
const createSearchSchema = (isExpanded: boolean) => {
  const baseSchema = {
    originPinCode: z.string().min(6, 'Pin code must be 6 digits').max(6, 'Pin code must be 6 digits').regex(/^\d+$/, 'Pin code must contain only numbers'),
    destinationPinCode: z.string().min(6, 'Pin code must be 6 digits').max(6, 'Pin code must be 6 digits').regex(/^\d+$/, 'Pin code must contain only numbers'),
    weight: z.string().min(1, 'Weight is required').regex(/^\d+(\.\d+)?$/, 'Weight must be a valid number'),
  };

  if (isExpanded) {
    return z.object({
      ...baseSchema,
      vehicleType: z.string().min(1, 'Vehicle type is required'),
      commodityType: z.string().min(1, 'Commodity type is required'),
      packageType: z.string().min(1, 'Package type is required'),
      packageDimensions: z.string().min(1, 'Package dimensions are required'),
      packageQuantity: z.string().min(1, 'Package quantity is required').regex(/^\d+$/, 'Must be a valid number'),
      hasHazardousMaterials: z.boolean().optional(),
    });
  }

  return z.object({
    ...baseSchema,
    commodityType: z.string().optional(),
    packageType: z.string().optional(),
    packageDimensions: z.string().optional(),
    packageQuantity: z.string().optional(),
    hasHazardousMaterials: z.boolean().optional(),
  });
};

export type SearchFormData = {
  originPinCode: string;
  destinationPinCode: string;
  weight: string;
  vehicleType?: string; // Only required when expanded
  commodityType?: string;
  packageType?: string;
  packageDimensions?: string;
  packageQuantity?: string;
  hasHazardousMaterials?: boolean;
};

interface TruckSearchFormProps {
  onSearch: (data: SearchFormData) => void;
}

export function TruckSearchForm({ onSearch }: TruckSearchFormProps) {
  const [activeTab, setActiveTab] = useState<'transporter' | 'delivery'>('transporter');
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm<SearchFormData>({
    resolver: zodResolver(createSearchSchema(isExpanded)),
  });

  const swapValues = () => {
    const origin = watch('originPinCode');
    const destination = watch('destinationPinCode');
    setValue('originPinCode', destination || '');
    setValue('destinationPinCode', origin || '');
  };

  const toggleExpanded = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    setIsExpanded(!isExpanded);
  };

  const vehicleOptions = [
    { value: 'wooden-crate', label: 'Wooden Crate' },
    { value: 'open-truck', label: 'Open Truck' },
    { value: 'closed-truck', label: 'Closed Truck' },
    { value: 'container', label: 'Container' },
  ];

  const commodityOptions = [
    { value: 'wooden-crate', label: 'Wooden Crate' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'textiles', label: 'Textiles' },
    { value: 'food-items', label: 'Food Items' },
  ];

  const packageOptions = [
    { value: 'wooden-crate', label: 'Wooden Crate' },
    { value: 'cardboard-box', label: 'Cardboard Box' },
    { value: 'plastic-crate', label: 'Plastic Crate' },
    { value: 'metal-container', label: 'Metal Container' },
  ];

  return (
    <div className="w-fit rounded-lg shadow-lg">
      {/* Tab Navigation */}
      <div className="flex">
        <button
          type="button"
          onClick={() => setActiveTab('transporter')}
          className={`px-6 py-4 text-lg font-semibold transition-colors rounded-tl-lg ${
            activeTab === 'transporter'
              ? 'bg-white text-neutral-900'
              : 'bg-neutral-200 text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          Find Transporter
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('delivery')}
          className={`px-6 py-4 text-lg font-semibold transition-colors rounded-tr-lg ${
            activeTab === 'delivery'
              ? 'bg-white text-neutral-900'
              : 'bg-neutral-200 text-neutral-900  hover:bg-neutral-100'
          }`}
        >
          Find Delivery
        </button>
      </div>

      {/* Form Content */}
      <div className="p-6 bg-white rounded-b-lg rounded-tr-lg">
        <form onSubmit={handleSubmit(onSearch)} className="space-y-4">
          {/* Input Row */}
          <div className="flex items-end gap-5">
            <div className="flex items-center gap-2">
              {/* Origin Input */}
              <SearchInput
                label="Origin Pin Code"
                placeholder="Enter Destination"
                error={errors.originPinCode?.message}
                icon="location"
                {...register('originPinCode')}
              />

              {/* Swap Button */}
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={swapValues}
                  className="bg-black/5 rounded-full mt-5 p-2 rotate-90 hover:bg-black/10 transition-colors"
                >
                  <SwapIcon />
                </button>
              </div>

              {/* Destination Input */}
              <SearchInput
                label="Destination Pin Code"
                placeholder="Enter Destination"
                error={errors.destinationPinCode?.message}
                icon="location"
                {...register('destinationPinCode')}
              />
            </div>

            {/* Weight Input */}
            <SearchInput
              label="Weights"
              placeholder="Enter the weight"
              error={errors.weight?.message}
              showInfo
              {...register('weight')}
            />

            {/* Calculate Button - Only show when not expanded */}
            {!isExpanded && (
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-lg h-[53px] w-36 transition-colors"
              >
                Calculate
              </button>
            )}
          </div>

          {/* Expanded Section */}
          {isExpanded && (
            <div className="space-y-4 animate-in slide-in-from-top duration-300">
              {/* Second Row with Vehicle Type */}
              <div className="flex items-end gap-5">
                <Controller
                  name="vehicleType"
                  control={control}
                  render={({ field }) => (
                    <SelectInput
                      label="Vehicle Type"
                      placeholder="Wooden Crate"
                      options={vehicleOptions}
                      onChange={field.onChange}
                      value={field.value}
                      error={errors.vehicleType?.message}
                    />
                  )}
                />
                <div className="w-[248.667px]"></div> {/* Spacer */}
                <div className="w-[248.667px]"></div> {/* Spacer */}
                <div className="w-36"></div> {/* Button spacer */}
              </div>

              {/* Third Row */}
              <div className="flex items-end gap-5">
                <Controller
                  name="commodityType"
                  control={control}
                  render={({ field }) => (
                    <SelectInput
                      label="Commodity Type"
                      placeholder="Wooden Crate"
                      options={commodityOptions}
                      onChange={field.onChange}
                      value={field.value}
                      error={errors.commodityType?.message}
                    />
                  )}
                />

                <Controller
                  name="packageType"
                  control={control}
                  render={({ field }) => (
                    <SelectInput
                      label="Package Type"
                      placeholder="Wooden Crate"
                      options={packageOptions}
                      onChange={field.onChange}
                      value={field.value}
                      error={errors.packageType?.message}
                    />
                  )}
                />

                <SearchInput
                  label="Package Dimensions (cm)"
                  placeholder="Length | Breadth | Height"
                  {...register('packageDimensions')}
                />

                <SearchInput
                  label="Package Quantity"
                  placeholder="Enter the weight"
                  showInfo
                  {...register('packageQuantity')}
                />

                {/* Calculate Button in expanded mode */}
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-lg h-[53px] w-36 transition-colors"
                >
                  Calculate
                </button>
              </div>

              {/* Hazardous Materials Checkbox and Show Less */}
              <div className="flex items-center justify-between w-full pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <input
                      type="checkbox"
                      id="hazardousMaterials"
                      {...register('hasHazardousMaterials')}
                      className="hidden"
                    />
                    <label
                      htmlFor="hazardousMaterials"
                      className="w-6 h-6 border-2 border-blue-600 rounded flex items-center justify-center cursor-pointer bg-blue-600"
                    >
                      <CheckIcon />
                    </label>
                  </div>
                  <label 
                    htmlFor="hazardousMaterials"
                    className="text-sm font-medium text-neutral-900 cursor-pointer"
                  >
                    This shipment contains hazardous materials
                  </label>
                </div>

                <button
                  type="button"
                  onClick={toggleExpanded}
                  className="cursor-pointer text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
                >
                  Show Less →
                </button>
              </div>
            </div>
          )}

          {/* Show More Link - Only show when not expanded */}
          {!isExpanded && (
            <button
              type="button"
              onClick={toggleExpanded}
              className="cursor-pointer text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
            >
              Have more details? Enter them below →
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

function SwapIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.5 3L11.5 6L8.5 9M11.5 6H0.5M3.5 9L0.5 6L3.5 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.5 4.5L6 12L2.5 8.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
