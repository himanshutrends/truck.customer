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
import { IconDots, IconRoute } from "@tabler/icons-react"

const chartData = [
  { route: "Delhi - Mumbai", count: 45 },
  { route: "Mumbai - Chennai", count: 38 },
  { route: "Bangalore - Hyderabad", count: 32 },
  { route: "Kolkata - Delhi", count: 28 },
  { route: "Pune - Ahmedabad", count: 24 },
]

const chartConfig = {
  count: {
    label: "Shipments",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function FrequentRoutesBar() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center rounded-lg bg-purple-500/10 p-2">
            <IconRoute className="size-6 text-purple-600" />
          </div>
          <div className="">
            <CardTitle>Most Frequent Routes</CardTitle>
            <CardDescription>
              Top shipping routes by volume
            </CardDescription>
          </div>
        </div>
        <CardAction className="flex items-center gap-2">
          <Select defaultValue="1month">
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
        <ChartContainer config={chartConfig} className="h-[250px]">
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
            <XAxis type="number" dataKey="count" hide />
            <YAxis
              dataKey="route"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={180}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar 
              dataKey="count" 
              fill="var(--color-count)" 
              radius={8}
              maxBarSize={25}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Delhi-Mumbai route trending up by 15% <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing top 5 routes for this month
        </div>
      </CardFooter>
    </Card>
  )
}