// src/components/klik/PbKlikPerTanggal.tsx
import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { CalendarRange } from "lucide-react";
import type { DateRange } from "react-day-picker";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import ButtonExportExcel from "@/components/ButtonExportExcel";
import { AnimatedNumber } from "@/components/klik/AnimatedNumber";
import { useFetchData } from "@/hooks/data/useFetchData";
import { useExportToExcel } from "@/hooks/useExportToExcel";

type PbKlikRow = {
  obi_tglpb: string;
  belum_send_hh: number;
  proses_picking: number;
  siap_struk_cod: number;
  siap_struk_non_cod: number;
  selesai_struk: number;
  batal: number;
  total_pb: number;
  total_order: number;
  real_order: number;
};

type PbKlikPerTanggalProps = {
  branch: string;
};

type ColumnDef = {
  field: keyof Omit<PbKlikRow, "obi_tglpb">;
  label: string;
  /** warna label header & angka — class Tailwind, sudah termasuk varian dark */
  tone: string;
  /** warna latar kolom kalau nilainya > 0 */
  cellTone: string;
};

// ponytail: label pakai `\n` supaya header pecah 2 baris. Kalau satu baris,
// "Siap Struk Non COD" bikin kolom melebar dan tabel overflow ke kanan.
// Tone warna ikut makna status (sama nuansa dengan PerformaPicker):
// netral → progres → struk → selesai/batal → ringkasan.
const COLUMNS: ColumnDef[] = [
  {
    field: "belum_send_hh",
    label: "Belum Send\nHH",
    tone: "text-slate-600 dark:text-slate-300",
    cellTone: "bg-slate-500/10 text-slate-700 dark:text-slate-200",
  },
  {
    field: "proses_picking",
    label: "Proses\nPicking",
    tone: "text-blue-600 dark:text-blue-400",
    cellTone: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  },
  {
    field: "siap_struk_cod",
    label: "Siap Struk\nCOD",
    tone: "text-indigo-600 dark:text-indigo-400",
    cellTone: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  },
  {
    field: "siap_struk_non_cod",
    label: "Siap Struk\nNon COD",
    tone: "text-violet-600 dark:text-violet-400",
    cellTone: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  },
  {
    field: "selesai_struk",
    label: "Selesai\nStruk",
    tone: "text-emerald-600 dark:text-emerald-400",
    cellTone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  {
    field: "batal",
    label: "Batal",
    tone: "text-rose-600 dark:text-rose-400",
    cellTone: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  },
  {
    field: "total_pb",
    label: "Total\nPB",
    tone: "text-cyan-600 dark:text-cyan-400",
    cellTone: "bg-cyan-500/15 text-cyan-800 dark:text-cyan-200",
  },
  {
    field: "total_order",
    label: "Total\nOrder",
    tone: "text-amber-600 dark:text-amber-400",
    cellTone: "bg-amber-500/15 text-amber-800 dark:text-amber-200",
  },
  {
    field: "real_order",
    label: "Real\nOrder",
    tone: "text-teal-600 dark:text-teal-400",
    cellTone: "bg-teal-500/15 text-teal-800 dark:text-teal-200",
  },
];

function columnLabel(col: ColumnDef) {
  return col.label.split("\n").map((line) => (
    <span key={line} className="block">
      {line}
    </span>
  ));
}

// ponytail: default 7 hari terakhir (termasuk hari ini). pageSize 100 dikirim
// karena endpoint-nya `paginated: true` (default server cuma 10 baris).
// shortcut: range > 100 hari ikut terpotong diam-diam — upgrade ke export/paged
// kalau user butuh rentang lebih panjang.
const PAGE_SIZE = 100;

export function PbKlikPerTanggal({ branch }: PbKlikPerTanggalProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => ({
    from: subDays(new Date(), 6),
    to: new Date(),
  }));
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const {
    data: rows,
    loading,
    refetch,
  } = useFetchData<PbKlikRow[]>({
    endpoint: "klik/pb-klik-per-tgl",
    queryParams: {
      ...(dateRange?.from
        ? { startDate: format(dateRange.from, "yyyy-MM-dd") }
        : {}),
      ...(dateRange?.to ? { endDate: format(dateRange.to, "yyyy-MM-dd") } : {}),
      pageSize: PAGE_SIZE,
    },
  });

  useEffect(
    function refetchOnBranchChange() {
      refetch().then(function markUpdatedAt() {
        setUpdatedAt(new Date());
      });
    },
    [branch, refetch],
  );

  // ponytail: sama seperti TodaySalesCard — polling 1 menit + stempel jam update,
  // biar angka PB tidak nyangkut di data lama tanpa disadari user.
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

  const { handleExport, isExporting } = useExportToExcel({
    title: "PB Klik per Tanggal",
    data: (rows ?? []) as unknown as Record<string, unknown>[],
    columns: [{ field: "obi_tglpb", label: "Tanggal" }, ...COLUMNS],
    mapRow: (row) => {
      const r = row as PbKlikRow;
      return [r.obi_tglpb, ...COLUMNS.map((col) => r[col.field] ?? 0)];
    },
  });

  return (
    <Card className="overflow-hidden border-border/60">
      <CardHeader className="[.border-b]:pb-6">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarRange className="size-4 text-chart-3" aria-hidden />
              PB Klik per Tanggal
            </CardTitle>
            <CardDescription>
              {rows?.length
                ? `Rekap ${rows.length} tanggal PB`
                : "Rekap PB per tanggal penerimaan barang"}
            </CardDescription>
          </div>
          {updatedAt ? (
            <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground/70">
              Diperbarui{" "}
              {updatedAt.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          ) : null}
        </div>
        <div className="col-start-2 row-span-2 row-start-1 flex items-start gap-2 self-start justify-self-end">
          <ButtonExportExcel
            handleExport={handleExport}
            isExporting={isExporting}
            className="mb-0 shrink-0 border-emerald-600/40 bg-emerald-600 py-1 text-xxs whitespace-nowrap text-white shadow-sm hover:bg-emerald-700 hover:text-white dark:border-emerald-500/40 dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:hover:text-white"
          />
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </CardHeader>
      <CardContent className="px-0">
        {loading && !rows ? (
          <div className="space-y-2 px-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-7 animate-pulse rounded bg-muted" />
            ))}
          </div>
        ) : rows && rows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-left text-xs">
              <thead className="sticky top-0 z-10 bg-gradient-to-b from-muted to-muted/70 text-[10px] uppercase tracking-wide shadow-sm backdrop-blur">
                <tr>
                  <th
                    scope="col"
                    className="w-[10%] px-2 py-2.5 text-left text-muted-foreground">
                    Tanggal
                  </th>
                  {COLUMNS.map((col) => (
                    <th
                      key={col.field}
                      scope="col"
                      className={`px-1.5 py-2.5 text-right align-bottom leading-tight ${col.tone}`}>
                      {columnLabel(col)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={row.obi_tglpb}
                    className="animate-fade-up border-t border-border/40 transition-colors hover:bg-muted/40"
                    style={{ animationDelay: `${Math.min(idx * 40, 480)}ms` }}>
                    <td className="px-2 py-1.5">
                      <span className="inline-block rounded-md bg-muted/70 px-1.5 py-0.5 font-semibold tabular-nums text-foreground">
                        {row.obi_tglpb}
                      </span>
                    </td>
                    {COLUMNS.map((col) => {
                      const value = row[col.field] ?? 0;
                      return (
                        <td
                          key={col.field}
                          className={`px-1.5 py-1.5 text-right tabular-nums ${
                            value > 0
                              ? `font-semibold ${col.cellTone}`
                              : "text-muted-foreground/40"
                          } ${value > 0 ? "rounded-md" : ""}`}>
                          <AnimatedNumber value={value} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-6 text-sm text-muted-foreground">
            Tidak ada data pada rentang tanggal ini.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
