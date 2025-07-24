"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconDots, IconMoodConfuzed, IconMoodHappy, IconMoodSad } from "@tabler/icons-react"

// Happiness levels data with percentages
const happinessData = {
  unhappy: 15, // Red segment
  neutral: 25, // Yellow segment  
  happy: 60,   // Green segment
}

export function HappinessGraph() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center rounded-lg bg-yellow-500/10 p-2">
            <IconMoodHappy className="size-6 text-yellow-600" />
          </div>
          <div className="">
            <CardTitle>Happiness</CardTitle>
            <CardDescription>
              Customer satisfaction levels
            </CardDescription>
          </div>
        </div>
        <CardAction className="flex items-center gap-2">
          <Select defaultValue="alltime">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1week">1 Week</SelectItem>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="alltime">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="size-8">
            <IconDots />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Horizontal Happiness Bar */}
          <div className="flex h-8 w-full overflow-hidden gap-2">
            {/* Unhappy segment - Red */}
            <div 
              className="flex items-center justify-center bg-red-400 text-white font-medium text-sm rounded-lg"
              style={{ width: `${happinessData.unhappy}%` }}
            >
              <IconMoodSad className="size-6" />
            </div>
            
            {/* Neutral segment - Yellow */}
            <div 
              className="flex items-center justify-center bg-yellow-400 text-white font-medium text-sm rounded-lg"
              style={{ width: `${happinessData.neutral}%` }}
            >
              <IconMoodConfuzed className="size-6" />
            </div>
            
            {/* Happy segment - Green */}
            <div 
              className="flex items-center justify-center bg-green-400 text-white font-medium text-sm rounded-lg"
              style={{ width: `${happinessData.happy}%` }}
            >
              <IconMoodHappy className="size-6" />
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400"></div>
              <span>Unhappy ({happinessData.unhappy}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
              <span>Neutral ({happinessData.neutral}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
              <span>Happy ({happinessData.happy}%)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}