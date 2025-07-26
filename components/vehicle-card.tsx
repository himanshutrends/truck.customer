import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Arrow } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface VehicleCardProps {
  vehicle: {
    id: string;
    name: string;
    badge?: string;
    price: string;
    vehicleType: string;
    maxWeight: string;
    model: string;
    gpsNumber: string;
    estimatedDelivery: string;
    route: {
      from: string;
      to: string;
      price: string;
    };
    weight: {
      amount: string;
      rate: string;
      total: string;
    };
    deliveryType: {
      type: string;
      price: string;
    };
    total: string;
    specs?: {
      loadCapacity: string;
      dimensions: string;
      fuelType: string;
      yearOfManufacture: string;
      kmDriven: string;
      insuranceValidity: string;
      permitType: string;
      ownership: string;
      registrationState: string;
    };
    pricing?: {
      perKm: string;
      minimumFare: string;
      driverAllowance: string;
      perHour: string;
    };
    operatingStates?: string[];
    isBookmarked?: boolean;
  };
  isSelected?: boolean;
  onSelectionChange?: (id: string, selected: boolean) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  isSelected = false,
  onSelectionChange,
}) => {
  const [isPriceBreakdownOpen, setIsPriceBreakdownOpen] = useState(false);
  const [isMoreDetailsOpen, setIsMoreDetailsOpen] = useState(false);

  const handleSelectionChange = (checked: boolean) => {
    onSelectionChange?.(vehicle.id, checked);
  };

  return (
    <Card
      className={`relative p-6 w-full transition-all duration-200 ${
        isSelected
          ? "ring-2 ring-blue-500 ring-offset-2 shadow-lg"
          : "hover:shadow-md"
      }`}
    >

      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger>
              <Checkbox
                checked={isSelected}
                onCheckedChange={handleSelectionChange}
                className="h-5 w-5"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to Cart</p>
            </TooltipContent>
          </Tooltip>

          <h3 className="text-lg font-bold ">{vehicle.name}</h3>
          {vehicle.badge && (
            <Badge className="bg-green-50 text-green-600 text-xs font-medium px-3 py-1">
              {vehicle.badge}
            </Badge>
          )}
        </div>
        <div className="text-2xl font-bold ">{vehicle.price}</div>
      </div>

      {/* Vehicle Details Section */}
      <div className="">
        <h4 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wide">
          Vehicle Details
        </h4>

        <div className="flex gap-16 items-start">
          {/* Vehicle Image */}
          <div className="flex-shrink-0 w-[203px] h-[99px] p-2">
            <div className="w-full h-full relative">
              <Image
                src="/truck_large.png"
                alt="Vehicle"
                fill
                className="object-contain"
                style={{ transform: "scaleY(-1) rotate(180deg)" }}
              />
            </div>
          </div>

          {/* Vehicle Specs Grid */}
          <div className="flex-1 grid grid-cols-5 gap-5">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Vehicle Type</p>
              <p className=" font-medium">{vehicle.vehicleType}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Vehicle Max. Weight
              </p>
              <p className=" font-medium">{vehicle.maxWeight}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Vehicle Model</p>
              <p className=" font-medium">{vehicle.model}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">GPS Number</p>
              <p className=" font-medium">{vehicle.gpsNumber}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Estd. Delivery Date
              </p>
              <p className=" font-medium">{vehicle.estimatedDelivery}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Price Breakdown Section */}
      <Collapsible
        open={isPriceBreakdownOpen}
        onOpenChange={setIsPriceBreakdownOpen}
      >
        <div className="space-y-4">
          <CollapsibleContent className="space-y-4">
            <div className="h-px bg-neutral-200"></div>
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
              Price Breakdown
            </h4>
            <div className="grid grid-cols-5 gap-5">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Route</p>
                <div className="space-y-1">
                  <p className="flex items-center font-medium">
                    {vehicle.route.from}
                    <ArrowRight className="w-3.5 h-3.5 inline-block mx-1" />
                    {vehicle.route.to}
                  </p>
                  <p className=" font-bold ">{vehicle.route.price}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Weight</p>
                <div className="space-y-1">
                  <p className=" font-medium">{vehicle.weight.amount}</p>
                  <p className=" font-bold">
                    {vehicle.weight.rate} = {vehicle.weight.total}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Delivery Type</p>
                <div className="space-y-1">
                  <p className=" font-medium">{vehicle.deliveryType.type}</p>
                  <p className=" font-bold">{vehicle.deliveryType.price}</p>
                </div>
              </div>
              <div></div> {/* Empty column for spacing */}
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className=" font-bold ">{vehicle.total}</p>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* More Details Section */}
      <Collapsible open={isMoreDetailsOpen} onOpenChange={setIsMoreDetailsOpen}>
        <CollapsibleContent className="mt-6 space-y-4">
          <div className="h-px bg-neutral-200"></div>
          <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
            Additional Details
          </h4>
          {vehicle.specs && (
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Load Capacity</p>
                <p className=" font-medium">{vehicle.specs.loadCapacity}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Dimensions</p>
                <p className=" font-medium">{vehicle.specs.dimensions}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Fuel Type</p>
                <p className=" font-medium">{vehicle.specs.fuelType}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Year of Manufacture
                </p>
                <p className=" font-medium">
                  {vehicle.specs.yearOfManufacture}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">KM Driven</p>
                <p className=" font-medium">{vehicle.specs.kmDriven}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Insurance Validity
                </p>
                <p className=" font-medium">
                  {vehicle.specs.insuranceValidity}
                </p>
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {/* More Details Trigger */}
          <Collapsible
            open={isMoreDetailsOpen}
            onOpenChange={setIsMoreDetailsOpen}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                View More Details
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isMoreDetailsOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
          </Collapsible>

          {/* Price Breakdown Trigger */}
          <Collapsible
            open={isPriceBreakdownOpen}
            onOpenChange={setIsPriceBreakdownOpen}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                {isPriceBreakdownOpen ? "Hide" : "Show"} Price Breakdown
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isPriceBreakdownOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">Negotiate Quote</Button>
          <Button>
            Book this vehicle
          </Button>
        </div>
      </div>
    </Card>
  );
};
