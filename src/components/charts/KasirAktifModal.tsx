// src/components/charts/KasirAktifModal.tsx
"use client";

import { useEffect } from "react";

import Modal from "@/components/modal";
import { useFetchData } from "@/hooks/data/useFetchData";

type KasirRow = {
  station: string;
  kasir: string;
  nama_kasir: string;
  customer: number;
  struk: number;
  produk: number;
  netto: number;
  hpp: number;
};

interface KasirAktifModalProps {
  show: boolean;
  onClose: () => void;
}

export function KasirAktifModal({ show, onClose }: KasirAktifModalProps) {
  const { data, loading, error, refetch } = useFetchData<KasirRow[]>({
    endpoint: "/evaluasi-sales/today-kasir",
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

  return (
    <Modal show={show} onClose={onClose}>
      <div className="w-[min(900px,90vw)]">
        <h2 className="mb-3 pr-10 text-base font-semibold">
          Kasir Aktif Hari Ini{" "}
          <span className="text-muted-foreground">({rows.length} kasir)</span>
        </h2>

        {loading ? (
          <p className="text-sm text-muted-foreground">Memuat data...</p>
        ) : error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada transaksi hari ini.
          </p>
        ) : (
          <div className="max-h-[70vh] overflow-auto rounded border border-border">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-muted text-left">
                <tr>
                  <th className="px-2 py-1.5 text-right font-medium">No</th>
                  <th className="px-2 py-1.5 font-medium">Station</th>
                  <th className="px-2 py-1.5 font-medium">Kasir</th>
                  <th className="px-2 py-1.5 font-medium">Nama</th>
                  <th className="px-2 py-1.5 text-right font-medium">
                    Customer
                  </th>
                  <th className="px-2 py-1.5 text-right font-medium">Struk</th>
                  <th className="px-2 py-1.5 text-right font-medium">Produk</th>
                  <th className="px-2 py-1.5 text-right font-medium">Netto</th>
                  <th className="px-2 py-1.5 text-right font-medium">HPP</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={`${row.station}-${row.kasir}`}
                    className="border-t border-border/60">
                    <td className="px-2 py-1.5 text-right tabular-nums text-muted-foreground">
                      {index + 1}
                    </td>
                    <td className="px-2 py-1.5 font-mono whitespace-nowrap">
                      {row.station}
                    </td>
                    <td className="px-2 py-1.5 font-mono whitespace-nowrap">
                      {row.kasir}
                    </td>
                    <td className="px-2 py-1.5 whitespace-nowrap">
                      {row.nama_kasir}
                    </td>
                    <td className="px-2 py-1.5 text-right tabular-nums">
                      {Number(row.customer).toLocaleString("id-ID")}
                    </td>
                    <td className="px-2 py-1.5 text-right tabular-nums">
                      {Number(row.struk).toLocaleString("id-ID")}
                    </td>
                    <td className="px-2 py-1.5 text-right tabular-nums">
                      {Number(row.produk).toLocaleString("id-ID")}
                    </td>
                    <td className="px-2 py-1.5 text-right tabular-nums">
                      {Number(row.netto).toLocaleString("id-ID")}
                    </td>
                    <td className="px-2 py-1.5 text-right tabular-nums">
                      {Number(row.hpp).toLocaleString("id-ID")}
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
