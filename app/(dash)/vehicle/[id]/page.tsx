import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  IconArrowLeft, 
  IconDots, 
  IconFileExport, 
  IconFileTypePdf, 
  IconMapPin,
  IconTrendingUp 
} from "@tabler/icons-react"
import Link from "next/link"
import Image from "next/image"

interface VehicleDetailProps {
  params: {
    id: string
  }
}

// Mock data - in real app this would come from API/database
const getVehicleData = (id: string) => {
  const vehicles = {
    "MH05R6788": {
      id: "MH05R6788",
      vehicleNumber: "MH05R6788",
      type: "Heavy Truck",
      yearPurchased: "1999",
      gpsNumber: "#33HEM 56",
      model: "Mercedes FreightMaster X2000",
      maxWeight: "80 tonnes",
      maxCapacity: "80 cubic meters",
      status: "Shipping" as const,
      currentOrder: {
        orderNumber: "#00112233HEM",
        pickupAddress: "45 Maple Street, Chinnwara, MP",
        deliveryAddress: "45 Maple Street, New Delhi, MP",
        pickupDate: "12 January 2025",
        estDeliveryDate: "26 January 2025",
        driverAssigned: "Raghav Singh"
      },
      attachedDocuments: [
        { name: "registration-details", type: "pdf" },
        { name: "pollution-regulations", type: "pdf" }
      ]
    },
    "MH04A1234": {
      id: "MH04A1234",
      vehicleNumber: "MH04A1234",
      type: "Light Truck",
      yearPurchased: "2018",
      gpsNumber: "#44ABC 12",
      model: "Tata Ace Gold",
      maxWeight: "740 kg",
      maxCapacity: "12 cubic meters",
      status: "Available" as const,
      currentOrder: null,
      attachedDocuments: [
        { name: "registration-details", type: "pdf" },
        { name: "pollution-regulations", type: "pdf" }
      ]
    },
    "MH07B4567": {
      id: "MH07B4567",
      vehicleNumber: "MH07B4567",
      type: "Light Truck",
      yearPurchased: "2020",
      gpsNumber: "#77XYZ 89",
      model: "Mahindra Bolero Pickup",
      maxWeight: "120 tonnes",
      maxCapacity: "15 cubic meters",
      status: "Shipping" as const,
      currentOrder: {
        orderNumber: "#00112233QWE",
        pickupAddress: "23 Industrial Area, Guwahati, Assam",
        deliveryAddress: "56 Market Street, Chandigarh",
        pickupDate: "15 January 2025",
        estDeliveryDate: "22 January 2025",
        driverAssigned: "Carlos Ramirez"
      },
      attachedDocuments: [
        { name: "registration-details", type: "pdf" },
        { name: "pollution-regulations", type: "pdf" }
      ]
    },
    "MH09C8901": {
      id: "MH09C8901",
      vehicleNumber: "MH09C8901",
      type: "Heavy Truck",
      yearPurchased: "2019",
      gpsNumber: "#99DEF 45",
      model: "Ashok Leyland Dost",
      maxWeight: "60 tonnes",
      maxCapacity: "75 cubic meters",
      status: "Shipping" as const,
      currentOrder: {
        orderNumber: "#00112233UIK",
        pickupAddress: "12 Port Road, Pune, Maharashtra",
        deliveryAddress: "78 Central Avenue, Mumbai",
        pickupDate: "18 January 2025",
        estDeliveryDate: "25 January 2025",
        driverAssigned: "Sofia Chen"
      },
      attachedDocuments: [
        { name: "registration-details", type: "pdf" },
        { name: "pollution-regulations", type: "pdf" }
      ]
    },
    "MH02D2345": {
      id: "MH02D2345",
      vehicleNumber: "MH02D2345",
      type: "Heavy Truck",
      yearPurchased: "2017",
      gpsNumber: "#22GHI 67",
      model: "Eicher Pro 2049",
      maxWeight: "90 tonnes",
      maxCapacity: "85 cubic meters",
      status: "Unavailable" as const,
      currentOrder: null,
      attachedDocuments: [
        { name: "registration-details", type: "pdf" },
        { name: "pollution-regulations", type: "pdf" }
      ]
    },
  }
  
  return vehicles[id as keyof typeof vehicles] || null
}

export default function VehicleDetailPage({ params }: VehicleDetailProps) {
  const vehicle = getVehicleData(params.id)
  
  if (!vehicle) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <Card className="mx-6">
            <CardContent className="p-6">
              <h1 className="text-xl font-semibold">Vehicle not found</h1>
              <p className="text-muted-foreground mt-2">The vehicle you're looking for doesn't exist.</p>
              <Link href="/vehicle">
                <Button variant="outline" className="mt-4">
                  <IconArrowLeft className="h-4 w-4 mr-2" />
                  Back to Vehicles
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-50 text-green-600 border-green-200"
      case "Unavailable":
        return "bg-red-50 text-red-600 border-red-200"
      case "Shipping":
        return "bg-blue-50 text-blue-600 border-blue-200"
      default:
        return "bg-gray-50 text-gray-600 border-gray-200"
    }
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <Card className="mx-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Link href="/vehicle">
              <Button variant="outline" size="icon" className="size-8">
                <IconArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <CardTitle>Vehicle #{vehicle.vehicleNumber}</CardTitle>
              <Badge variant="outline" className={`px-3 py-1 ${getStatusBadge(vehicle.status)}`}>
                <IconTrendingUp className="h-3 w-3 mr-1.5" />
                {vehicle.status === "Shipping" ? "Shipping on Order" : vehicle.status}
              </Badge>
            </div>
          </div>
          <CardAction className="flex items-center gap-2">
            <Button variant="default" size="sm">
              <IconMapPin className="h-4 w-4 " />
              Track
            </Button>
            <Button variant="outline" size="sm">
              <IconFileExport className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="icon" className="size-8">
              <IconDots className="h-4 w-4" />
            </Button>
          </CardAction>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Vehicle Image */}
            <Image
              src="/truck_large.png"
              alt={`Vehicle ${vehicle.vehicleNumber}`}
              width={200}
              height={150}
              className="rounded-lg object-cover"
            />


          {/* Vehicle Details */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">VEHICLE DETAILS</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Vehicle Type</label>
                <p className="font-medium">{vehicle.type}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Vehicle Number</label>
                <p className="font-medium">{vehicle.vehicleNumber}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Year Purchased</label>
                <p className="font-medium">{vehicle.yearPurchased}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">GPS Number</label>
                <p className="font-medium">{vehicle.gpsNumber}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Vehicle Model</label>
                <p className="font-medium">{vehicle.model}</p>
              </div>
            
              <div>
                <label className="text-sm text-muted-foreground">Vehicle Max. Weight</label>
                <p className="font-medium">{vehicle.maxWeight}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Vehicle Max. Capacity</label>
                <p className="font-medium">{vehicle.maxCapacity}</p>
              </div>
              </div>
          </div>

          {/* Current Order Details */}
          {vehicle.currentOrder && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">CURRENT ORDER DETAILS</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground ">Order Number</label>
                    <p className="font-medium underline">{vehicle.currentOrder.orderNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Pickup Address</label>
                    <p className="font-medium">{vehicle.currentOrder.pickupAddress}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Delivery Address</label>
                    <p className="font-medium">{vehicle.currentOrder.deliveryAddress}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Pickup Date</label>
                    <p className="font-medium">{vehicle.currentOrder.pickupDate}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Estd. Delivery Date</label>
                    <p className="font-medium">{vehicle.currentOrder.estDeliveryDate}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Driver Assigned</label>
                    <p className="font-medium">{vehicle.currentOrder.driverAssigned}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Attached Documents */}
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">ATTACHED DOCUMENTS</h3>
            <div className="flex gap-4">
              {vehicle.attachedDocuments.map((doc, index) => (
                <Button key={index} variant="outline" size="sm" className="flex items-center gap-2">
                  <IconFileTypePdf className="h-4 w-4 text-red-500" />
                  {doc.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
