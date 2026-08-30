// src/pages/klik/components/KpiTile.tsx
"use client";

import type { ComponentType, MouseEventHandler } from "react";

import { AnimatedNumber } from "./AnimatedNumber";

type KpiTileProps = {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  tint: string;
  label: string;
  value: string | number;
  loading?: boolean;
  prefix?: string;
  suffix?: string;
  delta?: number;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

// ponytail: tile KPI kecil reusable (ikon + label + nilai, opsi prefix/suffix/delta %).
// hover:lokal + cursor pointer via button; onClick ambil alih navigasi/aksi di tempat lain.
export function KpiTile({
  icon: Icon,
  tint,
  label,
  value,
  loading,
  prefix = "",
  suffix = "",
  delta,
  onClick,
}: KpiTileProps) {
  const content = (
    <>
      <span className={`rounded-md p-2 ${tint}`}>
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {loading ? (
          <span className="inline-block h-5 w-10 animate-pulse rounded bg-muted" />
        ) : (
          <>
            {typeof value === "number" ? (
              <p className="text-lg font-bold tabular-nums">
                <AnimatedNumber value={value} prefix={prefix} />
                {suffix}
              </p>
            ) : (
              <p className="text-lg font-bold tabular-nums">{value}</p>
            )}
            {typeof delta === "number" && (
              <p
                className={`mt-0.5 inline-flex items-center gap-1 text-xs font-semibold ${
                  delta >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}%
              </p>
            )}
          </>
        )}
      </div>
    </>
  );

  const base =
    "flex items-center gap-3 rounded-xl border border-border/60 bg-card/70 p-3 hover:cursor-pointer";
  const interactive =
    " text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-card hover:shadow-md";
  const classes = onClick ? base + interactive : base + " cursor-default";

  return onClick ? (
    <button type="button" className={classes} onClick={onClick}>
      {content}
    </button>
  ) : (
    <div className={classes}>{content}</div>
  );
}
