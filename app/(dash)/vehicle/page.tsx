"use client"

import * as React from "react"
import { DataTable } from "./data-table"
import { ModalForm } from "@/components/modal-form"
import { AddVehicleForm } from "./add-form"
import { Button } from "@/components/ui/button"

export default function VehiclePage() {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)

  const handleAddVehicle = (vehicleData: any) => {
    console.log("Adding vehicle:", vehicleData)
    // Here you would typically send the data to your API
    setIsAddModalOpen(false)
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <DataTable 
        data={[]} 
        onAddClick={() => setIsAddModalOpen(true)}
      />
      
      {/* Add Vehicle Modal */}
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
    </div>
  )
}
