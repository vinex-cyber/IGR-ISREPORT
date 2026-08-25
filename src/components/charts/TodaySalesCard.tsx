// src/components/charts/TodaySalesCard.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ShoppingCart, Users, Receipt, Wallet, Package } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useAnimeCounter } from "@/hooks/animation/useAnimeCounter";
import { useFetchData } from "@/hooks/data/useFetchData";

type MemberRow = {
  jenis: string;
  tanggal: string;
  jumlah_member: number;
  jumlah_struk: number;
  jumlah_produk: number;
  total_qty: number;
  total_gross: number;
  total_netto: number;
  total_margin: number;
  jumlah_kasir: number;
};

type StatItem = {
  key: string;
  label: string;
  value: number;
  icon: typeof Wallet;
  accentClass: string;
};

function StatCounter({ value }: { value: number }) {
  const rounded = useMemo(() => Math.round(Number(value)), [value]);
  const { value: animated } = useAnimeCounter({ to: rounded });
  return <span>{animated.toLocaleString("id-ID")}</span>;
}

const SECTION_ORDER = [
  "MEMBER MERAH",
  "END USER",
  "IDM",
  "OMI",
  "OTHER",
] as const;

const SECTION_DOT: Record<string, string> = {
  "MEMBER MERAH": "bg-red-500",
  "END USER": "bg-blue-500",
  IDM: "bg-violet-500",
  OMI: "bg-amber-500",
  OTHER: "bg-muted-foreground/50",
};

function sectionTitle(jenis: string): string {
  if (jenis === "MEMBER MERAH") return "Member Merah";
  if (jenis === "END USER") return "End User";
  return jenis.charAt(0) + jenis.slice(1).toLowerCase();
}

function toStats(row: MemberRow): StatItem[] {
  return [
    {
      key: "netto",
      label: "Sales",
      value: row.total_netto,
      icon: ShoppingCart,
      accentClass: "text-chart-1",
    },
    {
      key: "margin",
      label: "Margin",
      value: row.total_margin,
      icon: Wallet,
      accentClass: "text-chart-2",
    },
    {
      key: "struk",
      label: "Struk",
      value: row.jumlah_struk,
      icon: Receipt,
      accentClass: "text-chart-3",
    },
    {
      key: "produk",
      label: "Produk",
      value: row.jumlah_produk,
      icon: Package,
      accentClass: "text-chart-4",
    },
    {
      key: "member",
      label: "Member",
      value: row.jumlah_member,
      icon: Users,
      accentClass: "text-chart-5",
    },
  ];
}

function sumRows(rows: MemberRow[], tanggal: string): MemberRow {
  return rows.reduce<MemberRow>(
    (acc, r) => ({
      jenis: "TOTAL",
      tanggal,
      jumlah_member: acc.jumlah_member + r.jumlah_member,
      jumlah_struk: acc.jumlah_struk + r.jumlah_struk,
      jumlah_produk: acc.jumlah_produk + r.jumlah_produk,
      total_qty: acc.total_qty + r.total_qty,
      total_gross: acc.total_gross + r.total_gross,
      total_netto: acc.total_netto + r.total_netto,
      total_margin: acc.total_margin + r.total_margin,
      jumlah_kasir: 0,
    }),
    {
      jenis: "TOTAL",
      tanggal,
      jumlah_member: 0,
      jumlah_struk: 0,
      jumlah_produk: 0,
      total_qty: 0,
      total_gross: 0,
      total_netto: 0,
      total_margin: 0,
      jumlah_kasir: 0,
    },
  );
}

function StatsRow({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.key} className="flex items-center gap-2">
            <span
              className={`rounded-md bg-muted/60 p-1.5 ${stat.accentClass}`}>
              <Icon className="size-3.5" aria-hidden />
            </span>
            <div>
              <p className="text-[10px] leading-tight text-muted-foreground">
                {stat.label}
              </p>
              <p className="text-sm font-semibold tracking-tight tabular-nums">
                <StatCounter value={stat.value} />
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SectionLabel({ text, dotClass }: { text: string; dotClass?: string }) {
  return (
    <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
      {dotClass ? (
        <span className={`size-1.5 rounded-full ${dotClass}`} aria-hidden />
      ) : null}
      {text}
    </p>
  );
}

export function TodaySalesCard({ branch }: { branch?: string }) {
  const { data, refetch } = useFetchData<MemberRow[]>({
    endpoint: "/evaluasi-sales/today-by-member",
  });
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const hasAnnouncedRef = useRef(false);

  useEffect(function announceKasirClosed() {
    if (!data) return;
    const kasir = data[0]?.jumlah_kasir ?? 1;
    if (kasir > 0) {
      hasAnnouncedRef.current = false;
      return;
    }
    if (hasAnnouncedRef.current) return;
    hasAnnouncedRef.current = true;
    const voices = window.speechSynthesis.getVoices();
    const idVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith("id")) ?? null;
    for (let i = 0; i < 3; i++) {
      const utterance = new SpeechSynthesisUtterance(
        "Kasir sudah tutup semua, silakan proses Create MA",
      );
      utterance.lang = "id-ID";
      if (idVoice) utterance.voice = idVoice;
      window.speechSynthesis.speak(utterance);
    }
  }, [data]);

  useEffect(
    function refetchOnBranchChange() {
      refetch().then(function markUpdatedAt() {
        setUpdatedAt(new Date());
      });
    },
    [branch, refetch],
  );

  useEffect(
    function refetchEveryMinute() {
      const id = setInterval(function pollRefetch() {
        refetch().then(function markUpdatedAt() {
          setUpdatedAt(new Date());
        });
      }, 60_000);
      return function stopRefetch() {
        clearInterval(id);
      };
    },
    [refetch],
  );

  if (!data) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center gap-3 p-3">
          <div className="size-8 animate-pulse rounded bg-muted" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-28 animate-pulse rounded bg-muted" />
            <div className="h-5 w-40 animate-pulse rounded bg-muted" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) return null;

  const first = data[0];
  const total = sumRows(data, first.tanggal);
  total.jumlah_kasir = first.jumlah_kasir;
  const sections = SECTION_ORDER.filter((jenis) =>
    data.some((r) => r.jenis === jenis),
  );

  return (
    <Card className="overflow-hidden border-border/60 bg-gradient-to-r from-primary/5 via-card to-card transition-shadow duration-200 hover:shadow-md">
      <CardContent className="space-y-2 p-3">
        <div>
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span
              className={`-mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                total.jumlah_kasir > 0
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/10 text-red-600 dark:text-red-400"
              }`}>
              <span
                className={`size-2 rounded-full ${
                  total.jumlah_kasir > 0
                    ? "bg-emerald-500 animate-pulse"
                    : "bg-red-500"
                }`}
                aria-hidden
              />
              {total.jumlah_kasir} kasir aktif
            </span>
            {updatedAt ? (
              <span className="ml-auto text-[10px] tabular-nums text-muted-foreground/70">
                Diperbarui{" "}
                {updatedAt.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            ) : null}
          </div>
          <StatsRow stats={toStats(total)} />
        </div>

        {sections.map((jenis) => {
          const row = data.find((r) => r.jenis === jenis);
          if (!row) return null;
          return (
            <div key={jenis} className="border-t border-border/40 pt-2">
              <SectionLabel
                text={sectionTitle(jenis)}
                dotClass={SECTION_DOT[jenis]}
              />
              <StatsRow stats={toStats(row)} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
