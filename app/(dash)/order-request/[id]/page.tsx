import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  IconArrowLeft, 
  IconDots, 
  IconFileExport,
  IconArrowUp
} from "@tabler/icons-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { getOrderRequestById } from "./server/actions/order-request-detail"
import { QuotationActions } from "./components/quotation-actions"

interface OrderRequestDetailProps {
  params: {
    id: string
  }
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch {
    return dateString;
  }
}

// Helper function to format currency
const formatCurrency = (amount: string): string => {
  try {
    const numAmount = parseFloat(amount);
    return `₹${numAmount.toLocaleString('en-IN')}`;
  } catch {
    return amount;
  }
}

export default async function OrderRequestDetailPage({ params }: OrderRequestDetailProps) {
  const response = await getOrderRequestById(params.id)
  
  if (!response.success || !response.data) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <Card className="mx-6">
            <CardContent className="p-6">
              <h1 className="text-xl font-semibold">Order Request not found</h1>
              <p className="text-muted-foreground mt-2">The order request you&apos;re looking for doesn&apos;t exist.</p>
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

  const { order_request: orderRequest, quotations } = response.data

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "renegotiated":
      case "accepted":
        return "bg-green-50 text-green-600 border-green-200"
      case "pending":
        return "bg-orange-50 text-orange-600 border-orange-200"
      case "rejected":
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
              <CardTitle>Order Request #{orderRequest.id}</CardTitle>
              <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-blue-600 border-blue-200">
                {quotations.length} Quotes Available
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
                <p className="font-medium">{orderRequest.origin_city}, {orderRequest.origin_pincode}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Delivery Address</label>
                <p className="font-medium">{orderRequest.destination_city}, {orderRequest.destination_pincode}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Pickup Date</label>
                <p className="font-medium">{formatDate(orderRequest.pickup_date)}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Drop Date</label>
                <p className="font-medium">{formatDate(orderRequest.drop_date)}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Weight</label>
                <p className="font-medium">{orderRequest.weight} {orderRequest.weight_unit}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Status</label>
                <p className="font-medium capitalize">{orderRequest.status}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Load and Vehicle Details */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">ADDITIONAL DETAILS</h3>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Urgency Level</label>
                <p className="font-medium capitalize">{orderRequest.urgency_level}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Created At</label>
                <p className="font-medium">{formatDate(orderRequest.created_at)}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Updated At</label>
                <p className="font-medium">{formatDate(orderRequest.updated_at)}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">-</label>
                <p className="font-medium">-</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">-</label>
                <p className="font-medium">-</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">-</label>
                <p className="font-medium">-</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Quote Requests Table */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">QUOTATIONS</h3>
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
                        VENDOR NAME
                        <IconArrowUp className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="font-medium text-muted-foreground">
                      <div className="flex items-center gap-1">
                        VEHICLE
                        <IconArrowUp className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="font-medium text-muted-foreground">
                      <div className="flex items-center gap-1">
                        TOTAL AMOUNT
                        <IconArrowUp className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="font-medium text-muted-foreground">
                      <div className="flex items-center gap-1">
                        STATUS
                        <IconArrowUp className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotations.map((quotation) => (
                    <TableRow key={quotation.id}>
                      <TableCell>
                        <Checkbox
                          className="h-4 w-4"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{quotation.vendor_name}</span>
                          <span className="text-xs text-muted-foreground">ID: {quotation.frontend_vendor_id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{quotation.items.vehicle_model}</span>
                          <span className="text-xs text-muted-foreground">{quotation.items.vehicle_type}</span>
                          <span className="text-xs text-muted-foreground">GPS: {quotation.items.gps_number}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{formatCurrency(quotation.total_amount)}</span>
                          <span className="text-xs text-muted-foreground">Base: {formatCurrency(quotation.base_price)}</span>
                          <span className="text-xs text-muted-foreground">Delivery: {quotation.items.estimated_delivery}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`px-2 py-1 text-xs ${getStatusBadge(quotation.status)}`}>
                          {quotation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <QuotationActions 
                          quotationId={quotation.id} 
                          currentStatus={quotation.status}
                        />
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