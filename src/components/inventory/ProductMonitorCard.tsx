// src/components/inventory/ProductMonitorCard.tsx
import type { ReactNode } from "react";

import { MetricTile } from "@/components/MetricTile";

export type MonitorStatus =
  | "oos-no-po"
  | "oos-po"
  | "defisit"
  | "tanpa-po"
  | "aman";

export const MONITOR_STATUS_ORDER: MonitorStatus[] = [
  "oos-no-po",
  "oos-po",
  "defisit",
  "tanpa-po",
  "aman",
];

export const MONITOR_STATUS: Record<
  MonitorStatus,
  { label: string; badge: string; meter: string }
> = {
  "oos-no-po": {
    label: "OOS · tanpa PO",
    badge:
      "bg-red-100 text-red-700 ring-red-200 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-500/30",
    meter: "bg-red-500",
  },
  "oos-po": {
    label: "OOS · ada PO",
    badge:
      "bg-orange-100 text-orange-700 ring-orange-200 dark:bg-orange-500/15 dark:text-orange-300 dark:ring-orange-500/30",
    meter: "bg-orange-500",
  },
  defisit: {
    label: "Defisit",
    badge:
      "bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30",
    meter: "bg-amber-500",
  },
  "tanpa-po": {
    label: "Tanpa PO",
    badge:
      "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-500/15 dark:text-slate-300 dark:ring-slate-500/30",
    meter: "bg-slate-400",
  },
  aman: {
    label: "Aman",
    badge:
      "bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30",
    meter: "bg-emerald-500",
  },
};

/**
 * Status monitoring: kondisi stok kosong harus terlihat sebagai OOS,
 * sedangkan defisit menunjukkan stok tersedia yang belum mencapai PKM.
 */
export function getMonitorStatus(
  stock: number,
  po: number,
  pkm: number,
): MonitorStatus {
  if (stock <= 0) return po === 0 ? "oos-no-po" : "oos-po";
  if (stock + po < pkm) return "defisit";
  return po === 0 ? "tanpa-po" : "aman";
}

export type ProductMonitorMetric = {
  label: string;
  value: string;
  tone?: string;
};

type ProductMonitorCardProps = {
  rank: number;
  plu: string;
  divLabel: string;
  name: string;
  tag?: string | null;
  supplier?: string | null;
  monitoring?: string | null;
  status: MonitorStatus;
  metrics: ProductMonitorMetric[];
  /** 0–100, panjang bar cakupan stok + PO vs PKM */
  coverage: number;
  /** kolom aksi kanan (mis. saran PB + input qty) */
  actions?: ReactNode;
};

export function ProductMonitorCard({
  rank,
  plu,
  divLabel,
  name,
  tag,
  supplier,
  monitoring,
  status,
  metrics,
  coverage,
  actions,
}: ProductMonitorCardProps) {
  const meta = MONITOR_STATUS[status];

  return (
    <article className="relative grid gap-2 overflow-hidden rounded-lg border border-border/60 bg-card p-2 pl-4 shadow-sm transition-all hover:shadow-md lg:grid-cols-[minmax(0,1fr)_150px]">
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-1 ${meta.meter}`}
      />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
          <span className="text-[10px] font-semibold tabular-nums text-muted-foreground">
            {String(rank).padStart(2, "0")}
          </span>
          <span
            className={`rounded-full px-1.5 py-0 text-[9px] font-semibold ring-1 ring-inset ${meta.badge}`}>
            {meta.label}
          </span>
          <span className="rounded bg-muted/60 px-1 py-0 font-mono text-[9px] text-blue-600 dark:text-blue-400">
            {plu}
          </span>
          <span className="truncate text-[10px] text-muted-foreground">
            {divLabel}
          </span>
          {tag ? (
            <span className="rounded bg-muted/60 px-1 py-0 text-[9px] font-semibold text-muted-foreground">
              Tag {tag}
            </span>
          ) : null}
        </div>

        <h2
          className="mt-1 line-clamp-1 text-xs font-semibold leading-snug"
          title={name}>
          {name}
        </h2>

        <div className="mt-0.5 flex items-baseline justify-between gap-2">
          <p className="truncate text-[10px] text-muted-foreground">
            Supplier: {supplier || "-"}
            {monitoring ? ` · Monitoring: ${monitoring}` : ""}
          </p>
          <span className="shrink-0 text-[9px] text-muted-foreground">
            Cakupan{" "}
            <strong className="tabular-nums text-foreground">{coverage}%</strong>
          </span>
        </div>

        <dl className="mt-1.5 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
          {metrics.map((m) => (
            <MetricTile
              key={m.label}
              label={m.label}
              value={m.value}
              tone={m.tone}
            />
          ))}
        </dl>

        <div
          className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted"
          title={`Cakupan stok + PO vs PKM: ${coverage}%`}>
          <div
            className={`h-full rounded-full transition-all ${meta.meter}`}
            style={{ width: `${coverage}%` }}
          />
        </div>
      </div>

      <div className="flex items-end justify-between gap-1.5 border-t border-border/60 pt-2 lg:flex-col lg:items-stretch lg:justify-start lg:border-l lg:border-t-0 lg:pl-2 lg:pt-0">
        {actions}
      </div>
    </article>
  );
}
