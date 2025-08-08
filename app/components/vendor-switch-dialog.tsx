'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Truck, Package } from 'lucide-react';
import { useQuotation } from '@/contexts/quotation-context';

export function VendorSwitchDialog() {
  const { state, confirmVendorSwitch, cancelVendorSwitch } = useQuotation();
  
  const isOpen = !!state.pendingVendorSwitch;
  const pendingSwitch = state.pendingVendorSwitch;
  const currentQuotation = state.currentQuotation;

  if (!pendingSwitch || !currentQuotation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && cancelVendorSwitch()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <DialogTitle>Switch Vendor?</DialogTitle>
          </div>
          <DialogDescription>
            You&apos;re about to switch from one vendor to another. This will clear your current quotation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Quotation Summary */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-900">Current Quotation</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-red-700">Vendor:</span>
                <span className="font-medium text-red-900">{currentQuotation.vendorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-700">Vehicles:</span>
                <span className="font-medium text-red-900">{currentQuotation.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-700">Total Amount:</span>
                <span className="font-medium text-red-900">₹{currentQuotation.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* New Vehicle Info */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-900">New Vehicle</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Vendor:</span>
                <span className="font-medium text-green-900">{pendingSwitch.newVendorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Vehicle:</span>
                <span className="font-medium text-green-900">{pendingSwitch.vehicle.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Price:</span>
                <span className="font-medium text-green-900">{pendingSwitch.vehicle.total}</span>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Your current quotation will be saved to history and you&apos;ll start a new quotation with the selected vehicle from {pendingSwitch.newVendorName}.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={cancelVendorSwitch}
          >
            Keep Current Quotation
          </Button>
          <Button
            onClick={confirmVendorSwitch}
            className="bg-green-600 hover:bg-green-700"
          >
            Switch to {pendingSwitch.newVendorName}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
