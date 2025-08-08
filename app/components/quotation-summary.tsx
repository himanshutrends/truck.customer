'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Package, 
  Truck, 
  MapPin, 
  Calendar,
  Weight,
  X,
  Plus,
  Minus,
  Loader2
} from 'lucide-react';
import { useQuotation } from '@/contexts/quotation-context';
import { format } from 'date-fns';
import { createQuotationRequest } from '@/app/server/actions/quotation';

interface QuotationSummaryProps {
  className?: string;
  showActions?: boolean;
}

export function QuotationSummary({ className = '', showActions = true }: QuotationSummaryProps) {
  const { 
    state, 
    removeVehicleFromQuotation, 
    updateVehicleQuantity,
    clearQuotation,
    saveQuotationToHistory
  } = useQuotation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { currentQuotation, searchParams } = state;

  if (!currentQuotation || !searchParams) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No vehicles selected</p>
          <p className="text-xs text-gray-400 mt-1">
            Select vehicles to see your quotation summary
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

  const handleRequestQuotation = async () => {
    if (!currentQuotation || !searchParams) {
      setSubmitMessage({ type: 'error', text: 'No quotation data available' });
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitMessage(null);

      // Transform the quotation data to match the server action format
      const quotationRequest = {
        vendorId: currentQuotation.vendorId,
        vendorName: currentQuotation.vendorName,
        items: currentQuotation.items,
        totalAmount: currentQuotation.totalAmount,
        searchParams: {
          originPinCode: searchParams.originPinCode,
          destinationPinCode: searchParams.destinationPinCode,
          pickupDate: searchParams.pickupDate.toISOString(),
          dropDate: searchParams.dropDate.toISOString(),
          weight: searchParams.weight,
          weightUnit: searchParams.weightUnit,
          vehicleType: searchParams.vehicleType,
          urgencyLevel: searchParams.urgencyLevel
        }
      };

      console.log('Requesting quotation:', quotationRequest);

      const response = await createQuotationRequest(quotationRequest);

      if (response.success) {
        setSubmitMessage({ 
          type: 'success', 
          text: `Quotation request submitted successfully! Request ID: ${response.data?.quotation_request_id || 'Generated'}` 
        });
        saveQuotationToHistory();
        // Optional: Clear quotation after successful submission
        // clearQuotation();
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
    <Card className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold">Quotation Summary</h3>
        </div>
        {showActions && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearQuotation}
            className="text-gray-500 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{searchParams.originPinCode}</span>
          <span className="text-gray-400">→</span>
          <span className="font-medium">{searchParams.destinationPinCode}</span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{format(searchParams.pickupDate, 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Weight className="h-4 w-4" />
            <span>{searchParams.weight}</span>
          </div>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Vendor Info */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Truck className="h-4 w-4 text-green-600" />
          <span className="font-medium text-green-900">{currentQuotation.vendorName}</span>
        </div>
        <Badge variant="outline" className="text-xs">
          {currentQuotation.items.length} vehicle{currentQuotation.items.length > 1 ? 's' : ''} selected
        </Badge>
      </div>

      {/* Vehicle Items */}
      <div className="space-y-3 mb-6">
        {currentQuotation.items.map((item) => (
          <div key={item.vehicle.id} className="border rounded-lg p-3 bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.vehicle.model}</h4>
                <p className="text-xs text-gray-600">{item.vehicle.vehicleType} • {item.vehicle.maxWeight}</p>
                <p className="text-xs text-gray-500">{item.vehicle.gpsNumber}</p>
              </div>
              {showActions && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVehicleFromQuotation(item.vehicle.id)}
                  className="text-gray-400 hover:text-red-600 p-1 h-auto"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Qty:</span>
                {showActions ? (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.vehicle.id, -1)}
                      className="h-6 w-6 p-0"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="mx-2 min-w-[20px] text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.vehicle.id, 1)}
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <span className="text-sm font-medium">{item.quantity}</span>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  ₹{(parseFloat(item.vehicle.total.replace('₹', '').replace(',', '')) * item.quantity).toLocaleString()}
                </p>
                {item.quantity > 1 && (
                  <p className="text-xs text-gray-500">
                    {item.vehicle.total} × {item.quantity}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator className="mb-4" />

      {/* Total */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total Estimated Amount</span>
          <span className="text-green-600">₹{currentQuotation.totalAmount.toLocaleString()}</span>
        </div>
        <p className="text-xs text-gray-500">
          Estimated delivery: {currentQuotation.items[0]?.vehicle.estimatedDelivery}
        </p>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="space-y-3">
          {/* Success/Error Message */}
          {submitMessage && (
            <div className={`p-3 rounded-lg text-sm ${
              submitMessage.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {submitMessage.text}
            </div>
          )}
          
          <Button 
            onClick={handleRequestQuotation}
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting Request...
              </>
            ) : (
              <>
                <Package className="h-4 w-4 mr-2" />
                Request Quotation
              </>
            )}
          </Button>
          
          {!isSubmitting && (
            <p className="text-xs text-center text-gray-500">
              This will send your quotation request to {currentQuotation.vendorName}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
