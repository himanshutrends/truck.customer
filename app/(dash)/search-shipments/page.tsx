"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  IconSearch,
  IconMapPin,
  IconCalendar,
  IconTruck,
  IconAdjustmentsFilled,
  IconChevronDown,
  IconTicket,
  IconCalendarWeek,
  IconMapPinSearch
} from "@tabler/icons-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { ShipmentCard, mockShipments } from "./shipment-card"
import type { ShipmentData } from "./shipment-card"

// Extended mock data for search and filtering
const extendedShipments: ShipmentData[] = [
  ...mockShipments,
  {
    id: "4",
    companyName: "DHL Express", 
    fee: "₹1,64,000",
    pickupAddress: "123 Oak Avenue, Bangalore, KA",
    weight: "8 Tonnes",
    deliveryAddress: "789 Pine Street, Mumbai, MH",
    pickupDate: "15 January 2025",
    vehicleType: "-"
  },
  {
    id: "5",
    companyName: "FedEx Logistics",
    fee: "₹1,20,000", 
    pickupAddress: "234 Birch Road, Pune, MH",
    weight: "10 Tonnes",
    deliveryAddress: "456 Cedar Lane, Chennai, TN",
    pickupDate: "26 June 2025", // Matches default selected date
    vehicleType: "-"
  },
  {
    id: "6",
    companyName: "Blue Dart Courier",
    fee: "₹90,000",
    pickupAddress: "789 Maple Drive, Kolkata, WB", 
    weight: "6 Tonnes",
    deliveryAddress: "321 Oak Street, Delhi, DL",
    pickupDate: "26 June 2025", // Matches default selected date
    vehicleType: "Container Truck"
  }
]

const truckTypes = [
  { value: "all", label: "All Truck Types", icon: IconTruck },
  { value: "container", label: "Container Truck", icon: IconTruck },
  { value: "heavy", label: "Heavy Truck", icon: IconTruck },
  { value: "light", label: "Light Vehicle", icon: IconTruck },
  { value: "trailer", label: "Trailer", icon: IconTruck }
]

const locations = [
  "All Locations",
  "New Delhi - Chinnwara",
  "Mumbai - Bangalore", 
  "Pune - Chennai",
  "Kolkata - Delhi",
  "Ahmedabad - Mumbai"
]

export default function SearchShipmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined) // No default date
  const [dateOpen, setDateOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState("All Locations") // Default to "All Locations"
  const [selectedTruckType, setSelectedTruckType] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // Filter shipments based on search criteria
  const filteredShipments = useMemo(() => {
    return extendedShipments.filter(shipment => {
      // Search filter - only apply if search term is entered
      const matchesSearch = searchTerm === "" || 
        shipment.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase())

      // Truck type filter - only apply if specific type is selected
      const matchesTruckType = selectedTruckType === "all" || 
        shipment.vehicleType.toLowerCase().includes(selectedTruckType.toLowerCase())

      // Location filter - only apply if specific location is selected
      const matchesLocation = selectedLocation === "All Locations" ||
        (shipment.pickupAddress + " - " + shipment.deliveryAddress).includes(selectedLocation.split(" - ")[0]) ||
        (shipment.pickupAddress + " - " + shipment.deliveryAddress).includes(selectedLocation.split(" - ")[1])

      // Date filter - only apply if a date is actually selected
      const matchesDate = !selectedDate || 
        shipment.pickupDate === format(selectedDate, "d MMMM yyyy")

      return matchesSearch && matchesTruckType && matchesLocation && matchesDate
    })
  }, [searchTerm, selectedTruckType, selectedLocation, selectedDate])

  const handleBid = (shipmentId: string) => {
    console.log("Bid clicked for shipment:", shipmentId)
    // Implement bid logic
  }

  const handleQuote = (shipmentId: string) => {
    console.log("Quote clicked for shipment:", shipmentId)
    // Implement quote logic
  }

  const handleMore = (shipmentId: string) => {
    console.log("More options clicked for shipment:", shipmentId)
    // Implement more options logic
  }

  const getButtonType = (shipment: ShipmentData): "bid" | "quote" => {
    // Logic to determine button type based on shipment data
    // For demo purposes, alternating between bid and quote
    return parseInt(shipment.id) % 2 === 0 ? "quote" : "bid"
  }

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center rounded-lg bg-primary/10 p-2">
            <IconMapPinSearch className="size-8 text-primary" />
          </div>
          <h1 className="text-lg font-medium">Search Shipments</h1>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              className="h-8     w-[200px] pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Location Selector */}
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="h-8    w-fit">
              <div className="flex items-center gap-2">
                <IconMapPin className="h-4 w-4 text-muted-foreground" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {locations.map(location => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Picker */}
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-8 w-fit font-normal"
              >
                <IconCalendarWeek className="h-4 w-4 text-muted-foreground" />
                {selectedDate ? format(selectedDate, "d MMMM yyyy") : "Select date"}
                <IconChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setSelectedDate(date)
                  setDateOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>

          {/* Truck Type Selector */}
          <Select value={selectedTruckType} onValueChange={setSelectedTruckType}>
            <SelectTrigger className="max-h-8 w-fit">
              <div className="flex items-center gap-2">
                <SelectValue placeholder="Truck Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {truckTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <type.icon className="h-4 w-4" />
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filter Button */}
          <Button 
            variant="outline" 
            size="sm"
            className="h-8"
            onClick={() => setShowFilters(!showFilters)}
          >
            <IconAdjustmentsFilled className="h-4 w-4 text-muted-foreground" />
            <span>Filter</span>
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {(searchTerm || selectedLocation !== "All Locations" || selectedTruckType !== "all" || selectedDate) && (
        <div className="flex items-center gap-2 px-4 lg:px-6">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchTerm}
              <button onClick={() => setSearchTerm("")}>×</button>
            </Badge>
          )}
          {selectedLocation !== "All Locations" && (
            <Badge variant="secondary" className="gap-1">
              {selectedLocation}
              <button onClick={() => setSelectedLocation("All Locations")}>×</button>
            </Badge>
          )}
          {selectedTruckType !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {truckTypes.find(t => t.value === selectedTruckType)?.label}
              <button onClick={() => setSelectedTruckType("all")}>×</button>
            </Badge>
          )}
          {selectedDate && (
            <Badge variant="secondary" className="gap-1">
              {format(selectedDate, "d MMMM yyyy")}
              <button onClick={() => setSelectedDate(undefined)}>×</button>
            </Badge>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="px-4 lg:px-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredShipments.length} shipments
        </p>
      </div>

      {/* Shipments Grid */}
      <div className="px-4 lg:px-6">
        <div className="space-y-4">
          {filteredShipments.length > 0 ? (
            filteredShipments.map(shipment => (
              <ShipmentCard
                key={shipment.id}
                shipment={shipment}
                buttonType={getButtonType(shipment)}
                onBidClick={handleBid}
                onQuoteClick={handleQuote}
                onMoreClick={handleMore}
              />
            ))
          ) : (
            <Card className="w-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <IconSearch className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  No shipments found
                </h3>
                <p className="text-sm text-muted-foreground text-center">
                  Try adjusting your search criteria or filters to find more shipments.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
