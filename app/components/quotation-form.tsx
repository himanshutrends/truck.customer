'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  IconMapPin, 
  IconCalendar,
  IconInfoCircle,
  IconX,
  IconPlus,
  IconMinus,
  IconTruck,
  IconCheck
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useQuotation } from '@/contexts/quotation-context';
import { createQuotationRequest } from '@/app/server/actions/quotation';

interface QuotationFormProps {
  onClose: () => void;
  className?: string;
}

export function QuotationForm({ onClose, className = '' }: QuotationFormProps) {
  const { 
    state, 
    removeVehicleFromQuotation, 
    updateVehicleQuantity,
    clearQuotation,
    saveQuotationToHistory
  } = useQuotation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Form data state (editable fields)
  const [formData, setFormData] = useState({
    originPinCode: '',
    destinationPinCode: '',
    pickupDate: undefined as Date | undefined,
    dropDate: undefined as Date | undefined,
    weight: '',
    weightUnit: 'Tonnes',
    totalPrice: '',
    priceUnit: 'Rupees',
    specialRequirements: '',
    urgencyLevel: 'standard',
    hasHazardousMaterials: false,
  });

  const { currentQuotation, searchParams } = state;

  // Initialize form data from search params and quotation
  useEffect(() => {
    if (searchParams && currentQuotation) {
      setFormData({
        originPinCode: searchParams.originPinCode || '',
        destinationPinCode: searchParams.destinationPinCode || '',
        pickupDate: searchParams.pickupDate || undefined,
        dropDate: searchParams.dropDate || undefined,
        weight: searchParams.weight || '',
        weightUnit: searchParams.weightUnit === 'kg' ? 'KG' : 'Tonnes',
        totalPrice: currentQuotation.totalAmount.toString(),
        priceUnit: 'Rupees',
        specialRequirements: searchParams.specialRequirements?.join(', ') || '',
        urgencyLevel: searchParams.urgencyLevel || 'standard',
        hasHazardousMaterials: false,
      });
    }
  }, [searchParams, currentQuotation]);

  if (!currentQuotation || !searchParams) {
    return (
      <div className={`${className} p-6 bg-gray-50 flex items-center justify-center min-h-[400px]`}>
        <div className="text-center text-gray-500">
          <IconTruck className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No vehicles selected</p>
          <p className="text-sm text-gray-400 mt-2">
            Select vehicles from the search results to create your quotation
          </p>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (vehicleId: string, change: number) => {
    const currentItem = currentQuotation.items.find(item => item.vehicle.id === vehicleId);
    if (currentItem) {
      const newQuantity = currentItem.quantity + change;
      if (newQuantity > 0) {
        updateVehicleQuantity(vehicleId, newQuantity);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentQuotation || !searchParams) {
      setSubmitMessage({ type: 'error', text: 'No quotation data available' });
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitMessage(null);

      // Update the quotation with edited data
      const quotationRequest = {
        vendorId: currentQuotation.vendorId,
        vendorName: currentQuotation.vendorName,
        items: currentQuotation.items,
        totalAmount: parseFloat(formData.totalPrice) || currentQuotation.totalAmount,
        searchParams: {
          originPinCode: formData.originPinCode,
          destinationPinCode: formData.destinationPinCode,
          pickupDate: formData.pickupDate?.toISOString() || new Date().toISOString(),
          dropDate: formData.dropDate?.toISOString() || new Date().toISOString(),
          weight: formData.weight,
          weightUnit: formData.weightUnit.toLowerCase(),
          vehicleType: searchParams.vehicleType,
          urgencyLevel: formData.urgencyLevel
        }
      };

      console.log('Submitting quotation:', quotationRequest);
      const response = await createQuotationRequest(quotationRequest);

      console.log('Quotation submission response:', response);

      if (response.success) {
        setSubmitMessage({ 
          type: 'success', 
          text: `Quotation request submitted successfully! Request ID: ${response.data?.quotation_request_id || 'Generated'}` 
        });
        saveQuotationToHistory();
        setTimeout(() => {
          clearQuotation();
          onClose();
        }, 2000);
      } else {
        setSubmitMessage({ 
          type: 'error', 
          text: response.error || 'Failed to submit quotation request' 
        });
      }
    } catch (error) {
      console.error('Error submitting quotation:', error);
      setSubmitMessage({ 
        type: 'error', 
        text: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${className} bg-white border-l border-gray-200 overflow-y-auto`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <IconTruck className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Create Quotation</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <IconX className="h-4 w-4" />
          </Button>
        </div>

        {/* Vendor Info */}
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {currentQuotation.vendorName}
          </Badge>
          <span className="text-sm text-gray-600">
            {currentQuotation.items.length} vehicle{currentQuotation.items.length > 1 ? 's' : ''} selected
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Route Details Section */}
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-900">ROUTE DETAILS</h3>
          <p className="text-sm text-gray-600 mb-4">
            Configure your pickup and delivery locations with schedule
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="originPinCode">Origin Pin Code*</Label>
              <div className="relative">
                <IconMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="originPinCode"
                  placeholder="Enter origin pin code"
                  className="pl-10"
                  value={formData.originPinCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, originPinCode: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destinationPinCode">Destination Pin Code*</Label>
              <div className="relative">
                <IconMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="destinationPinCode"
                  placeholder="Enter destination pin code"
                  className="pl-10"
                  value={formData.destinationPinCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, destinationPinCode: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupDate">Pickup Date*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal pl-10",
                      !formData.pickupDate && "text-gray-500"
                    )}
                  >
                    <IconCalendar className="h-4 w-4 text-gray-400" />
                    {formData.pickupDate ? (
                      format(formData.pickupDate, "dd MMM yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.pickupDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, pickupDate: date }))}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dropDate">Delivery Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal pl-10",
                      !formData.dropDate && "text-gray-500"
                    )}
                  >
                    <IconCalendar className="h-4 w-4 text-gray-400" />
                    {formData.dropDate ? (
                      format(formData.dropDate, "dd MMM yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dropDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, dropDate: date }))}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight*</Label>
              <div className="flex">
                <Input
                  id="weight"
                  placeholder="120"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  className="rounded-r-none"
                />
                <Select value={formData.weightUnit} onValueChange={(value) => setFormData(prev => ({ ...prev, weightUnit: value }))}>
                  <SelectTrigger className="w-28 rounded-l-none border-l-0 bg-blue-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tonnes">Tonnes</SelectItem>
                    <SelectItem value="KG">KG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgencyLevel">Delivery Priority</Label>
              <Select value={formData.urgencyLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, urgencyLevel: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Vehicle Items */}
        <div>
          <h3 className="text-sm font-medium mb-4 text-gray-900">SELECTED VEHICLES</h3>
          <div className="space-y-3">
            {currentQuotation.items.map((item) => (
              <Card key={item.vehicle.id} className="p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.vehicle.model}</h4>
                    <p className="text-xs text-gray-600">{item.vehicle.vehicleType} • {item.vehicle.maxWeight}</p>
                    <p className="text-xs text-gray-500">{item.vehicle.gpsNumber}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVehicleFromQuotation(item.vehicle.id)}
                    className="text-gray-400 hover:text-red-600 p-1 h-auto"
                  >
                    <IconX className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Qty:</span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.vehicle.id, -1)}
                        className="h-6 w-6 p-0"
                        disabled={item.quantity <= 1}
                      >
                        <IconMinus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.vehicle.id, 1)}
                        className="h-6 w-6 p-0"
                      >
                        <IconPlus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Price per unit</p>
                    <p className="text-sm font-bold">{item.vehicle.total}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        {/* Pricing Section */}
        <div>
          <h3 className="text-sm font-medium mb-4 text-gray-900">PRICING</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="totalPrice">Total Price (Editable)</Label>
              <div className="flex">
                <Input
                  id="totalPrice"
                  placeholder="e.g. 28,000"
                  value={formData.totalPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalPrice: e.target.value }))}
                  className="rounded-r-none font-medium"
                />
                <Select value={formData.priceUnit} onValueChange={(value) => setFormData(prev => ({ ...prev, priceUnit: value }))}>
                  <SelectTrigger className="w-28 rounded-l-none border-l-0 bg-blue-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rupees">Rupees</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequirements">Special Requirements</Label>
              <Input
                id="specialRequirements"
                placeholder="Any special handling, equipment, or delivery instructions"
                value={formData.specialRequirements}
                onChange={(e) => setFormData(prev => ({ ...prev, specialRequirements: e.target.value }))}
              />
            </div>

            {/* Hazardous Materials Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hazardous"
                checked={formData.hasHazardousMaterials}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasHazardousMaterials: !!checked }))}
                className="text-blue-600"
              />
              <Label htmlFor="hazardous" className="text-sm">
                This shipment contains hazardous materials
              </Label>
            </div>
          </div>
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <div className={`p-3 rounded-lg text-sm ${
            submitMessage.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {submitMessage.type === 'success' ? (
                <IconCheck className="h-4 w-4" />
              ) : (
                <IconX className="h-4 w-4" />
              )}
              {submitMessage.text}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <IconInfoCircle className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Request Quotation'
            )}
          </Button>
        </div>

        {!isSubmitting && (
          <p className="text-xs text-center text-gray-500">
            This will send your quotation request to {currentQuotation.vendorName}
          </p>
        )}
      </form>
    </div>
  );
}
