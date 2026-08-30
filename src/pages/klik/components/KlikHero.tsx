// src/pages/klik/components/KlikHero.tsx
"use client";

import { useEffect, useMemo } from "react";
import { addMonths, format } from "date-fns";
import {
  CircleDollarSign,
  MousePointerClick,
  Percent,
  ShoppingBagIcon,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import SettingsDatabase from "@/components/Settings/SettingsDatabase";
import type { DatabaseOption } from "@/configs/database-options";
import { useFetchData } from "@/hooks/data/useFetchData";
import { FormatTanggal } from "@/utils/formatTanggal";
import { KpiTile } from "./KpiTile";

type KlikHeroProps = {
  branch: string;
  onBranchChange: (value: string) => void;
  options: readonly DatabaseOption[];
};

type SalesHarianRow = { tgl: string; nett: number };
type PertumbuhanRow = { bulan: string; nett: number; margin: number };

export function KlikHero({ branch, onBranchChange, options }: KlikHeroProps) {
  const today = useMemo(
    () => format(new Date(), "yyyy-MM-dd"),
    // ponytail: hitung sekali per mount; refresh tengah malam (UTC+7) tak ditangani
    [],
  );
  const yesterday = useMemo(
    () => format(new Date(Date.now() - 86_400_000), "yyyy-MM-dd"),
    // ponytail: satu hari sebelum hari ini; tengah malam tak ditangani
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

  const {
    data: salesData,
    loading: salesLoading,
    refetch: refetchSales,
  } = useFetchData<SalesHarianRow[]>({
    endpoint: "klik/sales-harian",
    queryParams: { startDate: yesterday, endDate: today },
  });

  const salesHarian = useMemo(() => {
    const byTgl = new Map((salesData ?? []).map((r) => [r.tgl, r.nett]));
    return {
      hariIni: byTgl.get(format(new Date(), "dd-MM-yyyy")) ?? 0,
      kemarin:
        byTgl.get(format(new Date(Date.now() - 86_400_000), "dd-MM-yyyy")) ?? 0,
    };
  }, [salesData]);

  const {
    data: pertumbuhanData,
    loading: pertumbuhanLoading,
    refetch: refetchPertumbuhan,
  } = useFetchData<PertumbuhanRow[]>({
    endpoint: "klik/pertumbuhan",
  });

  const pertumbuhan = useMemo(() => {
    const byBulan = new Map(
      (pertumbuhanData ?? []).map((r) => [r.bulan, r]),
    );
    const ini = byBulan.get(format(new Date(), "yyyy-MM"));
    const lalu = byBulan.get(format(addMonths(new Date(), -1), "yyyy-MM"));
    const pct = (cur: number | undefined, prev: number | undefined) =>
      prev && prev !== 0 && cur !== undefined
        ? ((cur - prev) / prev) * 100
        : 0;
    return {
      sales: pct(ini?.nett, lalu?.nett),
      margin: pct(ini?.margin, lalu?.margin),
    };
  }, [pertumbuhanData]);

  useEffect(
    function refetchOnBranchChange() {
      refetch();
      refetchSales();
      refetchPertumbuhan();
    },
    // ponytail: refetch semua saat branch berganti
    [branch, refetch, refetchSales, refetchPertumbuhan],
  );

  useEffect(
    function pollEveryMinute() {
      const id = setInterval(() => {
        refetch();
        refetchSales();
        refetchPertumbuhan();
      }, 60_000);
      return function clearPollInterval() {
        clearInterval(id);
      };
    },
    [refetch, refetchSales, refetchPertumbuhan],
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

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        <KpiTile
          icon={ShoppingBagIcon}
          tint="bg-chart-1/10 text-chart-1"
          label="PB masuk"
          value={pesananTotal}
          loading={pesananLoading}
          // ponytail: aksi navigasi belum ada — ganti dengan route ke halaman detail PB nanti
          onClick={() => {}}
        />
        <KpiTile
          icon={CircleDollarSign}
          tint="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          label="Sales Hari Ini"
          value={salesHarian.hariIni}
          prefix="Rp "
          loading={salesLoading}
          onClick={() => {}}
        />
        <KpiTile
          icon={CircleDollarSign}
          tint="bg-chart-2/10 text-chart-2"
          label="Sales Kemarin"
          value={salesHarian.kemarin}
          prefix="Rp "
          loading={salesLoading}
          onClick={() => {}}
        />
        <KpiTile
          icon={TrendingUp}
          tint="bg-chart-3/10 text-chart-3"
          label="Pertumbuhan Sales Bulan Ini"
          value={`${Math.round(pertumbuhan.sales)}%`}
          loading={pertumbuhanLoading}
          onClick={() => {}}
        />
        <KpiTile
          icon={Percent}
          tint="bg-chart-1/10 text-chart-1"
          label="Pertumbuhan Margin Bulan Ini"
          value={`${Math.round(pertumbuhan.margin)}%`}
          loading={pertumbuhanLoading}
          onClick={() => {}}
        />
      </div>
    </section>
  );
}
