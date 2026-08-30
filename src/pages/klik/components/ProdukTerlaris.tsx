// src/pages/klik/components/ProdukTerlaris.tsx
"use client";

import { useEffect } from "react";
import { Package } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFetchData } from "@/hooks/data/useFetchData";
import { formatRupiah } from "./format";

type ProdukTerlarisRow = {
  rank: number;
  prdcd_ctn: string;
  nama: string;
  frac: number;
  qty: number;
  omzet: number;
};

type ProdukTerlarisProps = {
  branch: string;
};

function formatQtyCtn(qty: number, frac: number): string {
  const f = Math.max(1, frac || 1);
  const ctn = Math.floor(qty / f);
  const sisa = Math.round(qty % f);
  return sisa > 0 ? `${ctn.toLocaleString("id-ID")} ctn, ${sisa} pcs` : `${ctn.toLocaleString("id-ID")} ctn`;
}

export function ProdukTerlaris({ branch }: ProdukTerlarisProps) {
  const {
    data: rows,
    loading,
    refetch,
  } = useFetchData<ProdukTerlarisRow[]>({
    endpoint: "klik/produk-terlaris",
  });

  useEffect(
    function refetchOnBranchChange() {
      refetch();
    },
    [branch, refetch],
  );

  return (
    <Card className="overflow-hidden border-border/60 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="size-4 text-chart-4" aria-hidden />
          Produk Terlaris
        </CardTitle>
        <CardDescription>Peringkat berdasarkan omzet &amp; qty</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading && !rows ? (
          <p className="text-sm text-muted-foreground">Memuat data…</p>
        ) : (
          rows?.map((t) => (
            <div
              key={t.prdcd_ctn}
              className="flex items-center gap-3 rounded-lg border border-transparent px-2 py-2 transition-colors hover:border-border/60 hover:bg-muted/40">
              <span className="w-6 shrink-0 text-center text-sm" aria-hidden>
                {t.rank === 1 ? "🥇" : t.rank === 2 ? "🥈" : t.rank === 3 ? "🥉" : t.rank}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {t.prdcd_ctn.replace(/^0/, "")} - {t.nama.toLowerCase()}
                </p>
                <p className="text-xs tabular-nums text-muted-foreground">
                  {formatQtyCtn(t.qty, t.frac)}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums">
                {formatRupiah(t.omzet)}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
