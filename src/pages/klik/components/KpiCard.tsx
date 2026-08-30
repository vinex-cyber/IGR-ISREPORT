// src/pages/klik/components/KpiCard.tsx
"use client";

import {
  Banknote,
  Package,
  Receipt,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { AnimatedNumber } from "./AnimatedNumber";
import type { Kpi } from "./data";

const ICONS: Record<string, typeof Banknote> = {
  banknote: Banknote,
  receipt: Receipt,
  package: Package,
  shopping: ShoppingCart,
  users: Users,
};

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const Icon = ICONS[kpi.icon] ?? Banknote;
  const Up = kpi.delta >= 0 ? TrendingUp : TrendingDown;
  return (
    <Card
      className={`relative overflow-hidden border-border/60 bg-gradient-to-b ${kpi.tint} via-card to-card transition-shadow duration-200 hover:shadow-md`}
    >
      <CardContent className="p-4">
        <span className={`mb-3 inline-flex rounded-md bg-muted/60 p-1.5 ${kpi.accent}`}>
          <Icon className="size-4" aria-hidden />
        </span>
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {kpi.label}
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight">
          <AnimatedNumber value={kpi.value} prefix={kpi.prefix ?? ""} />
        </p>
        <p
          className={`mt-1.5 inline-flex items-center gap-1 text-xs font-semibold ${
            kpi.delta >= 0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          <Up className="size-3.5" aria-hidden />
          {Math.abs(kpi.delta)}%
          <span className="ml-1 font-normal text-muted-foreground">
            vs periode lalu
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
