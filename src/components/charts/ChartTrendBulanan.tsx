// src/components/charts/ChartTrendBulanan.tsx
"use client";

import { useEffect, useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useFetchData } from "@/hooks/data/useFetchData";

const MONTHS = [
  "01", "02", "03", "04", "05", "06",
  "07", "08", "09", "10", "11", "12",
] as const;

type TrendDivisiRow = {
  kodedivisi: string;
  namadivisi: string;
  sls_rph_01: number; sls_rph_02: number; sls_rph_03: number;
  sls_rph_04: number; sls_rph_05: number; sls_rph_06: number;
  sls_rph_07: number; sls_rph_08: number; sls_rph_09: number;
  sls_rph_10: number; sls_rph_11: number; sls_rph_12: number;
  mgr_01: number; mgr_02: number; mgr_03: number;
  mgr_04: number; mgr_05: number; mgr_06: number;
  mgr_07: number; mgr_08: number; mgr_09: number;
  mgr_10: number; mgr_11: number; mgr_12: number;
};

const MONTH_LABEL: Record<string, string> = {
  "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
  "05": "Mei", "06": "Jun", "07": "Jul", "08": "Agu",
  "09": "Sep", "10": "Okt", "11": "Nov", "12": "Des",
};

const chartConfig = {
  value: {
    label: "Nilai",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function getMonthOrder(currentMonth: string): string[] {
  const idx = MONTHS.indexOf(currentMonth as (typeof MONTHS)[number]);
  const start = (idx + 1) % MONTHS.length;
  return [...MONTHS.slice(start), ...MONTHS.slice(0, start)];
}

type ChartTrendBulananProps = {
  metric: "sales" | "margin";
  title?: string;
  description?: string;
  branch?: string;
};

export function ChartTrendBulanan({
  metric,
  title,
  description,
  branch,
}: ChartTrendBulananProps) {
  const currentMonth = useMemo(() => {
    const m = String(new Date().getMonth() + 1).padStart(2, "0");
    return (MONTHS.includes(m as (typeof MONTHS)[number]) ? m : "01") as string;
  }, []);

  const { data, loading, refetch } = useFetchData<TrendDivisiRow[]>({
    endpoint: "/chart/trend-sales-divisi",
  });

  useEffect(function refetchOnBranchChange() {
    refetch();
  }, [branch, refetch]);

  const chartData = useMemo(() => {
    const rows = data ?? [];
    const order = getMonthOrder(currentMonth);
    const field = metric === "sales" ? "sls_rph" : "mgr";

    return order.map((m) => {
      let total = 0;
      for (const row of rows) {
        total += Number(row[`${field}_${m}` as keyof TrendDivisiRow]) || 0;
      }
      return {
        month: MONTH_LABEL[m] ?? m,
        value: Number((total / 1_000_000).toFixed(2)),
      };
    });
  }, [data, currentMonth, metric]);

  if (loading) {
    return (
      <div className="rounded-lg border p-4 text-sm text-muted-foreground">
        Memuat data...
      </div>
    );
  }

  const cardTitle =
    title ?? (metric === "sales" ? "Trend Sales per Bulan" : "Trend Margin per Bulan");
  const cardDescription = description ?? "Dalam juta";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="value"
              type="monotone"
              stroke="var(--color-value)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
