// src/pages/klik/components/TransaksiHarianChart.tsx
"use client";

import { ShoppingCart } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { DUMMY_TREND } from "./data";

const trendConfig = {
  trx: { label: "Transaksi", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function TransaksiHarianChart() {
  return (
    <Card className="overflow-hidden border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="size-4 text-chart-3" aria-hidden />
          Transaksi Harian
        </CardTitle>
        <CardDescription>Jumlah transaksi per hari</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={trendConfig} className="h-[220px] w-full">
          <BarChart data={DUMMY_TREND} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} width={40} tick={{ fontSize: 11 }} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="trx" fill="var(--chart-3)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
