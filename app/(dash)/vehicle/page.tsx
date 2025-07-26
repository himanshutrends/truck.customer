'use server'
import React from "react"
import { getVendorTrucks } from "./server/actions/vehicle"
import { AuthManager } from "@/lib/auth-manager"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck } from "lucide-react"
import { VehicleDataTableWrapper } from "./vehicle-data-table-wrapper"


export default async function VehiclePage() {
  // Get current user to determine which API to call
  const user = await AuthManager.getCurrentUser();
  
  // Transform the data for the table
  const vehiclesResponse = await getVendorTrucks()

  console.log("=== VehiclePage: Fetched vehicles ===", vehiclesResponse);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground">
            {user?.role === 'vendor' 
              ? "Manage your fleet of vehicles" 
              : "View and manage all vehicles in the system"
            }
          </p>
        </div>
      </div>


      {/* Success case - show data table */}
      {vehiclesResponse.success && vehiclesResponse.data && (
        <VehicleDataTableWrapper 
          initialData={vehiclesResponse.data}
          userRole={user?.role || ''}
        />
      )}

      {/* Empty state */}
      {vehiclesResponse.success && vehiclesResponse.data && vehiclesResponse.data.length === 0 && (
        <Card className="text-center py-12">
          <CardHeader>
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Truck className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle>No vehicles found</CardTitle>
            <CardDescription>
              {user?.role === 'vendor' 
                ? "You haven't added any vehicles yet. Start by adding your first vehicle to your fleet."
                : "No vehicles are currently registered in the system."
              }
            </CardDescription>
          </CardHeader>
          {user?.role === 'vendor' && (
            <CardContent>
              <VehicleDataTableWrapper 
                initialData={[]}
                userRole={user?.role || ''}
              />
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}
