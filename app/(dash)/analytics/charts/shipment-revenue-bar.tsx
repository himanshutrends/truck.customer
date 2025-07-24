"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconDots, IconCurrencyRupee, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"

const chartData = [
  { quarter: "Q1", revenue: 186000 },
  { quarter: "Q2", revenue: 205000 },
  { quarter: "Q3", revenue: 285600 },
  { quarter: "Q4", revenue: 120000 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ShipmentRevenueBar() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center rounded-lg bg-green-500/10 p-2">
            <IconCurrencyRupee className="size-6 text-green-600" />
          </div>
          <div className="">
            <CardTitle>Shipment Revenue</CardTitle>
          </div>
        </div>
        <CardAction className="flex items-center gap-2">
          <Select defaultValue="thisyear">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisweek">This Week</SelectItem>
              <SelectItem value="thismonth">This Month</SelectItem>
              <SelectItem value="thisquarter">This Quarter</SelectItem>
              <SelectItem value="thisyear">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="size-8">
            <IconDots />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {/* Total Deliveries Section */}
        <div className="mb-6">
          <div className="text-sm text-muted-foreground mb-1">Total Deliveries </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold">₹28,56,000</div>
            <Badge variant="secondary" className="bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">
              <IconTrendingUp className="h-4 w-4" /> 2% this quarter
            </Badge>
          </div>
        </div>
        
        <ChartContainer config={chartConfig} className="h-[200px]">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 10,
              right: 10,
              top: 5,
              bottom: 5,
            }}
          >
            <XAxis type="number" dataKey="revenue" hide />
            <YAxis
              dataKey="quarter"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={30}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar 
              dataKey="revenue" 
              fill="var(--color-revenue)" 
              radius={8}
              maxBarSize={25}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}