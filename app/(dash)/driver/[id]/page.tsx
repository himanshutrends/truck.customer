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

interface DriverDetailProps {
  params: {
    id: string
  }
}

// Mock data - in real app this would come from API/database
const getDriverData = (id: string) => {
  const drivers = {
    "ID050": {
      id: "ID050",
      driverName: "Raghav Singh",
      dateOfBirth: "7 July 1999",
      phoneNumber: "+91 45564 33443",
      aadhaarNumber: "4554 4552 2121 1120",
      status: "Shipping on Order" as const,
      currentOrder: {
        orderNumber: "#00112233HEM",
        vehicleNumber: "MH05R6788",
        pickupAddress: "45 Maple Street, Chinnwara, MP",
        deliveryAddress: "45 Maple Street, New Delhi, MP",
        estDeliveryDate: "26 January 2025"
      },
      attachedDocuments: [
        { name: "aadhaar card", type: "pdf" },
        { name: "drivers licence", type: "pdf" }
      ]
    },
    "ID051": {
      id: "ID051",
      driverName: "Ayesha Patel",
      dateOfBirth: "15 March 1985",
      phoneNumber: "+91 89975 78614",
      aadhaarNumber: "1234 5678 9012 3456",
      status: "Available" as const,
      currentOrder: null,
      attachedDocuments: [
        { name: "aadhaar card", type: "pdf" },
        { name: "drivers licence", type: "pdf" }
      ]
    },
    "ID052": {
      id: "ID052",
      driverName: "Carlos Ramirez",
      dateOfBirth: "22 September 1990",
      phoneNumber: "+91 12345 67890",
      aadhaarNumber: "9876 5432 1098 7654",
      status: "Shipping on Order" as const,
      currentOrder: {
        orderNumber: "#00112233QWE",
        vehicleNumber: "MH07B4567",
        pickupAddress: "23 Industrial Area, Guwahati, Assam",
        deliveryAddress: "56 Market Street, Chandigarh",
        estDeliveryDate: "22 January 2025"
      },
      attachedDocuments: [
        { name: "aadhaar card", type: "pdf" },
        { name: "drivers licence", type: "pdf" }
      ]
    },
    "ID053": {
      id: "ID053",
      driverName: "Sofia Chen",
      dateOfBirth: "8 December 1988",
      phoneNumber: "+91 98765 43210",
      aadhaarNumber: "5678 1234 9876 5432",
      status: "On Leave" as const,
      currentOrder: null,
      attachedDocuments: [
        { name: "aadhaar card", type: "pdf" },
        { name: "drivers licence", type: "pdf" }
      ]
    },
    "ID054": {
      id: "ID054",
      driverName: "Liam Johnson",
      dateOfBirth: "30 June 1992",
      phoneNumber: "+91 55443 22112",
      aadhaarNumber: "3456 7890 1234 5678",
      status: "Available" as const,
      currentOrder: null,
      attachedDocuments: [
        { name: "aadhaar card", type: "pdf" },
        { name: "drivers licence", type: "pdf" }
      ]
    },
  }
  
  return drivers[id as keyof typeof drivers] || null
}

export default function DriverDetailPage({ params }: DriverDetailProps) {
  const driver = getDriverData(params.id)
  
  if (!driver) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <Card className="mx-6">
            <CardContent className="p-6">
              <h1 className="text-xl font-semibold">Driver not found</h1>
              <p className="text-muted-foreground mt-2">The driver you're looking for doesn't exist.</p>
              <Link href="/driver">
                <Button variant="outline" className="mt-4">
                  <IconArrowLeft className="h-4 w-4 mr-2" />
                  Back to Drivers
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
      case "On Leave":
        return "bg-orange-50 text-orange-600 border-orange-200"
      case "Shipping on Order":
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
            <Link href="/driver">
              <Button variant="outline" size="icon" className="size-8">
                <IconArrowLeft />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <CardTitle>Driver #{driver.id}</CardTitle>
              <Badge variant="outline" className={`px-3 py-1 ${getStatusBadge(driver.status)}`}>
                <IconTrendingUp className="h-3 w-3 mr-1.5" />
                {driver.status}
              </Badge>
            </div>
          </div>
          <CardAction className="flex items-center gap-2">
            <Button variant="default" size="sm">
              <IconMapPin className="h-4 w-4" />
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
          {/* Driver Details */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">DRIVER DETAILS</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Driver Name</label>
                <p className="font-medium">{driver.driverName}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Date of Birth</label>
                <p className="font-medium">{driver.dateOfBirth}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Phone Number</label>
                <p className="font-medium">{driver.phoneNumber}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Aadhaar Number</label>
                <p className="font-medium">{driver.aadhaarNumber}</p>
              </div>
            </div>
          </div>

          {/* Current Order Details */}
          {driver.currentOrder && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">CURRENT ORDER DETAILS</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Order Number</label>
                    <p className="font-medium underline">{driver.currentOrder.orderNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Vehicle Number</label>
                    <p className="font-medium underline">{driver.currentOrder.vehicleNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Pickup Address</label>
                    <p className="font-medium">{driver.currentOrder.pickupAddress}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Delivery Address</label>
                    <p className="font-medium">{driver.currentOrder.deliveryAddress}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Estd. Delivery Date</label>
                    <p className="font-medium">{driver.currentOrder.estDeliveryDate}</p>
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
              {driver.attachedDocuments.map((doc, index) => (
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
