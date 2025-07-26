"use client"

import * as React from "react"
import { DataTable } from "./data-table"
import { ModalForm } from "@/components/modal-form"
import { AddDriverForm } from "./add-form"
import { addDriver, Driver } from "./server/actions/driver"
import { toast } from "sonner"

// Client component wrapper for the data table with modal functionality
export function DriverDataTableWrapper({ 
  initialData, 
  userRole 
}: { 
  initialData: Driver[], 
  userRole: string 
}) {
  const [drivers, setDrivers] = React.useState<Driver[]>(initialData)
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)

  const handleAddDriver = async (driverData: Partial<Driver>) => {
    if (userRole !== 'vendor') {
      toast.error('Access denied', {
        description: 'Only vendors can add drivers'
      })
      return
    }
    
    try {
      const response = await addDriver(driverData)
      
      if (response.success && response.data) {
        // Add the new driver to the list
        setDrivers(prev => [...prev, response.data!])
        setIsAddModalOpen(false)
        
        toast.success('Driver added successfully', {
          description: `${response.data.name} has been added to your team`
        })
      } else {
        toast.error('Failed to add driver', {
          description: response.error || 'An unexpected error occurred'
        })
      }
    } catch (error) {
      console.error('Error adding driver:', error)
      toast.error('Failed to add driver', {
        description: 'An unexpected error occurred. Please try again.'
      })
    }
  }

  return (
    <>
      <DataTable 
        data={drivers} 
        onAddClick={userRole === 'vendor' ? () => setIsAddModalOpen(true) : undefined}
      />
      
      {/* Add Driver Modal - Only for vendors */}
      {userRole === 'vendor' && (
        <ModalForm
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          title="Add New Driver"
          showBackButton={true}
        >
          <AddDriverForm
            onSubmit={handleAddDriver}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </ModalForm>
      )}
    </>
  )
}
