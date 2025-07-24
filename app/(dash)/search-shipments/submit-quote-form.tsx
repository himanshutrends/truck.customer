"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModalForm } from "@/components/modal-form"
import { ShipmentData } from "./shipment-card"

interface SubmitQuoteFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shipment: ShipmentData | null
  onSubmit?: (quoteData: QuoteSubmission) => void
}

interface QuoteSubmission {
  shipmentId: string
  fee: string
  currency: string
  remarks: string
}

const currencies = [
  { value: "rupees", label: "Rupees" },
  { value: "usd", label: "USD" },
  { value: "eur", label: "EUR" },
]

export function SubmitQuoteForm({ 
  open, 
  onOpenChange, 
  shipment,
  onSubmit 
}: SubmitQuoteFormProps) {
  const [fee, setFee] = useState("")
  const [currency, setCurrency] = useState("rupees")
  const [remarks, setRemarks] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!shipment || !fee.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      const quoteData: QuoteSubmission = {
        shipmentId: shipment.id,
        fee: fee.trim(),
        currency,
        remarks: remarks.trim()
      }

      onSubmit?.(quoteData)
      
      // Reset form
      setFee("")
      setCurrency("rupees")
      setRemarks("")
      
      // Close modal
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting quote:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    // Reset form when closing
    setFee("")
    setCurrency("rupees")
    setRemarks("")
    onOpenChange(false)
  }

  if (!shipment) return null

  return (
    <ModalForm
      open={open}
      onOpenChange={handleClose}
      title="Submit Quote"
      showBackButton={true}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipment Details */}
        <div className="grid grid-cols-2 gap-4">
          {/* Pickup Address */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Pickup Address
            </Label>
            <div className="text-sm font-medium">
              {shipment.pickupAddress}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Delivery Address
            </Label>
            <div className="text-sm font-medium">
              {shipment.deliveryAddress}
            </div>
          </div>

          {/* Pickup Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Pickup Date
            </Label>
            <div className="text-sm font-medium">
              {shipment.pickupDate}
            </div>
          </div>

          {/* Estimated Delivery Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Estd. Delivery Date
            </Label>
            <div className="text-sm font-medium">
              26 January 2025
            </div>
          </div>
        </div>

        {/* Fee Input */}
        <div className="space-y-2">
          <Label htmlFor="fee" className="text-sm font-medium text-muted-foreground">
            Fee
          </Label>
          <div className="flex gap-2">
            <Input
              id="fee"
              type="text"
              placeholder="e.g. 28,000"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="flex-1"
              required
            />
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                  <SelectItem key={curr.value} value={curr.value}>
                    {curr.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Remarks */}
        <div className="space-y-2">
          <Label htmlFor="remarks" className="text-sm font-medium text-muted-foreground">
            Remarks
          </Label>
          <Textarea
            id="remarks"
            placeholder="Anything"
            value={remarks}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRemarks(e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isSubmitting || !fee.trim()}
        >
          {isSubmitting ? "Submitting..." : "Renegotiate"}
        </Button>
      </form>
    </ModalForm>
  )
}

export default SubmitQuoteForm
