'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Truck, 
  X, 
  Plus, 
  Minus, 
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useQuotation } from '@/contexts/quotation-context';
import { createQuotationRequest } from '@/app/server/actions/home';
import { useRouter } from 'next/navigation';

interface QuotationSectionProps {
  onClose: () => void;
}

export function QuotationSection({ onClose }: QuotationSectionProps) {
  const { 
    state, 
    removeVehicleFromQuotation, 
    updateVehicleQuantity,
    clearQuotation
  } = useQuotation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [customerProposedAmount, setCustomerProposedAmount] = useState<string>('');
  const [negotiationMessage, setNegotiationMessage] = useState<string>('');

  const { currentQuotation, searchParams } = state;
  const router = useRouter();

  // Early return if no quotation data
  if (!currentQuotation || !searchParams) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No vehicles selected</p>
          <p className="text-sm text-gray-400 mt-2">
            Select vehicles from search results to create quotation
          </p>
        </div>
      </Card>
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
    
    try {
      setIsSubmitting(true);
      setSubmitMessage(null);

      // Prepare quotation data matching backend expectations
      const quotationData = {
        vendor_id: currentQuotation.vendorId,
        vendor_name: currentQuotation.vendorName,
        total_amount: currentQuotation.totalAmount,
        origin_pincode: searchParams.originPinCode,
        destination_pincode: searchParams.destinationPinCode,
        pickup_date: searchParams.pickupDate.toISOString(),
        drop_date: searchParams.dropDate.toISOString(),
        weight: searchParams.weight.toString(),
        weight_unit: searchParams.weightUnit,
        urgency_level: searchParams.urgencyLevel,
        vehicle_type: searchParams.vehicleType || 'Mixed',
        customer_proposed_amount: customerProposedAmount ? parseFloat(customerProposedAmount) : undefined,
        customer_negotiation_message: negotiationMessage.trim() || undefined,
        items: currentQuotation.items.map(item => ({
          vehicle_id: parseInt(item.vehicle.id),
          vehicle_model: item.vehicle.model,
          vehicle_type: item.vehicle.vehicleType,
          max_weight: item.vehicle.maxWeight.toString(),
          gps_number: item.vehicle.gpsNumber,
          unit_price: item.vehicle.total.toString(),
          quantity: item.quantity,
          estimated_delivery: item.vehicle.estimatedDelivery
        }))
      };

      console.log('Submitting quotation:', quotationData);
      const response = await createQuotationRequest(quotationData);

      if (response.success) {
        setSubmitMessage({ 
          type: 'success', 
          text: `Quotation request submitted successfully! Request ID: ${response.data?.id || 'Generated'}` 
        });
        
        // Clear form and close after 2 seconds
        setTimeout(() => {
          clearQuotation();
          onClose();
        }, 2000);

        router.push('/order-request');
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
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Create Quotation Request</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Vendor Info */}
      <div className="mb-6">
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          {currentQuotation.vendorName}
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Route Information */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Route Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">From:</span>
              <span className="font-medium">{searchParams.originPinCode}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">To:</span>
              <span className="font-medium">{searchParams.destinationPinCode}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Pickup:</span>
              <span className="font-medium">{format(searchParams.pickupDate, 'dd/MM/yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Drop:</span>
              <span className="font-medium">{format(searchParams.dropDate, 'dd/MM/yyyy')}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Selected Vehicles */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Selected Vehicles</h3>
          <div className="space-y-3">
            {currentQuotation.items.map((item) => (
              <div key={item.vehicle.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.vehicle.name}</h4>
                    <p className="text-sm text-gray-600">{item.vehicle.model}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVehicleFromQuotation(item.vehicle.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.vehicle.id, -1)}
                        disabled={item.quantity <= 1}
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.vehicle.id, 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">₹{item.vehicle.total.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Information */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Price Information</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Vendor Quote Total:</span>
              <span className="text-lg font-bold text-green-600">
                ₹{currentQuotation.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Customer Proposed Amount (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="proposedAmount" className="text-sm font-medium">
              Your Proposed Amount (Optional)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <Input
                id="proposedAmount"
                type="number"
                value={customerProposedAmount}
                onChange={(e) => setCustomerProposedAmount(e.target.value)}
                placeholder="Enter your price proposal"
                className="pl-8"
                min="0"
                step="100"
              />
            </div>
            <p className="text-xs text-gray-500">
              Leave empty to accept the vendor&apos;s quoted price
            </p>
          </div>

          {/* Negotiation Message */}
          <div className="space-y-2">
            <Label htmlFor="negotiationMessage" className="text-sm font-medium">
              Message to Vendor (Optional)
            </Label>
            <Textarea
              id="negotiationMessage"
              value={negotiationMessage}
              onChange={(e) => setNegotiationMessage(e.target.value)}
              placeholder="Add any special requirements or negotiate terms..."
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <div className={`p-3 rounded-md flex items-start gap-2 ${
            submitMessage.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {submitMessage.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            )}
            <p className={`text-sm ${
              submitMessage.type === 'success' ? 'text-green-700' : 'text-red-700'
            }`}>
              {submitMessage.text}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={isSubmitting || !currentQuotation.items.length}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting Request...
            </>
          ) : (
            'Submit Quotation Request'
          )}
        </Button>
      </form>
    </Card>
  );
}
