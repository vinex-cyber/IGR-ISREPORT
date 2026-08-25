// src/components/charts/DashboardKpi.tsx
"use client";

import { useEffect, useMemo } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Percent,
  ShoppingBag,
  Wallet,
} from "lucide-react";

import { useAnimeCounter } from "@/hooks/animation/useAnimeCounter";
import { useFetchData } from "@/hooks/data/useFetchData";

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

type DivisiRow = {
  kodedivisi: string;
  [key: `sls_rph_${string}`]: number;
  [key: `mgr_${string}`]: number;
};

type Kpi = {
  key: string;
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  delta?: number;
  icon: typeof Wallet;
  accentClass: string;
};

function sumField(rows: DivisiRow[], prefix: string, months: string[]): number {
  let total = 0;
  for (const row of rows) {
    for (const m of months) {
      total += Number(row[`${prefix}_${m}` as keyof DivisiRow]) || 0;
    }
  }
  return total;
}

type KpiValueProps = {
  value: number;
  decimals?: number;
  suffix?: string;
};

function KpiAnimatedValue({ value, decimals = 0, suffix }: KpiValueProps) {
  const rounded = useMemo(
    () => Number(Number(value).toFixed(decimals)),
    [value, decimals],
  );
  const { value: animated } = useAnimeCounter({ to: rounded });
  const display =
    decimals > 0
      ? animated.toLocaleString("id-ID", { minimumFractionDigits: decimals })
      : animated.toLocaleString("id-ID");
  return (
    <span>
      {display}
      {suffix ? (
        <span className="ml-1 text-base font-medium text-muted-foreground">
          {suffix}
        </span>
      ) : null}
    </span>
  );
}

export function DashboardKpi({ branch }: { branch?: string }) {
  const { data, loading, refetch } = useFetchData<DivisiRow[]>({
    endpoint: "/chart/trend-sales-divisi",
  });

  useEffect(function refetchOnBranchChange() {
    refetch();
  }, [branch, refetch]);

  const kpis = useMemo<Kpi[]>(() => {
    const rows = data ?? [];
    const now = new Date();
    const currentIdx = now.getMonth();
    const ytdMonths = MONTHS.slice(0, currentIdx + 1) as unknown as string[];

    const salesYtd = sumField(rows, "sls_rph", ytdMonths);
    const marginYtd = sumField(rows, "mgr", ytdMonths);
    const marginPct = salesYtd > 0 ? (marginYtd / salesYtd) * 100 : 0;

    const thisMonth = MONTHS[currentIdx];
    const prevMonth = MONTHS[(currentIdx - 1 + MONTHS.length) % MONTHS.length];
    const salesThis = sumField(rows, "sls_rph", [thisMonth]);
    const salesPrev = sumField(rows, "sls_rph", [prevMonth]);
    const growth =
      salesPrev > 0 ? ((salesThis - salesPrev) / salesPrev) * 100 : 0;

    return [
      {
        key: "sales",
        label: `Total Sales YTD (${now.getFullYear()})`,
        value: salesYtd,
        icon: ShoppingBag,
        accentClass: "text-chart-1",
      },
      {
        key: "margin",
        label: "Total Margin YTD",
        value: marginYtd,
        icon: Wallet,
        accentClass: "text-chart-2",
      },
      {
        key: "margin-pct",
        label: "Margin YTD",
        value: marginPct,
        decimals: 1,
        suffix: "%",
        icon: Percent,
        accentClass: "text-chart-3",
      },
      {
        key: "growth",
        label: "Pertumbuhan Bulan Ini",
        value: growth,
        decimals: 1,
        suffix: "%",
        delta: growth,
        icon: Wallet,
        accentClass:
          growth >= 0
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-red-600 dark:text-red-400",
      },
    ];
  }, [data]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="space-y-1 rounded-lg border border-border/40 bg-card/60 p-2 backdrop-blur-sm"
          >
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            <div className="h-5 w-20 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        const positive = (kpi.delta ?? 0) >= 0;
        return (
          <div
            key={kpi.key}
            className="rounded-xl border border-border/40 bg-card/60 px-2 py-2 text-center backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-card/80 hover:shadow-md"
          >
              <p className="flex items-center justify-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                <span
                  className={`inline-flex rounded bg-muted/60 p-1 ${kpi.accentClass}`}>
                  <Icon className="size-3" aria-hidden />
                </span>
                {kpi.label}
              </p>
              <p className="mt-0.5 text-base font-semibold leading-tight tracking-tight tabular-nums">
                <KpiAnimatedValue
                  value={kpi.value}
                  decimals={kpi.decimals}
                  suffix={kpi.suffix}
                />
              </p>
              {kpi.delta !== undefined ? (
                <p
                  className={`mt-0.5 inline-flex items-center gap-0.5 rounded-full px-1.5 text-[10px] font-medium leading-tight ${
                    positive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}>
                  {positive ? (
                    <ArrowUpRight className="size-3" aria-hidden />
                  ) : (
                    <ArrowDownRight className="size-3" aria-hidden />
                  )}
                  vs bulan lalu
                </p>
              ) : null}
          </div>
        );
      })}
    </div>
  );
}
