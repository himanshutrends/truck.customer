"use client"

import * as React from "react"
import { DataTable } from "./data-table"
import { ModalForm } from "@/components/modal-form"
import { AddDriverForm } from "./add-form"

export default function DriverPage() {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)

  const handleAddDriver = (driverData: any) => {
    console.log("Adding driver:", driverData)
    // Here you would typically send the data to your API
    setIsAddModalOpen(false)
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <DataTable 
        data={[]} 
        onAddClick={() => setIsAddModalOpen(true)}
      />
      
      {/* Add Driver Modal */}
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
    </div>
  )
}
