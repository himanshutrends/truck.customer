"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  IconUsers, 
  IconDots 
} from "@tabler/icons-react"
import SubmitQuoteForm from "./submit-quote-form"

export interface ShipmentData {
  id: string
  companyName: string
  fee: string
  pickupAddress: string
  weight: string
  deliveryAddress: string
  pickupDate: string
  vehicleType: string
}

interface ShipmentCardProps {
  shipment: ShipmentData
  buttonType: "bid" | "quote"
  onBidClick?: (shipmentId: string) => void
  onQuoteClick?: (shipmentId: string) => void
  onMoreClick?: (shipmentId: string) => void
}

export function ShipmentCard({ 
  shipment, 
  buttonType = "bid",
  onBidClick,
  onQuoteClick,
  onMoreClick 
}: ShipmentCardProps) {
  const [showQuoteModal, setShowQuoteModal] = useState(false)

  const handlePrimaryAction = () => {
    if (buttonType === "bid") {
      onBidClick?.(shipment.id)
    } else {
      onQuoteClick?.(shipment.id)
    }
  }

  const handleQuoteSubmit = () => {
    setShowQuoteModal(true)
  }

  const handleMoreClick = () => {
    onMoreClick?.(shipment.id)
  }

  const handleQuoteSubmission = (quoteData: unknown) => {
    console.log("Quote submitted:", quoteData)
    // Handle quote submission logic here
    onQuoteClick?.(shipment.id)
  }

  return (
    <Card className="w-full border border-neutral-200 rounded-xl">
      <CardContent>
        {/* Header Section */}
        <div className="flex flex-col gap-6">
          {/* Company Header with Actions */}
          <div className="flex items-center justify-between">
            {/* Company Info */}
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 rounded-lg p-2 size-[42px] flex items-center justify-center">
                <IconUsers className="size-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-semibold">
                {shipment.companyName}
              </h3>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {buttonType === "bid" ? (
                <Button 
                  onClick={handlePrimaryAction}
                  className="bg-blue-700 hover:bg-blue-800 text-white"
                >
                  Bid
                </Button>
              ) : (
                <Button 
                  onClick={handleQuoteSubmit}
                  className="bg-blue-700 hover:bg-blue-800 text-white"
                >
                  Submit a request
                </Button>
              )}
              
              <Button 
                onClick={handleQuoteSubmit}
                variant="outline"
                className="bg-white border-neutral-200 text-neutral-900 hover:bg-neutral-50"
              >
                Create a quote
              </Button>
              
              <Button 
                onClick={handleMoreClick}
                variant="outline"
                size="icon"
                className="bg-white border-neutral-200 h-[42px] w-[42px] rounded-lg hover:bg-neutral-50"
              >
                <IconDots className="size-[18px] text-neutral-900" />
              </Button>
            </div>
          </div>

          {/* Shipment Details Grid */}
          <div className="grid grid-cols-6 gap-5">
            {/* Fee */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-zinc-500">
                Fee
              </span>
              <span className="font-medium">
                {shipment.fee}
              </span>
            </div>

            {/* Pickup Address */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-zinc-500">
                Pickup Address
              </span>
              <span className="font-medium leading-7">
                {shipment.pickupAddress}
              </span>
            </div>

            {/* Weight */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-zinc-500">
                Weight
              </span>
              <span className="font-medium leading-7">
                {shipment.weight}
              </span>
            </div>

            {/* Delivery Address */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-zinc-500">
                Delivery Address
              </span>
              <span className="font-medium leading-7">
                {shipment.deliveryAddress}
              </span>
            </div>

            {/* Pickup Date */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-zinc-500">
                Pickup Date
              </span>
              <span className="font-medium leading-7">
                {shipment.pickupDate}
              </span>
            </div>

            {/* Vehicle Type */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-zinc-500">
                Vehicle Type
              </span>
              <span className="font-medium leading-7">
                {shipment.vehicleType || "-"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Submit Quote Modal */}
      <SubmitQuoteForm
        open={showQuoteModal}
        onOpenChange={setShowQuoteModal}
        shipment={shipment}
        onSubmit={handleQuoteSubmission}
      />
    </Card>
  )
}

// Example usage and mock data
export const mockShipments: ShipmentData[] = [
  {
    id: "1",
    companyName: "Mearsk Shipping",
    fee: "₹1,64,000",
    pickupAddress: "45 Maple Street, Chinnwara, MP",
    weight: "12 Tonnes",
    deliveryAddress: "45 Maple Street, New Delhi, MP",
    pickupDate: "12 January 2025",
    vehicleType: "-"
  },
  {
    id: "2", 
    companyName: "Swift Logistics",
    fee: "₹98,500",
    pickupAddress: "Industrial Zone, Mumbai, MH",
    weight: "8 Tonnes",
    deliveryAddress: "Tech Park, Bangalore, KA",
    pickupDate: "15 January 2025",
    vehicleType: "Container Truck"
  },
  {
    id: "3",
    companyName: "Express Freight",
    fee: "₹2,25,000",
    pickupAddress: "Port Area, Chennai, TN",
    weight: "20 Tonnes",
    deliveryAddress: "Warehouse District, Hyderabad, TS",
    pickupDate: "18 January 2025",
    vehicleType: "Heavy Truck"
  }
]

export default ShipmentCard
