// src/components/inventory/StatCard.tsx

import type { ComponentType } from "react";

import { useAnimeCounter } from "@/hooks/animation/useAnimeCounter";
import { cn } from "@/lib/utils";

const TONES = {
  sky: {
    badge:
      "bg-sky-500/10 text-sky-600 ring-sky-500/20 dark:text-sky-300",
    glow: "bg-sky-500/20",
    text: "text-sky-500",
    bar: "from-sky-500/80 via-sky-400/30",
  },
  rose: {
    badge:
      "bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:text-rose-300",
    glow: "bg-rose-500/20",
    text: "text-rose-500",
    bar: "from-rose-500/80 via-rose-400/30",
  },
  amber: {
    badge:
      "bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-300",
    glow: "bg-amber-500/20",
    text: "text-amber-500",
    bar: "from-amber-500/80 via-amber-400/30",
  },
  emerald: {
    badge:
      "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300",
    glow: "bg-emerald-500/20",
    text: "text-emerald-500",
    bar: "from-emerald-500/80 via-emerald-400/30",
  },
} as const;

export type StatCardTone = keyof typeof TONES;

type StatCardProps = {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  value: string | number;
  hint?: string;
  tone?: StatCardTone;
};

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "sky",
}: StatCardProps) {
  const t = TONES[tone];
  const { value: animated } = useAnimeCounter({
    to: typeof value === "number" ? value : 0,
  });
  const display =
    typeof value === "number"
      ? Math.round(animated).toLocaleString("id-ID")
      : value;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-muted/40 p-4 shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-border hover:shadow-xl">
      <span
        className={cn(
          "pointer-events-none absolute -right-8 -top-10 size-28 rounded-full opacity-60 blur-2xl transition-opacity duration-300 group-hover:opacity-100",
          t.glow,
        )}
        aria-hidden
      />
      <Icon
        className={cn(
          "pointer-events-none absolute -bottom-4 -right-2 size-20 opacity-[0.07] transition-transform duration-300 group-hover:scale-110",
          t.text,
        )}
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold leading-none tracking-tight tabular-nums">
            {display}
          </p>
          {hint ? (
            <p className="mt-2.5 inline-flex max-w-full items-center gap-1.5 rounded-full bg-muted/60 px-2 py-0.5 text-[10px] text-muted-foreground">
              <span className={cn("size-1.5 rounded-full", t.glow)} />
              <span className="truncate">{hint}</span>
            </p>
          ) : null}
        </div>
        <span
          className={cn(
            "shrink-0 rounded-xl p-2 ring-1 ring-inset transition-transform duration-200 group-hover:rotate-3 group-hover:scale-110",
            t.badge,
          )}>
          <Icon className="size-8" aria-hidden />
        </span>
      </div>

      <span
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r to-transparent",
          t.bar,
        )}
        aria-hidden
      />
    </div>
  );
}
