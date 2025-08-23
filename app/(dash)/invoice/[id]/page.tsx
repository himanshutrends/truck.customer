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

interface InvoiceDetailProps {
  params: Promise<{
    id: string
  }>
}

// Mock data - in real app this would come from API/database
const getInvoiceData = (id: string) => {
  const invoices = {
    "12344": {
      id: "12344",
      invoiceNumber: "12344 HNE",
      status: "Shipping an Order" as const,
      vehicleDetails: {
        driverName: "Raj Pratap Singh",
        dateOfBirth: "20 July 1990",
        phoneNumber: "+91 98765 43210",
        aadhaarNumber: "1234 5678 9012",
      },
      currentOrder: {
        orderNumber: "11334 CDE",
        vehicleNumber: "GJ 27 AB 1234",
        pickupAddress: "Ahmedabad, Gujarat",
        deliveryAddress: "Mumbai, Maharashtra",
        estDeliveryDate: "20 Nov 2024"
      },
      attachedDocuments: [
        { name: "vehicle-license.pdf", type: "pdf" },
        { name: "driver-license.pdf", type: "pdf" },
        { name: "insurance.pdf", type: "pdf" },
        { name: "pollution-certificate.pdf", type: "pdf" }
      ]
    },
    "12345": {
      id: "12345",
      invoiceNumber: "12345 TKN",
      status: "Completed" as const,
      vehicleDetails: {
        driverName: "Ayesha Patel",
        dateOfBirth: "15 March 1985",
        phoneNumber: "+91 89975 78614",
        aadhaarNumber: "2345 6789 0123",
      },
      currentOrder: {
        orderNumber: "22445 DEF",
        vehicleNumber: "MH 12 CD 5678",
        pickupAddress: "Pune, Maharashtra",
        deliveryAddress: "Bangalore, Karnataka",
        estDeliveryDate: "22 Nov 2024"
      },
      attachedDocuments: [
        { name: "invoice.pdf", type: "pdf" },
        { name: "delivery-receipt.pdf", type: "pdf" }
      ]
    },
    "12346": {
      id: "12346",
      invoiceNumber: "12346 XYZ",
      status: "Advance Paid" as const,
      vehicleDetails: {
        driverName: "Carlos Ramirez",
        dateOfBirth: "22 September 1990",
        phoneNumber: "+91 12345 67890",
        aadhaarNumber: "3456 7890 1234",
      },
      currentOrder: {
        orderNumber: "33556 GHI",
        vehicleNumber: "DL 8C AB 9012",
        pickupAddress: "Delhi, Delhi",
        deliveryAddress: "Jaipur, Rajasthan",
        estDeliveryDate: "25 Nov 2024"
      },
      attachedDocuments: [
        { name: "advance-receipt.pdf", type: "pdf" },
        { name: "order-confirmation.pdf", type: "pdf" }
      ]
    },
  }
  
  return invoices[id as keyof typeof invoices] || null
}

export default async function InvoiceDetailPage({ params }: InvoiceDetailProps) {
  const resolvedParams = await params
  const invoice = getInvoiceData(resolvedParams.id)
  
  if (!invoice) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <Card className="mx-6">
            <CardContent className="p-6">
              <h1 className="text-xl font-semibold">Invoice not found</h1>
              <p className="text-muted-foreground mt-2">The invoice you&apos;re looking for doesn&apos;t exist.</p>
              <Link href="/invoice">
                <Button variant="outline" className="mt-4">
                  <IconArrowLeft className="h-4 w-4 mr-2" />
                  Back to Invoices
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
      case "Completed":
        return "bg-green-50 text-green-600 border-green-200"
      case "Advance Paid":
        return "bg-blue-50 text-blue-600 border-blue-200"
      case "Shipping an Order":
        return "bg-blue-50 text-blue-600 border-blue-200"
      case "Pending":
        return "bg-orange-50 text-orange-600 border-orange-200"
      default:
        return "bg-gray-50 text-gray-600 border-gray-200"
    }
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <Card className="mx-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Link href="/invoice">
              <Button variant="outline" size="icon" className="size-8">
                <IconArrowLeft />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <CardTitle>Invoice # {invoice.invoiceNumber}</CardTitle>
              <Badge variant="outline" className={`px-3 py-1 ${getStatusBadge(invoice.status)}`}>
                <IconTrendingUp className="h-3 w-3 mr-1.5" />
                {invoice.status}
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
          {/* Vehicle Details */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">VEHICLE DETAILS</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Driver Name</label>
                <p className="font-medium">{invoice.vehicleDetails.driverName}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Date of Birth</label>
                <p className="font-medium">{invoice.vehicleDetails.dateOfBirth}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Phone Number</label>
                <p className="font-medium">{invoice.vehicleDetails.phoneNumber}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Aadhaar Number</label>
                <p className="font-medium">{invoice.vehicleDetails.aadhaarNumber}</p>
              </div>
            </div>
          </div>
          <Separator />

          {/* Current Order Details */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">CURRENT ORDER DETAILS</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Order Number</label>
                <p className="font-medium underline">{invoice.currentOrder.orderNumber}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Vehicle Number</label>
                <p className="font-medium underline">{invoice.currentOrder.vehicleNumber}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Pickup Address</label>
                <p className="font-medium">{invoice.currentOrder.pickupAddress}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Delivery Address</label>
                <p className="font-medium">{invoice.currentOrder.deliveryAddress}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Estd. Delivery Date</label>
                <p className="font-medium">{invoice.currentOrder.estDeliveryDate}</p>
              </div>
            </div>
          </div>
                    <Separator />


          {/* Attached Documents */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">ATTACHED DOCUMENTS</h3>
            <div className="flex gap-4">
              {invoice.attachedDocuments.map((doc, index) => (
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
