'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TruckType } from '@/lib/types';

interface FiltersPanelProps {
  truckTypes: TruckType[];
}

export function FiltersPanel({ truckTypes }: FiltersPanelProps) {
  const [vehicleTypesExpanded, setVehicleTypesExpanded] = useState(true);
  const [priceRangeExpanded, setPriceRangeExpanded] = useState(true);
  const [loadCapacityExpanded, setLoadCapacityExpanded] = useState(true);
  const [materialTypeExpanded, setMaterialTypeExpanded] = useState(true);

  // Filter states
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [loadCapacity, setLoadCapacity] = useState('');
  const [numberOfBoxes, setNumberOfBoxes] = useState(3);
  const [selectedMaterialTypes, setSelectedMaterialTypes] = useState<string[]>([]);

  const handleVehicleTypeChange = (typeId: string, checked: boolean) => {
    if (checked) {
      setSelectedVehicleTypes([...selectedVehicleTypes, typeId]);
    } else {
      setSelectedVehicleTypes(selectedVehicleTypes.filter(id => id !== typeId));
    }
  };

  const handleMaterialTypeChange = (materialType: string, checked: boolean) => {
    if (checked) {
      setSelectedMaterialTypes([...selectedMaterialTypes, materialType]);
    } else {
      setSelectedMaterialTypes(selectedMaterialTypes.filter(type => type !== materialType));
    }
  };

  const vehicleTypeOptions = [
    { id: 'tata-ace', name: 'TATA Ace' },
    { id: 'tata-407', name: 'Tata 407' },
    { id: 'volvo-s440', name: 'Volvo S440' },
    { id: 'mahindra-evo', name: 'Mahindra EVO' },
    { id: 'bharti-leyland', name: 'Bharti Leyland' },
  ];

  const materialTypes = [
    'This shipment contains hazardous materials'
  ];

  return (
    <div className="w-full lg:w-72 space-y-4">
      <Card className="p-4">
        <h2 className="font-semibold text-lg mb-4">Filters</h2>

        {/* Vehicle Types */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setVehicleTypesExpanded(!vehicleTypesExpanded)}
            className="w-full justify-between p-0 h-auto font-medium text-left"
          >
            VEHICLE TYPES
            {vehicleTypesExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          {vehicleTypesExpanded && (
            <div className="mt-3 space-y-2">
              {vehicleTypeOptions.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={type.id}
                    checked={selectedVehicleTypes.includes(type.id)}
                    onCheckedChange={(checked) => handleVehicleTypeChange(type.id, checked === true)}
                  />
                  <Label htmlFor={type.id} className="text-sm font-normal">
                    {type.name}
                  </Label>
                </div>
              ))}
              <Button variant="link" className="p-0 h-auto text-sm text-blue-600">
                Show More...
              </Button>
            </div>
          )}
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setPriceRangeExpanded(!priceRangeExpanded)}
            className="w-full justify-between p-0 h-auto font-medium text-left"
          >
            PRICE RANGE
            {priceRangeExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          {priceRangeExpanded && (
            <div className="mt-3 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-gray-600">From</Label>
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">To</Label>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>₹{priceRange[0].toLocaleString()}</span>
                <span>₹{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Load Capacity */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLoadCapacityExpanded(!loadCapacityExpanded)}
            className="w-full justify-between p-0 h-auto font-medium text-left"
          >
            LOAD CAPACITY
            {loadCapacityExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          {loadCapacityExpanded && (
            <div className="mt-3 space-y-4">
              <div>
                <Label className="text-xs text-gray-600">Dimensions</Label>
                <Select value={loadCapacity} onValueChange={setLoadCapacity}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select dimensions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="22-46-12">22 | 46 | 12 | cm</SelectItem>
                    <SelectItem value="24-48-14">24 | 48 | 14 | cm</SelectItem>
                    <SelectItem value="26-50-16">26 | 50 | 16 | cm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-xs text-gray-600 mb-2 block">Number of boxes</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={numberOfBoxes}
                    onChange={(e) => setNumberOfBoxes(Number(e.target.value))}
                    className="h-8 w-16"
                    min="1"
                  />
                  <div className="flex-1">
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="1"
                      value={numberOfBoxes}
                      onChange={(e) => setNumberOfBoxes(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <span className="text-sm text-gray-500">{numberOfBoxes}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Material Type */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setMaterialTypeExpanded(!materialTypeExpanded)}
            className="w-full justify-between p-0 h-auto font-medium text-left"
          >
            MATERIAL TYPE
            {materialTypeExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          {materialTypeExpanded && (
            <div className="mt-3 space-y-2">
              {materialTypes.map((material) => (
                <div key={material} className="flex items-center space-x-2">
                  <Checkbox
                    id={material}
                    checked={selectedMaterialTypes.includes(material)}
                    onCheckedChange={(checked) => handleMaterialTypeChange(material, checked === true)}
                  />
                  <Label htmlFor={material} className="text-sm font-normal">
                    {material}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
