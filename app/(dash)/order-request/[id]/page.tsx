import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  IconArrowLeft, 
  IconDots, 
  IconFileExport, 
  IconFileTypePdf,
  IconArrowUp,
  IconArrowDown
} from "@tabler/icons-react"
import Link from "next/link"
import { Check } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface OrderRequestDetailProps {
  params: {
    id: string
  }
}

interface QuoteRequest {
  id: string
  companyName: string
  status: "Renegotiated" | "Pending" | "Accepted" | "Rejected"
  quote: string
  remarks: string
}

interface OrderRequestData {
  id: string
  orderRequestNumber: string
  quotesAvailable: number
  orderDetails: {
    pickupAddress: string
    deliveryAddress: string
    pickupDate: string
    arrivalDate: string
    weight: string
    fee: string
  }
  loadAndVehicleDetails: {
    vehicleType: string
    itemTransported: string
    packageType: string
    packageDimensions: string
    packageQuantity: string
    hazardous: string
  }
  quoteRequests: QuoteRequest[]
}

// Mock data - in real app this would come from API/database
const getOrderRequestData = (id: string): OrderRequestData | null => {
  const orderRequests: Record<string, OrderRequestData> = {
    "00112233HEM": {
      id: "00112233HEM",
      orderRequestNumber: "#00112233HEM",
      quotesAvailable: 2,
      orderDetails: {
        pickupAddress: "45 Maple Street, Chinnwara, MP",
        deliveryAddress: "45 Maple Street, New Delhi, MP",
        pickupDate: "12 January 2025",
        arrivalDate: "26 January 2025",
        weight: "12 Tonnes",
        fee: "₹1,64,000"
      },
      loadAndVehicleDetails: {
        vehicleType: "-",
        itemTransported: "Aluminium",
        packageType: "Wooden Crates",
        packageDimensions: "12 x 50 x 12 cm",
        packageQuantity: "134",
        hazardous: "No"
      },
      quoteRequests: [
        {
          id: "1",
          companyName: "Mearsk Shipping",
          status: "Renegotiated",
          quote: "₹28,000",
          remarks: "-"
        },
        {
          id: "2", 
          companyName: "TechNova Solutions",
          status: "Renegotiated",
          quote: "₹1,64,000",
          remarks: "Price Breakdown 123 ... 2323"
        }
      ]
    }
  }

  return orderRequests[id] || null
}

export default function OrderRequestDetailPage({ params }: OrderRequestDetailProps) {
  const orderRequest = getOrderRequestData(params.id)
  
  if (!orderRequest) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <Card className="mx-6">
            <CardContent className="p-6">
              <h1 className="text-xl font-semibold">Order Request not found</h1>
              <p className="text-muted-foreground mt-2">The order request you're looking for doesn't exist.</p>
              <Link href="/order-request">
                <Button variant="outline" className="mt-4">
                  <IconArrowLeft className="h-4 w-4 mr-2" />
                  Back to Order Requests
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
      case "Renegotiated":
        return "bg-green-50 text-green-600 border-green-200"
      case "Accepted":
        return "bg-blue-50 text-blue-600 border-blue-200"
      case "Pending":
        return "bg-orange-50 text-orange-600 border-orange-200"
      case "Rejected":
        return "bg-red-50 text-red-600 border-red-200"
      default:
        return "bg-gray-50 text-gray-600 border-gray-200"
    }
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <Card className="mx-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Link href="/order-request">
              <Button variant="outline" size="icon" className="size-8">
                <IconArrowLeft />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <CardTitle>Order Request {orderRequest.orderRequestNumber}</CardTitle>
              <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-blue-600 border-blue-200">
                {orderRequest.quotesAvailable} Quotes Available
              </Badge>
            </div>
          </div>
          <CardAction className="flex items-center gap-2">
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
          {/* Order Details */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">ORDER DETAILS</h3>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Pickup Address</label>
                <p className="font-medium">{orderRequest.orderDetails.pickupAddress}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Delivery Address</label>
                <p className="font-medium">{orderRequest.orderDetails.deliveryAddress}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Pickup Date</label>
                <p className="font-medium">{orderRequest.orderDetails.pickupDate}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Arrival Date</label>
                <p className="font-medium">{orderRequest.orderDetails.arrivalDate}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Weight</label>
                <p className="font-medium">{orderRequest.orderDetails.weight}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Fee</label>
                <p className="font-medium">{orderRequest.orderDetails.fee}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Load and Vehicle Details */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">LOAD AND VEHICLE DETAILS</h3>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Vehicle Type</label>
                <p className="font-medium">{orderRequest.loadAndVehicleDetails.vehicleType}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Item Transported</label>
                <p className="font-medium">{orderRequest.loadAndVehicleDetails.itemTransported}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Package Type</label>
                <p className="font-medium">{orderRequest.loadAndVehicleDetails.packageType}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Package Dimensions</label>
                <p className="font-medium">{orderRequest.loadAndVehicleDetails.packageDimensions}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Package Quantity</label>
                <p className="font-medium">{orderRequest.loadAndVehicleDetails.packageQuantity}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Hazardous?</label>
                <p className="font-medium">{orderRequest.loadAndVehicleDetails.hazardous}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Quote Requests Table */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">QUOTE REQUESTS</h3>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/10">
                    <TableHead className="w-12">
                      <Checkbox
                          className="h-4 w-4"
                        />
                    </TableHead>
                    <TableHead className="font-medium text-muted-foreground">
                      <div className="flex items-center gap-1">
                        COMPANY NAME
                        <IconArrowUp className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="font-medium text-muted-foreground">
                      <div className="flex items-center gap-1">
                        QUOTE
                        <IconArrowUp className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="font-medium text-muted-foreground">
                      <div className="flex items-center gap-1">
                        REMARKS
                        <IconArrowUp className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderRequest.quoteRequests.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell>
                        <Checkbox
                          className="h-4 w-4"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{quote.companyName}</span>
                          <Badge variant="outline" className={`px-2 py-1 text-xs ${getStatusBadge(quote.status)}`}>
                            {quote.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{quote.quote}</TableCell>
                      <TableCell className="text-muted-foreground">{quote.remarks}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <IconDots className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
