// src/pages/klik/components/KlikHero.tsx
"use client";

import { useEffect, useMemo } from "react";
import { format } from "date-fns";
import {
  Activity,
  Clock,
  MoonStar,
  MousePointerClick,
  Sparkles,
  ShoppingBagIcon,
} from "lucide-react";

import SettingsDatabase from "@/components/Settings/SettingsDatabase";
import type { DatabaseOption } from "@/configs/database-options";
import { useFetchData } from "@/hooks/data/useFetchData";
import { FormatTanggal } from "@/utils/formatTanggal";
import { AnimatedNumber } from "./AnimatedNumber";

type KlikHeroProps = {
  branch: string;
  onBranchChange: (value: string) => void;
  options: readonly DatabaseOption[];
};

const OTHER_STATS: {
  icon: typeof ShoppingBagIcon;
  tint: string;
  label: string;
  text: string;
}[] = [
  {
    icon: Clock,
    tint: "bg-chart-2/10 text-chart-2",
    label: "Waktu Puncak",
    text: "19:00 – 21:00",
  },
  {
    icon: Activity,
    tint: "bg-chart-3/10 text-chart-3",
    label: "Konversi",
    text: "18,4%",
  },
  {
    icon: MoonStar,
    tint: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    label: "Retur",
    text: "2,1%",
  },
];

export function KlikHero({ branch, onBranchChange, options }: KlikHeroProps) {
  const today = useMemo(
    () => format(new Date(), "yyyy-MM-dd"),
    // ponytail: hitung sekali per mount; refresh tengah malam (UTC+7) tak ditangani
    [],
  );

  const {
    total: pesananTotal,
    loading: pesananLoading,
    refetch,
  } = useFetchData<{ obi_nopb: string }[]>({
    endpoint: "klik/status-order",
    queryParams: { startDate: today },
  });

  useEffect(
    function refetchOnBranchChange() {
      refetch();
    },
    [branch, refetch],
  );

  useEffect(
    function pollEveryMinute() {
      const id = setInterval(refetch, 60_000);
      return function clearPollInterval() {
        clearInterval(id);
      };
    },
    [refetch],
  );

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-chart-1/10 via-card to-card p-6 shadow-sm md:p-8">
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-chart-1/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-10 size-44 rounded-full bg-chart-3/15 blur-3xl"
        aria-hidden
      />
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border/60">
          <MousePointerClick className="size-3.5 text-chart-1" aria-hidden />
          Evaluasi Klik
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <span
            className="size-2 animate-pulse rounded-full bg-emerald-500"
            aria-hidden
          />
          LIVE
        </span>
        <span className="text-xs text-muted-foreground">
          {FormatTanggal(new Date())}
        </span>
        <div className="ml-auto">
          <SettingsDatabase
            value={branch}
            onChange={onBranchChange}
            options={options}
          />
        </div>
      </div>
      <h1 className="mt-3 flex items-center gap-2 text-2xl font-bold tracking-tight md:text-3xl">
        <Sparkles className="size-6 text-chart-1" aria-hidden />
        Dashboard Klik {branch}
      </h1>
      <p className="mt-1 max-w-xl text-sm text-muted-foreground">
        Pantau performa belanja online — omset, transaksi, dan tren dalam satu
        tampilan.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/70 p-3">
          <span className="rounded-md bg-chart-1/10 p-2 text-chart-1">
            <ShoppingBagIcon className="size-4" aria-hidden />
          </span>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              PB masuk
            </p>
            <p className="text-lg font-bold tabular-nums">
              {pesananLoading ? (
                <span className="inline-block h-5 w-10 animate-pulse rounded bg-muted" />
              ) : (
                <AnimatedNumber value={pesananTotal} />
              )}
            </p>
          </div>
        </div>

        {OTHER_STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/70 p-3">
              <span className={`rounded-md p-2 ${s.tint}`}>
                <Icon className="size-4" aria-hidden />
              </span>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
                <p className="text-lg font-bold tabular-nums">{s.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
