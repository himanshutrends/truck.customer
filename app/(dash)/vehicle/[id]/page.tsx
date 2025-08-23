import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  IconArrowLeft, 
  IconDots, 
  IconFileExport, 
  IconMapPin,
  IconTrendingUp 
} from "@tabler/icons-react"
import Link from "next/link"
import Image from "next/image"
import { getVendorTruckById } from "../server/actions/vehicle"

interface VehicleDetailProps {
  params: {
    id: string
  }
}

export default async function VehicleDetailPage({ params }: VehicleDetailProps) {
  const response = await getVendorTruckById(params.id);

  if (!response.success || !response.data) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <Card className="mx-6">
            <CardContent className="p-6">
              <h1 className="text-xl font-semibold">Vehicle not found</h1>
              <p className="text-muted-foreground mt-2">
                {response.error || "The vehicle you're looking for doesn't exist."}
              </p>
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

  const vehicle = response.data;

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-50 text-green-600 border-green-200"
      case "unavailable":
        return "bg-red-50 text-red-600 border-red-200"
      case "shipping":
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
              <CardTitle>Vehicle #{vehicle.registration_number}</CardTitle>
              <Badge variant="outline" className={`px-3 py-1 ${getStatusBadge(vehicle.availability_status)}`}>
                <IconTrendingUp className="h-3 w-3 mr-1.5" />
                {vehicle.availability_status}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Vehicle Image */}
          <div>
            {vehicle.images && vehicle.images.length > 0 ? (
              <Image
                src={vehicle.images[0]}
                alt={`Vehicle ${vehicle.registration_number}`}
                width={200}
                height={150}
                className="rounded-lg object-cover"
              />
            ) : (
              <Image
                src="/truck_large.png"
                alt={`Vehicle ${vehicle.registration_number}`}
                width={200}
                height={150}
                className="rounded-lg object-cover"
              />
            )}
          </div>

          {/* Vehicle Details */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">VEHICLE DETAILS</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Vehicle Type</label>
                <p className="font-medium">{vehicle.truck_type?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Registration Number</label>
                <p className="font-medium">{vehicle.registration_number}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Year</label>
                <p className="font-medium">{vehicle.year}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Make & Model</label>
                <p className="font-medium">{vehicle.make} {vehicle.model}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Color</label>
                <p className="font-medium">{vehicle.color}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Capacity</label>
                <p className="font-medium">{vehicle.capacity}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Price per KM</label>
                <p className="font-medium">₹{vehicle.base_price_per_km}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Status</label>
                <p className="font-medium">{vehicle.is_active ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">CURRENT LOCATION</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm text-muted-foreground">Address</label>
                <p className="font-medium">{vehicle.current_location_address || 'Location not available'}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Coordinates</label>
                <p className="font-medium">
                  {vehicle.current_location_latitude && vehicle.current_location_longitude
                    ? `${vehicle.current_location_latitude}, ${vehicle.current_location_longitude}`
                    : 'Not available'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Vendor Details */}
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">VENDOR DETAILS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Vendor Name</label>
                <p className="font-medium">{vehicle.vendor_name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Vendor Phone</label>
                <p className="font-medium">{vehicle.vendor_phone || 'N/A'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
