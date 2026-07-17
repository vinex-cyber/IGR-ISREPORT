"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A multiple line chart"

const chartData = [
  { month: "January", sales: 186, margin: 80 },
  { month: "February", sales: 305, margin: 200 },
  { month: "March", sales: 237, margin: 120 },
  { month: "April", sales: 73, margin: 190 },
  { month: "May", sales: 209, margin: 130 },
  { month: "June", sales: 214, margin: 140 },
]

const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--chart-1)",
  },
  margin: {
    label: "Margin",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartLineMultiple() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart - Sales & Margin</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="sales"
              type="monotone"
              stroke="var(--color-sales)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="margin"
              type="monotone"
              stroke="var(--color-margin)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
