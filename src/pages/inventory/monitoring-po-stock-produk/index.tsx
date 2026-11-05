// src/pages/inventory/monitoring-stock-po-produk/index.tsx

import SettingsDatabase from "@/components/Settings/SettingsDatabase";
import { DATABASE_OPTIONS } from "@/configs/database-options";
import type { DefaultBranchPageProps } from "@/utils/server/getDefaultBranchServerSideProps";
import { getDefaultBranchServerSideProps } from "@/utils/server/getDefaultBranchServerSideProps";

import Layout from "@/components/Layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useReportPage } from "@/hooks/report/useReportPage";
import {
  monitoringPoStockProdukColumns,
  MonitoringPoStockProdukRows,
} from "@/configs/inventory/monitoring-po-stock-produk/monitoring-po-stock-produk-config";
import { buildReport } from "@/utils/reportBuilder";
import { StatCard } from "@/components/inventory/StatCard";
import { AlertTriangle, Package, Truck, Zap } from "lucide-react";

export const getServerSideProps = getDefaultBranchServerSideProps;

export default function MonitoringStockPoProdukPage({
  defaultBranch,
}: DefaultBranchPageProps) {
  const [branch, setBranch] = useState(defaultBranch);

  const config = buildReport<MonitoringPoStockProdukRows>(
    monitoringPoStockProdukColumns,
  );
  const { filteredData } = useReportPage<MonitoringPoStockProdukRows>({
    endpoint: "inventory/monitoring-po-stock-produk",
    reportTitle: "Monitoring Stock PO Produk",
    paginated: false,
    ...config,
  });

  // hitung jumlah PLU unik dari filteredData agar tidak ada duplikasi PLU
  const uniquePluCount = new Set(filteredData?.map((row) => row.plu)).size;
  // ambil daftar baris unik berdasarkan PLU dari filteredData agar tidak ada duplikasi PLU
  const uniquePluRows = Array.from(
    new Map((filteredData ?? []).map((row) => [row.plu, row])).values(),
  );

  // PO mati / alokasi tidak dihitung sebagai PO berjalan
  const poMatiKet = ["PO mati / Kdlwarsa", "PO Alokasi / Mati"];
  const isPoMati = (row: MonitoringPoStockProdukRows) =>
    poMatiKet.some((ket) => row.ket?.includes(ket));

  // total PO berjalan per PLU
  const poLiveByPlu = new Map<string, number>();
  for (const row of filteredData ?? []) {
    if (row.po_out == null || isPoMati(row)) continue;
    poLiveByPlu.set(
      row.plu,
      (poLiveByPlu.get(row.plu) ?? 0) + Number(row.po_out),
    );
  }

  // hitung jumlah PLU yang stock + PO jalan masih lebih kecil dari PKM
  const defisitPkm = uniquePluRows.filter(
    (row) =>
      Number(row.stock) + (poLiveByPlu.get(row.plu) ?? 0) < Number(row.pkm),
  ).length;

  // produk tidak ada PO
  const noPoRows = (filteredData ?? []).filter((row) => row.po_out == null);
  // produk fast moving tidak ada PO
  const fastMovingNoPoRows = noPoRows.filter((row) =>
    ["E", "S", "D", "L"].includes(row.tag),
  );
  // produk PO sedang jalan
  const poOutRows = (filteredData ?? []).filter(
    (row) => row.po_out != null && !isPoMati(row),
  );
  // total PO sedang jalan
  const totalPoOut = poOutRows.length;

  return (
    <Layout title="Monitoring Stock PO Produk" branch={branch}>
      <div className=" bg-white p-2 rounded-md shadow-md">
        <div>
          <div className="flex justify-between gap-2 items-center">
            <h1 className="text-lg font-semibold">
              Dashboard Monitoring Stock Produk : {branch}
            </h1>
            <SettingsDatabase
              value={branch}
              onChange={setBranch}
              options={DATABASE_OPTIONS}
            />
          </div>
          <div className="flex gap-2 mt-2">
            <Button variant="link"> Semua Produk</Button>
            <Button variant="link"> Barang Darurat</Button>
            <Button variant="link"> Fast Moving</Button>
            <Button variant="link"> PO Sedang Jalan</Button>
            <Button variant="link"> Daftar PB Terisi</Button>
            <Button variant="link"> Anomali Barang</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 mt-3">
        <StatCard
          icon={Package}
          tone="sky"
          label="Total PLU Aktif"
          value={uniquePluCount}
          hint="PLU unik dari data terfilter"
        />
        <StatCard
          icon={AlertTriangle}
          tone="rose"
          label="Defisit PKM"
          value={defisitPkm}
          hint="Stok + PO jalan di bawah PKM"
        />
        <StatCard
          icon={Zap}
          tone="amber"
          label="Fast Moving tanpa PO"
          value={fastMovingNoPoRows.length}
          hint="Tag E / S / D / L"
        />
        <StatCard
          icon={Truck}
          tone="emerald"
          label="PO Sedang Jalan"
          value={totalPoOut}
          hint="PO mati tidak dihitung"
        />
      </div>
    </Layout>
  );
}
