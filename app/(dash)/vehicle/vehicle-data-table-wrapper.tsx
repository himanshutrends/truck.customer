"use client"

import * as React from "react"
import { DataTable } from "./data-table"
import { ModalForm } from "@/components/modal-form"
import { AddVehicleForm, VehicleFormData } from "./add-form"
import { addVehicle } from "./server/actions/vehicle"
import { Vehicle, VehicleType } from "@/lib/types"
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

  const handleAddVehicle = async (formData: VehicleFormData) => {
    if (userRole !== 'vendor') {
      toast.error('Access denied', {
        description: 'Only vendors can add vehicles'
      })
      return
    }
    
    // Transform form data to match Vehicle interface
    const vehicleData: Partial<Vehicle> = {
      truck_type: {
        id: 1,
        name: formData.vehicleType,
        description: formData.vehicleType,
        created_at: new Date().toISOString()
      } as VehicleType,
      registration_number: formData.vehicleNumber,
      make: formData.vehicleModel,
      model: formData.vehicleModel,
      capacity: formData.maxLoad,
      availability_status: 'available',
      is_active: true,
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
