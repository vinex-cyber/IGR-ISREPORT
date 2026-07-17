// src/components/charts/ChartTooltipIndicatorLine.tsx
import { Bar, BarChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { ReusableTooltip } from "@/components/charts/ReusableTooltip";

type ChartTooltipIndicatorLineProps = {
  title?: string;
  description?: string;
  data?: Array<Record<string, string | number>>;
  config?: ChartConfig;
  xKey?: string;
  series?: string[];
  defaultIndex?: number;
  xTickFormatter?: (value: string | number) => string;
  stackId?: string;
  stacked?: boolean;
};

const radiusTop: [number, number, number, number] = [4, 4, 0, 0];

const defaultData = [
  { date: "2024-07-15", running: 450, swimming: 300 },
  { date: "2024-07-16", running: 380, swimming: 420 },
  { date: "2024-07-17", running: 520, swimming: 120 },
  { date: "2024-07-18", running: 140, swimming: 550 },
  { date: "2024-07-19", running: 600, swimming: 350 },
  { date: "2024-07-20", running: 480, swimming: 400 },
];

const defaultConfig = {
  running: {
    label: "Running",
    color: "var(--chart-1)",
  },
  swimming: {
    label: "Swimming",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const defaultSeries = ["running", "swimming"];

export function ChartTooltipIndicatorLine({
  title = "Tooltip - Line Indicator",
  description = "Tooltip with line indicator.",
  data = defaultData,
  config = defaultConfig,
  xKey = "date",
  series = defaultSeries,
  defaultIndex = 1,
  xTickFormatter,
  stackId = "a",
  stacked = false,
}: ChartTooltipIndicatorLineProps) {
  const lastIndex = series.length - 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <BarChart accessibilityLayer data={data}>
            <XAxis
              dataKey={xKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              interval={0}
              tick={{ fontSize: 11 }}
              tickFormatter={
                xTickFormatter ??
                ((value) =>
                  new Date(String(value)).toLocaleDateString("en-US", {
                    weekday: "short",
                  }))
              }
            />
            {series.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                stackId={stacked ? stackId : undefined}
                fill={`var(--color-${key})`}
                radius={stacked && index === lastIndex ? radiusTop : [0, 0, 0, 0]}
              />
            ))}
            <ReusableTooltip indicator="line" defaultIndex={defaultIndex} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
