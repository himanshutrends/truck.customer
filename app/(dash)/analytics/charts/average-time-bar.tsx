"use client"

import { TrendingDown } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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
import { IconDots, IconClock } from "@tabler/icons-react"

const chartData = [
  { month: "January", avgTime: 4.2 },
  { month: "February", avgTime: 3.8 },
  { month: "March", avgTime: 4.1 },
  { month: "April", avgTime: 3.6 },
  { month: "May", avgTime: 3.9 },
  { month: "June", avgTime: 3.4 },
]

const chartConfig = {
  avgTime: {
    label: "Average Time (days)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function AverageTimeBar() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center rounded-lg bg-orange-500/10 p-2">
            <IconClock className="size-6 text-orange-600" />
          </div>
          <div className="">
            <CardTitle>Average Delivery Time</CardTitle>
            <CardDescription>
              Average days to complete shipments
            </CardDescription>
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
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="avgTime" fill="var(--color-avgTime)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Improving by 18% this month <TrendingDown className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Lower delivery times mean better efficiency
        </div>
      </CardFooter>
    </Card>
  )
}