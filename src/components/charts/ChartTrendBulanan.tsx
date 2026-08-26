// src/components/charts/ChartTrendBulanan.tsx
"use client";

import { useEffect, useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useFetchData } from "@/hooks/data/useFetchData";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

type TahunanRow = Record<string, number | string | null>;

type ChartTrendBulananProps = {
  metric: "sales" | "margin";
  title?: string;
  description?: string;
  branch?: string;
};

const now = new Date();
const YEARS = [
  now.getFullYear() - 2,
  now.getFullYear() - 1,
  now.getFullYear(),
];
const CUR_MONTH = String(now.getMonth() + 1).padStart(2, "0");

export function ChartTrendBulanan({
  metric,
  title,
  description,
  branch,
}: ChartTrendBulananProps) {
  const { data, loading, refetch } = useFetchData<TahunanRow[]>({
    endpoint: "/chart/trend-tahunan",
    queryParams: { metric },
  });

  useEffect(function refetchOnBranchChange() {
    refetch();
  }, [branch, refetch]);

  const row = data?.[0];

  const chartData = useMemo(
    () =>
      MONTH_LABELS.map((bulan, i) => {
        const idx = String(i + 1).padStart(2, "0");
        const point: Record<string, string | number | null> = { bulan };
        for (const y of YEARS) {
          const v = row?.[`v${y}_${idx}`];
          point[`y${y}`] = v == null ? null : Math.round(Number(v) / 1_000_000);
        }
        return point;
      }),
    [row],
  );

  const chartConfig = {
    [`y${YEARS[0]}`]: { label: String(YEARS[0]), color: "var(--chart-4)" },
    [`y${YEARS[1]}`]: { label: String(YEARS[1]), color: "var(--chart-3)" },
    [`y${YEARS[2]}`]: { label: String(YEARS[2]), color: "var(--chart-1)" },
  } satisfies ChartConfig;

  if (loading || !row) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title ?? (metric === "sales" ? "Tren Sales Bulanan" : "Tren Margin Bulanan")}</CardTitle>
          <CardDescription>{description ?? "Perbandingan tiga tahun, dalam juta"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {title ?? (metric === "sales" ? "Tren Sales Bulanan" : "Tren Margin Bulanan")}
        </CardTitle>
        <CardDescription>
          {description ?? `${YEARS[0]} vs ${YEARS[1]} vs ${YEARS[2]} (Jan–${MONTH_LABELS[Number(CUR_MONTH) - 1]}), dalam juta`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="bulan"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              tick={{ fontSize: 11 }}
            />
            <YAxis tickLine={false} axisLine={false} width={40} tick={{ fontSize: 11 }} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <ChartLegend content={<ChartLegendContent />} />
            {YEARS.map((y, i) => (
              <Line
                key={y}
                dataKey={`y${y}`}
                type="monotone"
                stroke={`var(--color-y${y})`}
                strokeWidth={2}
                dot={i < 2 ? false : { r: 2 }}
                connectNulls={i === 2}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
