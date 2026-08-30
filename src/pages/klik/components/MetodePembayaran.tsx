// src/pages/klik/components/MetodePembayaran.tsx
"use client";

import { Wallet } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedNumber } from "./AnimatedNumber";
import { DUMMY_METODE } from "./data";
import { formatRupiah } from "./format";

export function MetodePembayaran() {
  return (
    <Card className="overflow-hidden border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="size-4 text-chart-2" aria-hidden />
          Metode Pembayaran
        </CardTitle>
        <CardDescription>Distribusi omset per metode</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {DUMMY_METODE.map((m) => (
          <div key={m.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium">{m.label}</span>
              <span className="tabular-nums text-muted-foreground">
                {formatRupiah(m.value)} <span className="text-xs">({m.percent}%)</span>
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted/60">
              <div
                className={`h-full rounded-full ${m.color}`}
                style={{ width: `${m.percent}%` }}
              />
            </div>
          </div>
        ))}
        <div className="mt-2 rounded-lg bg-gradient-to-br from-primary/5 to-card p-3 text-center">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Omset Online Total
          </p>
          <p className="text-xl font-bold tabular-nums text-chart-1">
            <AnimatedNumber value={485_000_000} />
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
