import { ShipmentGraph } from "./charts/shipment-graph"
import { ShipmentRevenueBar } from "./charts/shipment-revenue-bar"
import { AverageTimeBar } from "./charts/average-time-bar"
import { FrequentRoutesBar } from "./charts/frequent-roots-bar"
import { HappinessGraph } from "./charts/happines-graph"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-4">
          <ShipmentGraph />
          <AverageTimeBar />
          
        </div>
        
        {/* Right Column */}
        <div className="space-y-4">
          <ShipmentRevenueBar />
          <FrequentRoutesBar />
          <HappinessGraph />
        </div>
      </div>
    </div>
  )
}