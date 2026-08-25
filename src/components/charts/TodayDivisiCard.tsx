// src/components/charts/TodayDivisiCard.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Store } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useFetchData } from "@/hooks/data/useFetchData";

type DivisiRow = {
  namadivisi: string;
  netto: number;
  margin: number;
  jumlah_produk: number;
};

function formatRupiah(value: number): string {
  return Math.round(value).toLocaleString("id-ID");
}

export function TodayDivisiCard({ branch }: { branch?: string }) {
  const { data, refetch } = useFetchData<DivisiRow[]>({
    endpoint: "/evaluasi-sales/today-by-divisi",
  });
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(function refetchOnBranchChange() {
    refetch().then(function markUpdatedAt() {
      setUpdatedAt(new Date());
    });
  }, [branch, refetch]);

  useEffect(function refetchEveryMinute() {
    const id = setInterval(function pollRefetch() {
      refetch().then(function markUpdatedAt() {
        setUpdatedAt(new Date());
      });
    }, 60_000);
    return function stopRefetch() {
      clearInterval(id);
    };
  }, [refetch]);

  const { total, maxNetto } = useMemo(() => {
    const rows = data ?? [];
    return {
      total: rows.reduce(
        (acc, r) => ({
          netto: acc.netto + r.netto,
          margin: acc.margin + r.margin,
          jumlah_produk: acc.jumlah_produk + r.jumlah_produk,
        }),
        { netto: 0, margin: 0, jumlah_produk: 0 },
      ),
      maxNetto: Math.max(1, ...rows.map((r) => r.netto)),
    };
  }, [data]);

  return (
    <Card className="flex h-full flex-col overflow-hidden border-border/60 bg-gradient-to-b from-primary/5 via-card to-card transition-shadow duration-200 hover:shadow-md">
      <CardContent className="flex h-full flex-col p-3">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-md bg-muted/60 p-1.5 text-chart-1">
            <Store className="size-3.5" aria-hidden />
          </span>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Sales Hari Ini per Divisi
          </p>
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

        {!data ? (
          <div className="flex-1 space-y-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-6 animate-pulse rounded bg-muted" />
            ))}
            <div className="pt-2" />
          </div>
        ) : data.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">
            Belum ada transaksi hari ini
          </p>
        ) : (
          <div className="flex flex-1 flex-col">
            <div className="flex-1 space-y-2">
              {data.map((row, i) => (
                <div
                  key={row.namadivisi}
                  className="rounded-lg border border-transparent px-1.5 py-1.5 transition-colors duration-150 hover:border-border/60 hover:bg-muted/40"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="flex min-w-0 items-center gap-1.5 font-medium">
                      <span
                        className={`size-2 shrink-0 rounded-full ${
                          ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"][i % 5]
                        }`}
                        aria-hidden
                      />
                      <span className="truncate">{row.namadivisi}</span>
                    </span>
                    <span className="shrink-0 tabular-nums">
                      <span className="font-semibold">{formatRupiah(row.netto)}</span>
                      <span className="ml-2 text-muted-foreground">
                        M {formatRupiah(row.margin)}
                      </span>
                      <span className="ml-2 text-muted-foreground">
                        P {row.jumlah_produk.toLocaleString("id-ID")}
                      </span>
                    </span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted/60">
                    <div
                      className={`h-full rounded-full ${
                        ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"][i % 5]
                      }`}
                      style={{ width: `${Math.round((row.netto / maxNetto) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-2 text-xs font-semibold">
              <span>Total</span>
              <span className="tabular-nums">
                {formatRupiah(total.netto)}
                <span className="ml-2 font-normal text-muted-foreground">
                  M {formatRupiah(total.margin)}
                </span>
                <span className="ml-2 font-normal text-muted-foreground">
                  P {total.jumlah_produk.toLocaleString("id-ID")}
                </span>
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
