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
import { getVendorDriverById } from "../server/actions/driver"

interface DriverDetailProps {
  params: Promise<{
    id: string
  }>
}

export default async function DriverDetailPage({ params }: DriverDetailProps) {
  const resolvedParams = await params
  const response = await getVendorDriverById(resolvedParams.id)

  if (!response.success || !response.data) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <Card className="mx-6">
            <CardContent className="p-6">
              <h1 className="text-xl font-semibold">Driver not found</h1>
              <p className="text-muted-foreground mt-2">
                {response.error || "The driver you're looking for doesn't exist."}
              </p>
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

  const driver = response.data;

  const getStatusBadge = (isAvailable: boolean) => {
    if (isAvailable) {
      return "bg-green-50 text-green-600 border-green-200"
    } else {
      return "bg-red-50 text-red-600 border-red-200"
    }
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <Card className="mx-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Link href="/driver">
              <Button variant="outline" size="icon" className="size-8">
                <IconArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <CardTitle>Driver #{driver.id}</CardTitle>
              <Badge variant="outline" className={`px-3 py-1 ${getStatusBadge(driver.is_available)}`}>
                <IconTrendingUp className="h-3 w-3 mr-1.5" />
                {driver.is_available ? "Available" : "Unavailable"}
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
          {/* Driver Profile Image */}
          <div>
            {driver.profile_image ? (
              <Image
                src={driver.profile_image}
                alt={`Driver ${driver.name}`}
                width={120}
                height={120}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-[120px] h-[120px] rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl font-semibold text-gray-500">
                  {driver.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Driver Details */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">DRIVER DETAILS</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Driver Name</label>
                <p className="font-medium">{driver.name}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Phone Number</label>
                <p className="font-medium">{driver.phone_number}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="font-medium">{driver.email}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Experience</label>
                <p className="font-medium">{driver.experience_years} years</p>
              </div>
            </div>
          </div>

          {/* License Details */}
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">LICENSE DETAILS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">License Number</label>
                <p className="font-medium">{driver.license_number}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">License Expiry Date</label>
                <p className="font-medium">{new Date(driver.license_expiry_date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Assigned Truck Details */}
          {driver.assigned_truck_info && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">ASSIGNED TRUCK DETAILS</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Truck ID</label>
                    <p className="font-medium underline">{driver.assigned_truck_info.id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Registration Number</label>
                    <p className="font-medium">{driver.assigned_truck_info.registration_number}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Truck Type</label>
                    <p className="font-medium">{driver.assigned_truck_info.truck_type}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Capacity</label>
                    <p className="font-medium">{driver.assigned_truck_info.capacity}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Vendor Details */}
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">VENDOR DETAILS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Vendor Name</label>
                <p className="font-medium">{driver.vendor_name}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Status</label>
                <p className="font-medium">{driver.is_available ? "Available" : "Unavailable"}</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">ADDITIONAL INFORMATION</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Created At</label>
                <p className="font-medium">{new Date(driver.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Last Updated</label>
                <p className="font-medium">{new Date(driver.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
