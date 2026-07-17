// src/components/charts/ChartTrendSalesDivisi.tsx
"use client";

import { useMemo } from "react";

import { ChartTooltipIndicatorLine } from "@/components/charts/ChartTooltipIndicatorLine";
import { useFetchData } from "@/hooks/data/useFetchData";
import type { ChartConfig } from "@/components/ui/chart";

const MONTHS = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
] as const;

type TrendDivisiRow = {
  kodedivisi: string;
  namadivisi: string;
  sls_rph_01: number;
  sls_rph_02: number;
  sls_rph_03: number;
  sls_rph_04: number;
  sls_rph_05: number;
  sls_rph_06: number;
  sls_rph_07: number;
  sls_rph_08: number;
  sls_rph_09: number;
  sls_rph_10: number;
  sls_rph_11: number;
  sls_rph_12: number;
  mgr_01: number;
  mgr_02: number;
  mgr_03: number;
  mgr_04: number;
  mgr_05: number;
  mgr_06: number;
  mgr_07: number;
  mgr_08: number;
  mgr_09: number;
  mgr_10: number;
  mgr_11: number;
  mgr_12: number;
};

const MONTH_LABEL: Record<string, string> = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "Mei",
  "06": "Jun",
  "07": "Jul",
  "08": "Agu",
  "09": "Sep",
  "10": "Okt",
  "11": "Nov",
  "12": "Des",
};

const CHART_VARS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
  "var(--chart-9)",
  "var(--chart-10)",
];

function getMonthOrder(currentMonth: string): string[] {
  const idx = MONTHS.indexOf(currentMonth as (typeof MONTHS)[number]);
  const start = (idx + 1) % MONTHS.length;
  return [...MONTHS.slice(start), ...MONTHS.slice(0, start)];
}

type ChartTrendSalesDivisiProps = {
  metric?: "sales" | "margin";
  title?: string;
  description?: string;
};

export function ChartTrendSalesDivisi({
  metric = "sales",
  title,
  description,
}: ChartTrendSalesDivisiProps) {
  const currentMonth = useMemo(() => {
    const m = String(new Date().getMonth() + 1).padStart(2, "0");
    return (MONTHS.includes(m as (typeof MONTHS)[number]) ? m : "01") as string;
  }, []);

  const { data, loading } = useFetchData<TrendDivisiRow[]>({
    endpoint: "/chart/trend-sales-divisi",
  });

  const { chartData, chartConfig, series } = useMemo(() => {
    const rows = data ?? [];
    const order = getMonthOrder(currentMonth);
    const field = metric === "sales" ? "sls_rph" : "mgr";

    const divisiList = rows.map((row, i) => ({
      key: row.kodedivisi,
      label: `Div - ${i + 1}`,
      color: CHART_VARS[i % CHART_VARS.length],
    }));

    const config = divisiList.reduce<ChartConfig>((acc, d) => {
      acc[d.key] = { label: d.label, color: d.color };
      return acc;
    }, {});

    const builtData = order.map((m) => {
      const row: Record<string, string | number> = {
        month: MONTH_LABEL[m] ?? m,
      };
      for (const d of divisiList) {
        const found = rows.find((r) => r.kodedivisi === d.key);
        const raw = found
          ? Number(found[`${field}_${m}` as keyof TrendDivisiRow]) || 0
          : 0;
        row[d.key] = Number((raw / 1_000_000).toFixed(2));
      }
      return row;
    });

    return {
      chartData: builtData,
      chartConfig: config,
      series: divisiList.map((d) => d.key),
    };
  }, [data, currentMonth, metric]);

  if (loading) {
    return (
      <div className="rounded-lg border p-4 text-sm text-muted-foreground">
        Memuat data...
      </div>
    );
  }

  const cardTitle =
    title ?? (metric === "sales" ? "Sales per Divisi" : "Margin per Divisi");
  const cardDescription =
    description ?? "1 bar per bulan, warna berbeda per divisi";

  return (
    <ChartTooltipIndicatorLine
      title={cardTitle}
      description={cardDescription}
      data={chartData}
      config={chartConfig}
      xKey="month"
      series={series}
      stacked
      xTickFormatter={(value) => String(value)}
    />
  );
}
