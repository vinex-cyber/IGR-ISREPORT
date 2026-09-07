// src/pages/klik/components/PerformaPicker.tsx
"use client";

import { useEffect, useState } from "react";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { UserCheck } from "lucide-react";
import type { DateRange } from "react-day-picker";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useFetchData } from "@/hooks/data/useFetchData";

type PerformaPickerRow = {
  rank: number;
  picker: string;
  nama: string;
  pb: number;
  totalpb: number;
};

type PickerDetailRow = {
  username: string;
  obi_recid: string;
  obi_nopb: string;
  obi_tglpb: string;
  obi_tgltrans: string;
  obi_notrans: string;
  obi_itemorder: number;
  obi_realitem: number;
  pick_dt: string | null;
  close_dt: string | null;
};

type PerformaPickerProps = {
  branch: string;
};

const MEDALS = ["🥇", "🥈", "🥉"];

const RECID_STYLE: Record<string, string> = {
  "1": "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  "2": "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400",
  "3": "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  "5": "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400",
  "6": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
};

function recidBadgeClass(recid: string): string {
  return RECID_STYLE[recid] ?? "bg-muted text-muted-foreground";
}

function formatDateTime(value?: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : format(date, "dd/MM/yyyy HH:mm");
}

export function PerformaPicker({ branch }: PerformaPickerProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => ({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  }));
  const [selected, setSelected] = useState<string | null>(null);

  const {
    data: rows,
    loading,
    refetch,
  } = useFetchData<PerformaPickerRow[]>({
    endpoint: "klik/performa-picker",
    queryParams: {
      ...(dateRange?.from
        ? { startDate: format(dateRange.from, "yyyy-MM-dd") }
        : {}),
      ...(dateRange?.to ? { endDate: format(dateRange.to, "yyyy-MM-dd") } : {}),
    },
  });

  const {
    data: detailRows,
    loading: detailLoading,
  } = useFetchData<PickerDetailRow[]>({
    endpoint: "klik/performa-picker-detail",
    queryParams: {
      ...(selected ? { picker: selected } : {}),
      ...(dateRange?.from
        ? { startDate: format(dateRange.from, "yyyy-MM-dd") }
        : {}),
      ...(dateRange?.to ? { endDate: format(dateRange.to, "yyyy-MM-dd") } : {}),
    },
    enabled: selected !== null,
  });

  useEffect(
    function refetchOnBranchChange() {
      refetch();
    },
    [branch, refetch],
  );

  const maxPb = rows?.[0]?.pb ?? 0;
  const totalPb = rows?.[0]?.totalpb ?? 0;

  const rangeLabel = [
    dateRange?.from ? format(dateRange.from, "dd/MM/yyyy") : null,
    dateRange?.to ? format(dateRange.to, "dd/MM/yyyy") : null,
  ]
    .filter(Boolean)
    .join(" s/d ");

  return (
    <Card className="overflow-hidden border-border/60">
      <CardHeader>
        <div>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="size-4 text-chart-2" aria-hidden />
            Performa Picker
          </CardTitle>
          <CardDescription>
            Total {totalPb.toLocaleString("id-ID")} PB · klik picker untuk detail
          </CardDescription>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </CardHeader>
      <CardContent className="space-y-2">
        {loading && !rows ? (
          <p className="text-sm text-muted-foreground">Memuat data…</p>
        ) : (
          rows?.map((t) => (
            <div
              key={t.picker}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(t.picker)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelected(t.picker);
              }}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-2 py-2 transition-colors hover:border-border/60 hover:bg-muted/40">
              <span className="w-6 shrink-0 text-center text-sm" aria-hidden>
                {t.rank <= 3 ? MEDALS[t.rank - 1] : t.rank}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {t.picker} - {t.nama}
                </p>
                <p className="text-xs tabular-nums text-muted-foreground">
                  {t.pb.toLocaleString("id-ID")} PB
                </p>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-chart-2 to-chart-3"
                    style={{ width: `${Math.round((t.pb / maxPb) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>

      <Dialog open={selected !== null} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-7xl overflow-hidden p-0 sm:max-w-7xl xl:max-w-[92vw]">
          <DialogHeader className="px-6 pt-5">
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="size-4 text-chart-2" aria-hidden />
              Detail Picker{" "}
              {detailRows?.[0]?.username
                ? `${selected} - ${detailRows[0].username}`
                : selected}
            </DialogTitle>
            <DialogDescription>
              {detailRows?.length ?? 0} PB · {rangeLabel}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-auto p-4 pt-2">
            {detailLoading ? (
              <p className="p-4 text-sm text-muted-foreground">Memuat data...</p>
            ) : detailRows && detailRows.length > 0 ? (
              <table className="w-full text-left text-sm text-muted-foreground">
                <thead className="sticky top-0 z-10 bg-muted/90 text-xs uppercase text-muted-foreground backdrop-blur">
                  <tr>
                    <th scope="col" className="px-4 py-3">No</th>
                    <th scope="col" className="px-4 py-3">Recid</th>
                    <th scope="col" className="px-4 py-3">No PB</th>
                    <th scope="col" className="px-4 py-3">Tgl PB</th>
                    <th scope="col" className="px-4 py-3">Tgl Trans</th>
                    <th scope="col" className="px-4 py-3">No Trans</th>
                    <th scope="col" className="px-4 py-3 text-right">Item Order</th>
                    <th scope="col" className="px-4 py-3 text-right">Real Item</th>
                    <th scope="col" className="px-4 py-3 text-right">Pick Dt</th>
                    <th scope="col" className="px-4 py-3 text-right">Close Dt</th>
                  </tr>
                </thead>
                <tbody>
                  {detailRows.map((r, idx) => (
                    <tr
                      key={`${r.obi_nopb}-${r.obi_notrans}`}
                      className="animate-fade-up border-t border-border/50 odd:bg-muted/20 transition-colors hover:bg-muted/50"
                      style={{ animationDelay: `${Math.min(idx * 40, 480)}ms` }}>
                      <td className="px-4 py-3">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold ${recidBadgeClass(r.obi_recid)}`}>
                          {r.obi_recid}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-foreground">
                        {r.obi_nopb}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap tabular-nums">
                        {formatDateTime(r.obi_tglpb)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap tabular-nums">
                        {formatDateTime(r.obi_tgltrans)}
                      </td>
                      <td className="px-4 py-3 tabular-nums">{r.obi_notrans}</td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {r.obi_itemorder.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {r.obi_realitem.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap tabular-nums">
                        {formatDateTime(r.pick_dt)}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap tabular-nums">
                        {formatDateTime(r.close_dt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="p-4 text-sm text-muted-foreground">Tidak ada data.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}