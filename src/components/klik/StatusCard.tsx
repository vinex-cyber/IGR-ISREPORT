// src/components/klik/StatusCard.tsx
import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ButtonExportExcel from "@/components/ButtonExportExcel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFetchData } from "@/hooks/data/useFetchData";
import { useExportToExcel } from "@/hooks/useExportToExcel";
import { FormatTanggal } from "@/utils/formatTanggal";
import { AnimatedNumber } from "./AnimatedNumber";

type StatusCardProps = {
  title: string;
  label: string;
  count?: number;
  loading?: boolean;
  detailParams: Record<string, string | number>;
};

type DetailRow = {
  status: string;
  /** Unik per transaksi (obi_notrans + yyyymmdd) — jangan pakai `trx` sebagai key
   *  React: satu PB bisa punya banyak trans (mis. COD) sehingga key bentrok. */
  obi_key?: string;
  trx: string;
  obi_tglpb: string;
  obi_kdmember: string;
  cus_namamember: string;
  obi_tipebayar: string;
  obi_shippingservice: string;
  obi_itemorder: string | number;
  obi_nopb: string;
  obi_notrans: string;
};

const statusConfig: Record<
  string,
  { color: string; bg: string; border: string; grad: string; icon: string }
> = {
  "SIAP PICKING": {
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-500/30",
    border: "border-emerald-300",
    grad: "from-emerald-500/40 via-emerald-500/10 to-transparent",
    icon: "📦",
  },
  "SIAP SCANNING": {
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-500/30",
    border: "border-blue-300",
    grad: "from-blue-500/40 via-blue-500/10 to-transparent",
    icon: "📱",
  },
  "SIAP DRAFT STRUK": {
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-500/30",
    border: "border-amber-300",
    grad: "from-amber-500/40 via-amber-500/10 to-transparent",
    icon: "📝",
  },
  "SIAP STRUK": {
    color: "text-indigo-700 dark:text-indigo-400",
    bg: "bg-indigo-500/30",
    border: "border-indigo-300",
    grad: "from-indigo-500/40 via-indigo-500/10 to-transparent",
    icon: "🧾",
  },
  "SELESAI STRUK": {
    color: "text-green-700 dark:text-green-400",
    bg: "bg-green-500/30",
    border: "border-green-300",
    grad: "from-green-500/40 via-green-500/10 to-transparent",
    icon: "✅",
  },
  "COD BELUM SELESAI": {
    color: "text-orange-700 dark:text-orange-400",
    bg: "bg-orange-500/30",
    border: "border-orange-300",
    grad: "from-orange-500/40 via-orange-500/10 to-transparent",
    icon: "💰",
  },
  "BELUM SERAH": {
    color: "text-rose-700 dark:text-rose-400",
    bg: "bg-rose-500/30",
    border: "border-rose-300",
    grad: "from-rose-500/40 via-rose-500/10 to-transparent",
    icon: "🚚",
  },
};

const ENDPOINT = "klik/status-order";

export function StatusCard({
  title,
  label,
  count,
  loading,
  detailParams,
}: StatusCardProps) {
  const [open, setOpen] = useState(false);
  const cfg = statusConfig[label] ?? statusConfig["SIAP PICKING"];

  const {
    data: rows,
    total,
    loading: detailLoading,
    refetch,
  } = useFetchData<DetailRow[]>({
    endpoint: ENDPOINT,
    queryParams: { ...detailParams, pageSize: 100 },
    enabled: open,
  });

  useEffect(
    function refetchWhenModalOpens() {
      if (open) refetch();
    },
    [open, refetch],
  );

  // shortcut: export mengikuti isi tabel modal (pageSize 100) — naikkan pageSize
  // atau pakai fetchAll bila perlu export seluruh data
  const { handleExport, isExporting } = useExportToExcel({
    title: `Detail ${title}`,
    data: (rows ?? []) as unknown as Record<string, unknown>[],
    columns: [
      { field: "status", label: "Status" },
      { field: "obi_tglpb", label: "Tgl" },
      { field: "trx", label: "Trx" },
      { field: "obi_nopb", label: "No PB" },
      { field: "obi_kdmember", label: "Member" },
      { field: "cus_namamember", label: "Nama Member" },
      { field: "obi_tipebayar", label: "Tipe" },
      { field: "obi_shippingservice", label: "Service" },
      { field: "obi_itemorder", label: "Item", isNumeric: true },
    ],
    mapRow: (row) => {
      const r = row as unknown as DetailRow;
      return [
        r.status,
        FormatTanggal(r.obi_tglpb),
        r.trx,
        r.obi_nopb,
        r.obi_kdmember,
        r.cus_namamember,
        r.obi_tipebayar,
        r.obi_shippingservice,
        Number(r.obi_itemorder) || 0,
      ];
    },
  });

  return (
    <Card
      className={`group relative overflow-hidden border ${cfg.border} bg-gradient-to-br ${cfg.grad} shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl h-full flex flex-col`}>
      <CardContent className="p-4 flex flex-1 flex-col">
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-tl ${cfg.grad} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
          aria-hidden
        />
        <div className="relative flex h-9 items-center gap-2">
          <span
            className={`shrink-0 rounded-lg p-2 text-base leading-none ${cfg.bg} transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110`}
            aria-hidden>
            {cfg.icon}
          </span>
          <p className="line-clamp-2 text-sm font-semibold leading-tight text-foreground">
            {title}
          </p>
        </div>

        <div className="mt-2 flex flex-1 items-end justify-between gap-2">
          <div className="flex min-w-0 flex-col">
            <span className="text-2xl font-extrabold tabular-nums tracking-tight text-foreground">
              {count === undefined ? (
                <span
                  className="relative inline-block h-9 w-16 overflow-hidden rounded-md bg-muted"
                  aria-hidden>
                  <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
                </span>
              ) : (
                <AnimatedNumber value={count} />
              )}
            </span>
            {loading && count !== undefined && (
              <span className="mt-0.5 inline-flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                <Loader2 className="size-3 animate-spin" aria-hidden />
                menyegarkan...
              </span>
            )}
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`shrink-0 cursor-pointer gap-1 text-xs font-semibold ${cfg.color} hover:bg-card`}>
                Detail
                <ArrowRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl sm:max-w-7xl xl:max-w-[92vw]">
              <DialogHeader className="flex-row items-start justify-between gap-4 space-y-0 pr-12">
                <div className="min-w-0">
                  <DialogTitle>{title}</DialogTitle>
                  <DialogDescription>
                    Detail {title.toLowerCase()} — {total ?? 0} data
                  </DialogDescription>
                </div>
                <ButtonExportExcel
                  handleExport={handleExport}
                  isExporting={isExporting}
                  className="mb-0 shrink-0 border-emerald-600/40 bg-emerald-600 py-1 text-xxs whitespace-nowrap text-white shadow-sm hover:bg-emerald-700 hover:text-white dark:border-emerald-500/40 dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:text-white"
                />
              </DialogHeader>
              <div className="max-h-[70vh] overflow-auto rounded-lg border border-border/60">
                {detailLoading ? (
                  <p className="p-4 text-sm text-muted-foreground">
                    Memuat data...
                  </p>
                ) : rows && rows.length > 0 ? (
                  <table className="w-full text-left text-sm text-muted-foreground">
                    <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th scope="col" className="px-4 py-3">
                          No
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Status
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Tgl
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Trx
                        </th>
                        <th scope="col" className="px-4 py-3">
                          No Trans
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Member
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Tipe
                        </th>
                        <th scope="col" className="px-4 py-3">
                          Service
                        </th>
                        <th scope="col" className="px-4 py-3 text-right">
                          Item
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, idx) => (
                        <tr
                          key={
                            row.obi_key ??
                            `${row.trx}-${row.obi_kdmember}-${row.obi_tglpb}-${row.obi_nopb}-${idx}`
                          }
                          className="border-t border-border/50">
                          <td className="px-4 py-3">{idx + 1}</td>
                          <td className="px-4 py-3">{row.status}</td>
                          <td className="px-4 py-3 whitespace-nowrap tabular-nums">
                            {FormatTanggal(row.obi_tglpb)}
                          </td>
                          <td className="px-4 py-3">{row.trx}</td>
                          <td className="px-4 py-3">{row.obi_notrans}</td>
                          <td className="px-4 py-3">
                            {row.obi_kdmember} - {row.cus_namamember}
                          </td>
                          <td className="px-4 py-3">{row.obi_tipebayar}</td>
                          <td className="px-4 py-3">
                            {row.obi_shippingservice}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums">
                            {Intl.NumberFormat("id-ID").format(
                              Number(row.obi_itemorder) || 0,
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="p-4 text-sm text-muted-foreground">
                    Tidak ada data.
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <p className="mt-auto pt-1.5 min-h-4 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
          diluar PB member TMI
        </p>
      </CardContent>
    </Card>
  );
}
