// src/components/charts/ChartTrendSalesDivisi.tsx
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

type DivisiRow = Record<string, string | number | null> & {
  kodedivisi: string;
  namadivisi: string | null;
};

type ChartTrendSalesDivisiProps = {
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

export function ChartTrendSalesDivisi({
  metric,
  title,
  description,
  branch,
}: ChartTrendSalesDivisiProps) {
  const { data, loading, refetch } = useFetchData<DivisiRow[]>({
    endpoint: "/chart/trend-tahunan-divisi",
    queryParams: { metric },
  });

  useEffect(function refetchOnBranchChange() {
    refetch();
  }, [branch, refetch]);

  // ponytail: divisi tanpa nilai sama sekali (semua bulan × semua tahun
  // null/0) tidak dirender.
  const rows = useMemo(
    () =>
      (data ?? []).filter((row) =>
        YEARS.some((y) =>
          MONTH_LABELS.some((_, i) => {
            const v = row[`v${y}_${String(i + 1).padStart(2, "0")}`];
            return v != null && Number(v) !== 0;
          }),
        ),
      ),
    [data],
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {title ?? (metric === "sales" ? "Sales per Divisi" : "Margin per Divisi")}
          </CardTitle>
          <CardDescription>{description ?? "Per divisi, tiga tahun"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  if (rows.length === 0) return null;

  return (
    <>
      {rows.map((row) => {
        const nama =
          row.namadivisi?.trim() || `Div ${row.kodedivisi}`;

        const chartData = MONTH_LABELS.map((bulan, i) => {
          const idx = String(i + 1).padStart(2, "0");
          const point: Record<string, string | number | null> = { bulan };
          for (const y of YEARS) {
            const v = row[`v${y}_${idx}`];
            point[`y${y}`] = v == null ? null : Math.round(Number(v) / 1_000_000);
          }
          return point;
        });

        const chartConfig = {
          [`y${YEARS[0]}`]: { label: String(YEARS[0]), color: "var(--chart-4)" },
          [`y${YEARS[1]}`]: { label: String(YEARS[1]), color: "var(--chart-3)" },
          [`y${YEARS[2]}`]: { label: String(YEARS[2]), color: "var(--chart-1)" },
        } satisfies ChartConfig;

        return (
          <Card key={row.kodedivisi}>
            <CardHeader>
              <CardTitle>{title ? `${title} — ${nama}` : nama}</CardTitle>
              <CardDescription>
                {description ??
                  `${YEARS[0]} vs ${YEARS[1]} vs ${YEARS[2]} (Jan–${MONTH_LABELS[Number(CUR_MONTH) - 1]}), dalam juta`}
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
      })}
    </>
  );
}
