"use client"

import * as React from "react"
import { format } from "date-fns"
import { 
  IconMapPin, 
  IconCalendar,
  IconInfoCircle,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface AddOrderRequestFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function AddOrderRequestForm({ onSubmit, onCancel }: AddOrderRequestFormProps) {
  const [formData, setFormData] = React.useState({
    originPinCode: "",
    destinationPinCode: "",
    pickupDate: undefined as Date | undefined,
    arrivalDate: undefined as Date | undefined,
    weight: "",
    weightUnit: "Tonnes",
    fee: "",
    feeUnit: "Rupees",
    vehicleType: "",
    itemTransported: "",
    packageType: "",
    packageDimension: "",
    packageDimensionUnit: "cm",
    packageQuantity: "",
    hasHazardousMaterials: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Format the data for submission
    const submitData = {
      ...formData,
      pickup_date: formData.pickupDate ? format(formData.pickupDate, "dd MMM yyyy") : "",
      arrival_date: formData.arrivalDate ? format(formData.arrivalDate, "dd MMM yyyy") : "",
      pickup_location: "Origin Location", // You might want to add these fields to the form
      destination: "Destination Location",
      price: formData.fee,
      vehicle_type: formData.vehicleType,
      weight: formData.weight ? `${formData.weight} ${formData.weightUnit}` : ""
    }
    
    onSubmit(submitData)
  }

  return (
    <div className="max-w-2xl mx-auto bg-white">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Details Section */}
        <div>
          <h3 className="text-sm font-medium mb-2">ORDER DETAILS</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Please provide the order's essential details, including the route, pickup and arrival dates and weight being transported
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="originPinCode">Origin Pin Code*</Label>
              <div className="relative">
                <IconMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="originPinCode"
                  placeholder="Enter Destination"
                  className="pl-10"
                  value={formData.originPinCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, originPinCode: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destinationPinCode">Destination Pin Code*</Label>
              <div className="relative">
                <IconMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="destinationPinCode"
                  placeholder="Enter Destination"
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
                      !formData.pickupDate && "text-muted-foreground"
                    )}
                  >
                    <IconCalendar className="h-4 w-4 text-muted-foreground" />
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
              <Label htmlFor="arrivalDate">Arrival Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal pl-10",
                      !formData.arrivalDate && "text-muted-foreground"
                    )}
                  >
                    <IconCalendar className="h-4 w-4 text-muted-foreground" />
                    {formData.arrivalDate ? (
                      format(formData.arrivalDate, "dd MMM yyyy")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.arrivalDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, arrivalDate: date }))}
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
                  <SelectTrigger className="w-28 rounded-l-none border-l-0 bg-primary/10">
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
              <Label htmlFor="fee">Fee</Label>
              <div className="flex">
                <Input
                  id="fee"
                  placeholder="e.g. 28,000"
                  value={formData.fee}
                  onChange={(e) => setFormData(prev => ({ ...prev, fee: e.target.value }))}
                  className="rounded-r-none"
                />
                <Select value={formData.feeUnit} onValueChange={(value) => setFormData(prev => ({ ...prev, feeUnit: value }))}>
                  <SelectTrigger className="w-28 rounded-l-none border-l-0 bg-primary/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rupees">Rupees</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Load and Vehicle Details Section */}
        <div>
          <h3 className="text-sm font-medium mb-2">LOAD AND VEHICLE DETAILS</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Please provide the order's essential details, including the route, pickup and arrival dates and weight being transported
          </p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select value={formData.vehicleType} onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleType: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="MH05R6788" />

                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MH05R6788">MH05R6788</SelectItem>
                  <SelectItem value="TATA-ACE">TATA Ace</SelectItem>
                  <SelectItem value="ASHOK-LEYLAND">Ashok Leyland</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemTransported">Item Transported</Label>
                <Select value={formData.itemTransported} onValueChange={(value) => setFormData(prev => ({ ...prev, itemTransported: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Aluminium" />
  
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aluminium">Aluminium</SelectItem>
                    <SelectItem value="Steel">Steel</SelectItem>
                    <SelectItem value="Wood">Wood</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="packageType">Package Type</Label>
                <Select value={formData.packageType} onValueChange={(value) => setFormData(prev => ({ ...prev, packageType: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Wooden Crate" />
  
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wooden Crate">Wooden Crate</SelectItem>
                    <SelectItem value="Cardboard Box">Cardboard Box</SelectItem>
                    <SelectItem value="Metal Container">Metal Container</SelectItem>
                    <SelectItem value="Plastic Crate">Plastic Crate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="packageDimension">Package Dimension</Label>
                <div className="flex">
                  <Input
                    id="packageDimension"
                    placeholder="Len | Br | Ht"
                    value={formData.packageDimension}
                    onChange={(e) => setFormData(prev => ({ ...prev, packageDimension: e.target.value }))}
                    className="rounded-r-none"
                  />
                  <Select value={formData.packageDimensionUnit} onValueChange={(value) => setFormData(prev => ({ ...prev, packageDimensionUnit: value }))}>
                    <SelectTrigger className="w-20 rounded-l-none border-l-0 bg-primary/10">
                      <SelectValue />
    
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cm">cm</SelectItem>
                      <SelectItem value="m">m</SelectItem>
                      <SelectItem value="ft">ft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="packageQuantity" className="flex items-center gap-2">
                  Package Quantity
                  <IconInfoCircle className="h-4 w-4 text-muted-foreground" />
                </Label>
                <Input
                  id="packageQuantity"
                  placeholder="24"
                  value={formData.packageQuantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, packageQuantity: e.target.value }))}
                />
              </div>
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

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
            Search for order
          </Button>
          <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
            Create Order Request
          </Button>
        </div>
      </form>
    </div>
  )
}
