import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  IconArrowLeft, 
  IconDots, 
  IconFileExport, 
  IconFileTypePdf,
  IconFileTypeXls,
  IconFile,
  IconMapPin,
  IconTrendingUp,
  IconCheck,
  IconClock,
  IconTruck
} from "@tabler/icons-react"
import Link from "next/link"

interface OrderDetailProps {
  params: {
    id: string
  }
}

interface DeliveryStep {
  id: string
  time: string
  status: "completed" | "current" | "pending"
  title: string
  description?: string
}

interface OrderData {
  id: string
  orderNumber: string
  status: string
  orderDetails: {
    companyName: string
    weight: string
    contactPerson: string
    contactPhoneNo: string
    fee: string
    paymentStatus: string
    packageType: string
    packageDimensions: string
    packageQuantity: string
    hazardous: string
    itemTransported: string
    deliveryInstructions: string
  }
  deliveryDetails: {
    pickupAddress: string
    deliveryAddress: string
    pickupDate: string
    estDeliveryDate: string
    distanceTravelled: string
    driverAssigned: string
    driverPhoneNumber: string
    vehicleType: string
    vehicleNumber: string
    vehicleModel: string
  }
  deliveryTimeline: DeliveryStep[]
  attachedDocuments: { name: string; type: string; color: string }[]
}

// Delivery Timeline Component
function DeliveryTimeline({ steps }: { steps: DeliveryStep[] }) {
  return (
    <div className="">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-start gap-4">
              <div className="text-sm text-muted-foreground mt-1">{step.time}</div>
          {/* Timeline Icon */}
          <div className="flex flex-col items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
              step.status === "completed" 
                ? "bg-green-500 border-green-500 text-white" 
                : step.status === "current"
                ? "bg-blue-500 border-blue-500 text-white"
                : "bg-gray-100 border-gray-300 text-gray-400"
            }`}>
              {step.status === "completed" ? (
                <IconCheck className="h-4 w-4" />
              ) : step.status === "current" ? (
                <IconClock className="h-4 w-4" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-current" />
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`h-6 w-0.5 ${
                step.status === "completed" ? "bg-green-500" : "bg-gray-200"
              }`} />
            )}
          </div>

          {/* Timeline Content */}
          <div className="flex-1">
              <div className={`text-sm mt-1 font-medium leading-tight ${
                step.status === "completed" 
                  ? "text-green-600" 
                  : step.status === "current"
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}>
                {step.title}
              </div>
            {step.description && (
              <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// Mock data - in real app this would come from API/database
const getOrderData = (id: string): OrderData | null => {
  const orders: Record<string, OrderData> = {
    "00112233HEM": {
      id: "00112233HEM",
      orderNumber: "#00112233HEM",
      status: "Shipping",
      orderDetails: {
        companyName: "Mearsk Shipping",
        weight: "12 Tonnes",
        contactPerson: "Jayesh Singh",
        contactPhoneNo: "+91 45564 33443",
        fee: "₹1,64,000",
        paymentStatus: "Advance Paid",
        packageType: "Wooden Crates",
        packageDimensions: "12 x 50 x 12 cm",
        packageQuantity: "134",
        hazardous: "No",
        itemTransported: "Aluminium",
        deliveryInstructions: "-"
      },
      deliveryDetails: {
        pickupAddress: "45 Maple Street, Chinnwara, MP",
        deliveryAddress: "45 Maple Street, New Delhi, MP",
        pickupDate: "12 January 2025",
        estDeliveryDate: "26 January 2025",
        distanceTravelled: "560 km",
        driverAssigned: "Raghav Singh",
        driverPhoneNumber: "+91 87667 37423",
        vehicleType: "Heavy Truck",
        vehicleNumber: "MH05R6788",
        vehicleModel: "Mercedes FreightMaster X2000"
      },
      deliveryTimeline: [
        {
          id: "1",
          time: "12 Jan 12:12 PM",
          status: "completed",
          title: "Order Confirmed"
        },
        {
          id: "2", 
          time: "12 Jan 12:12 PM",
          status: "completed",
          title: "Package Loading Complete"
        },
        {
          id: "3",
          time: "12 Jan 12:12 PM", 
          status: "current",
          title: "Out for delivery"
        },
        {
          id: "4",
          time: "12 Jan 12:12 PM",
          status: "pending",
          title: "Unloaded packages"
        },
        {
          id: "5",
          time: "12 Jan 12:12 PM",
          status: "pending", 
          title: "Complete"
        }
      ],
      attachedDocuments: [
        { name: "Permissions-transport", type: "pdf", color: "red" },
        { name: "Inventory-list", type: "xlsx", color: "green" }
      ]
    }
  }

  return orders[id] || null
}

export default function OrderDetailPage({ params }: OrderDetailProps) {
  const order = getOrderData(params.id)
  
  if (!order) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <Card className="mx-6">
            <CardContent className="p-6">
              <h1 className="text-xl font-semibold">Order not found</h1>
              <p className="text-muted-foreground mt-2">The order you're looking for doesn't exist.</p>
              <Link href="/order">
                <Button variant="outline" className="mt-4">
                  <IconArrowLeft className="h-4 w-4 mr-2" />
                  Back to Orders
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <Card className="mx-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Link href="/order">
              <Button variant="outline" size="icon" className="size-8">
                <IconArrowLeft />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <CardTitle>Order {order.orderNumber}</CardTitle>
              <Badge variant="outline" className="px-3 py-1 bg-blue-50 text-blue-600 border-blue-200">
                {order.status}
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
          {/* Order Details */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">ORDER DETAILS</h3>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Company Name</label>
                <p className="font-medium">{order.orderDetails.companyName}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Weight</label>
                <p className="font-medium">{order.orderDetails.weight}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Contact Person</label>
                <p className="font-medium">{order.orderDetails.contactPerson}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Contact Phone No.</label>
                <p className="font-medium">{order.orderDetails.contactPhoneNo}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Fee</label>
                <p className="font-medium">{order.orderDetails.fee}</p>
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-muted-foreground">Payment Status</label>
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                  {order.orderDetails.paymentStatus}
                </Badge>
              </div>
            </div>
            
            {/* Second row */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4">
              <div>
                <label className="text-sm text-muted-foreground">Package Type</label>
                <p className="font-medium">{order.orderDetails.packageType}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Package Dimensions</label>
                <p className="font-medium">{order.orderDetails.packageDimensions}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Package Quantity</label>
                <p className="font-medium">{order.orderDetails.packageQuantity}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Hazardous?</label>
                <p className="font-medium">{order.orderDetails.hazardous}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Item Transported</label>
                <p className="font-medium">{order.orderDetails.itemTransported}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Delivery Instructions</label>
                <p className="font-medium">{order.orderDetails.deliveryInstructions}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Delivery Details */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">DELIVERY DETAILS</h3>
            
            <div className="flex gap-4">
              {/* Delivery Timeline */}
            <div className="mb-6 w-fit mr-10">
              <DeliveryTimeline steps={order.deliveryTimeline} />
            </div>

            {/* Delivery Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Pickup Address</label>
                <p className="font-medium">{order.deliveryDetails.pickupAddress}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Delivery Address</label>
                <p className="font-medium">{order.deliveryDetails.deliveryAddress}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Pickup Date</label>
                <p className="font-medium">{order.deliveryDetails.pickupDate}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Estd. Delivery Date</label>
                <p className="font-medium">{order.deliveryDetails.estDeliveryDate}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Distance Travelled</label>
                <p className="font-medium">{order.deliveryDetails.distanceTravelled}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Driver Assigned</label>
                <p className="font-medium underline">{order.deliveryDetails.driverAssigned}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Driver Phone Number</label>
                <p className="font-medium">{order.deliveryDetails.driverPhoneNumber}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Vehicle Type</label>
                <p className="font-medium">{order.deliveryDetails.vehicleType}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Vehicle Number</label>
                <p className="font-medium underline">{order.deliveryDetails.vehicleNumber}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Vehicle Model</label>
                <p className="font-medium">{order.deliveryDetails.vehicleModel}</p>
              </div>
            </div>
            </div>
            
          </div>

          <Separator />

          {/* Attached Documents */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">ATTACHED DOCUMENTS</h3>
            <div className="flex gap-4">
              {order.attachedDocuments.map((doc, index) => {
                // Dynamic icon selection based on file type
                const getFileIcon = (type: string) => {
                  switch (type.toLowerCase()) {
                    case 'pdf':
                      return IconFileTypePdf
                    case 'xlsx':
                    case 'xls':
                      return IconFileTypeXls
                    default:
                      return IconFile
                  }
                }
                
                const FileIcon = getFileIcon(doc.type)
                
                return (
                  <Button key={index} variant="outline" size="sm" className="flex items-center gap-2">
                    <FileIcon className={`h-4 w-4 ${doc.color === 'red' ? 'text-red-500' : 'text-green-500'}`} />
                    {doc.name}
                  </Button>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
