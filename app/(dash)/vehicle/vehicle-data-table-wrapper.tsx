"use client"

import * as React from "react"
import { DataTable } from "./data-table"
import { ModalForm } from "@/components/modal-form"
import { AddVehicleForm } from "./add-form"
import { addVehicle, Vehicle } from "./server/actions/vehicle"
import { toast } from "sonner"

// Client component wrapper for the data table with modal functionality
export function VehicleDataTableWrapper({ 
  initialData, 
  userRole 
}: { 
  initialData: Vehicle[], 
  userRole: string 
}) {
  const [vehicles, setVehicles] = React.useState<Vehicle[]>(initialData)
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)

  const handleAddVehicle = async (vehicleData: Partial<Vehicle>) => {
    if (userRole !== 'vendor') {
      toast.error('Access denied', {
        description: 'Only vendors can add vehicles'
      })
      return
    }
    
    try {
      const response = await addVehicle(vehicleData)
      
      if (response.success && response.data) {
        // Add the new vehicle to the list
        setVehicles(prev => [...prev, response.data!])
        setIsAddModalOpen(false)
        
        toast.success('Vehicle added successfully', {
          description: `${response.data.registration_number} has been added to your fleet`
        })
      } else {
        toast.error('Failed to add vehicle', {
          description: response.error || 'An unexpected error occurred'
        })
      }
    } catch (error) {
      console.error('Error adding vehicle:', error)
      toast.error('Failed to add vehicle', {
        description: 'An unexpected error occurred. Please try again.'
      })
    }
  }

  return (
    <>
      <DataTable 
        data={vehicles} 
        onAddClick={userRole === 'vendor' ? () => setIsAddModalOpen(true) : undefined}
      />
      
      {/* Add Vehicle Modal - Only for vendors */}
      {userRole === 'vendor' && (
        <ModalForm
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          title="Add New Vehicle"
          showBackButton={true}
        >
          <AddVehicleForm
            onSubmit={handleAddVehicle}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </ModalForm>
      )}
    </>
  )
}
