"use client"

import * as React from "react"
import { DataTable } from "./data-table"

export default function OrderRequestPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <DataTable 
        data={[]} 
      />
    </div>
  )
}
