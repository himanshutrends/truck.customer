"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
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
import { IconDots, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"

const chartData = [
  { month: "January", shipments: 186 },
  { month: "February", shipments: 305 },
  { month: "March", shipments: 237 },
  { month: "April", shipments: 273 },
  { month: "May", shipments: 209 },
  { month: "June", shipments: 214 },
]

const chartConfig = {
  shipments: {
    label: "Shipments",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ShipmentGraph() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center rounded-lg bg-primary/10 p-2">
            <IconTrendingUp className="size-6 text-primary" />
          </div>
          <div className="">
            <CardTitle>Shipment Trends</CardTitle>
          </div>
        </div>
        <CardAction className="flex items-center gap-2">
          <Select defaultValue="6months">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1week">1 Week</SelectItem>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="size-8">
            <IconDots />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center justify-center gap-1">
            <div className="text-sm text-muted-foreground">Total Deliveries :</div>
            <div className="text-sm font-semibold">1,224</div>
            <Badge variant="secondary" className="bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">
              <IconTrendingUp className="h-4 w-4" /> 2% this quarter
            </Badge>
          </div>
          <div className="flex items-center justify-center gap-1">
            <div className="text-sm text-muted-foreground">Pending :</div>
            <div className="text-sm font-semibold">89</div>
            <Badge variant="secondary" className="bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900 dark:text-orange-300">
              <IconTrendingUp className="h-4 w-4" /> 2% this quarter
            </Badge>
          </div>
        </div>
        
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
            className="h-[200px]"
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey="shipments"
              type="linear"
              fill="var(--color-shipments)"
              fillOpacity={0.4}
              stroke="var(--color-shipments)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}