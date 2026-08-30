// src/pages/klik/components/TrenOmsetChart.tsx
"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { DUMMY_TREND } from "./data";

const trendConfig = {
  omzet: { label: "Omset (jt)", color: "var(--chart-1)" },
  omzet2: { label: "Omset lalu (jt)", color: "var(--muted-foreground)" },
} satisfies ChartConfig;

export function TrenOmsetChart() {
  return (
    <Card className="overflow-hidden border-border/60 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="size-4 text-chart-1" aria-hidden />
          Tren Omset Online
        </CardTitle>
        <CardDescription>
          Tren 30 hari terakhir, membandingkan periode lalu (dalam juta)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={trendConfig} className="h-[260px] w-full">
          <AreaChart data={DUMMY_TREND} margin={{ left: 12, right: 12 }}>
            <defs>
              <linearGradient id="fillOmzet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-omzet)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-omzet)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} width={44} tick={{ fontSize: 11 }} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area
              dataKey="omzet2"
              type="monotone"
              stroke="var(--color-omzet2)"
              strokeWidth={2}
              strokeDasharray="4 4"
              fill="none"
            />
            <Area
              dataKey="omzet"
              type="monotone"
              stroke="var(--color-omzet)"
              strokeWidth={2.5}
              fill="url(#fillOmzet)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
