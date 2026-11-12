// src/components/charts/StockMinusModal.tsx
"use client";

import { useEffect } from "react";
import { Download } from "lucide-react";

import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import { useFetchData } from "@/hooks/data/useFetchData";
import { useExportToExcel } from "@/hooks/useExportToExcel";

type StockMinusRow = {
  st_prdcd: string;
  st_deskripsi: string;
  st_unit: string;
  st_frac: number | string; // prd_frac numeric: pg mengembalikan string
  st_kodetag: string;
  st_qty: number;
};

interface StockMinusModalProps {
  show: boolean;
  onClose: () => void;
}

export function StockMinusModal({ show, onClose }: StockMinusModalProps) {
  const { data, loading, error, refetch } = useFetchData<StockMinusRow[]>({
    endpoint: "/inventory/lpp-saat-ini/stock-minus",
    enabled: show,
  });

  useEffect(
    function pollWhileOpen() {
      if (!show) return;

      const id = setInterval(function pollRefetch() {
        refetch();
      }, 60_000);
      return function stopPolling() {
        clearInterval(id);
      };
    },
    [show, refetch],
  );

  const rows = data ?? [];

  const { handleExport, isExporting } = useExportToExcel({
    title: "Stock Minus",
    data: rows,
    columns: [
      { field: "st_prdcd", label: "PLU" },
      { field: "st_deskripsi", label: "Deskripsi" },
      { field: "st_unit", label: "Unit" },
      { field: "st_frac", label: "Frac", isNumeric: true },
      { field: "st_kodetag", label: "Kode Tag" },
      { field: "st_qty", label: "Qty", isNumeric: true },
    ],
    mapRow: (row) => [
      String(row.st_prdcd ?? ""),
      String(row.st_deskripsi ?? ""),
      String(row.st_unit ?? ""),
      Number(row.st_frac ?? 0),
      String(row.st_kodetag ?? ""),
      Number(row.st_qty ?? 0),
    ],
  });

  return (
    <Modal show={show} onClose={onClose}>
      <div className="w-[min(760px,88vw)]">
        <div className="mb-3 flex items-center justify-between gap-3 pr-10">
          <h2 className="text-base font-semibold">
            Stock Minus{" "}
            <span className="text-muted-foreground">({rows.length})</span>
          </h2>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleExport}
            disabled={isExporting || rows.length === 0}
            className="shrink-0 gap-1.5 text-xs">
            <Download className="size-3.5" aria-hidden />
            {isExporting ? "Menyimpan..." : "Excel"}
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Memuat data...</p>
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Tidak ada produk dengan stock minus.
          </p>
        ) : (
          <div className="max-h-[65vh] overflow-auto rounded border border-border">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-muted text-left">
                <tr>
                  <th className="px-2 py-1.5 font-medium">PLU</th>
                  <th className="px-2 py-1.5 font-medium">Deskripsi</th>
                  <th className="px-2 py-1.5 font-medium">Unit</th>
                  <th className="px-2 py-1.5 text-right font-medium">Frac</th>
                  <th className="px-2 py-1.5 text-center font-medium">Tag</th>
                  <th className="px-2 py-1.5 text-right font-medium">Qty</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.st_prdcd} className="border-t border-border/60">
                    <td className="px-2 py-1.5 font-mono whitespace-nowrap">
                      {row.st_prdcd}
                    </td>
                    <td className="px-2 py-1.5">{row.st_deskripsi}</td>
                    <td className="px-2 py-1.5 whitespace-nowrap">
                      {row.st_unit}
                    </td>
                    <td className="px-2 py-1.5 text-right tabular-nums">
                      {Number(row.st_frac).toLocaleString("id-ID")}
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      {row.st_kodetag}
                    </td>
                    <td className="px-2 py-1.5 text-right tabular-nums">
                      {Number(row.st_qty).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  );
}
