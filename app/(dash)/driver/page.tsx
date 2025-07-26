'use server'
import React from "react"
import { getVendorDrivers } from "./server/actions/driver"
import { AuthManager } from "@/lib/auth-manager"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { DriverDataTableWrapper } from "./driver-data-table-wrapper"


export default async function DriverPage() {
  // Get current user to determine which API to call
  const user = await AuthManager.getCurrentUser();
  
  // Fetch the drivers data
  const driversResponse = await getVendorDrivers()

  console.log("=== DriverPage: Fetched drivers ===", driversResponse);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Drivers</h1>
          <p className="text-muted-foreground">
            {user?.role === 'vendor' 
              ? "Manage your team of drivers" 
              : "View and manage all drivers in the system"
            }
          </p>
        </div>
      </div>

      {/* Success case - show data table */}
      {driversResponse.success && driversResponse.data && (
        <DriverDataTableWrapper 
          initialData={driversResponse.data}
          userRole={user?.role || ''}
        />
      )}

      {/* Empty state */}
      {driversResponse.success && driversResponse.data && driversResponse.data.length === 0 && (
        <Card className="text-center py-12">
          <CardHeader>
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle>No drivers found</CardTitle>
            <CardDescription>
              {user?.role === 'vendor' 
                ? "You haven't added any drivers yet. Start by adding your first driver to your team."
                : "No drivers are currently registered in the system."
              }
            </CardDescription>
          </CardHeader>
          {user?.role === 'vendor' && (
            <CardContent>
              <DriverDataTableWrapper 
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
