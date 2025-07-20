import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"

import { DataTableDemo } from "./tablecard"

export default function Page() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="grid grid-cols-2 gap-4 px-4 lg:px-6">
        <ChartAreaInteractive />
        <DataTableDemo />
      </div>
      <DataTable data={[]} />
    </div>
  )
}
