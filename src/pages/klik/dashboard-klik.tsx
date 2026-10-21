// src/pages/klik/dashboard-klik.tsx

import { useEffect, useMemo, useState } from "react";
import { startOfMonth, subMonths } from "date-fns";

import Layout from "@/components/Layout";
import { DATABASE_OPTIONS } from "@/configs/database-options";
import type { DefaultBranchPageProps } from "@/utils/server/getDefaultBranchServerSideProps";
import { getDefaultBranchServerSideProps } from "@/utils/server/getDefaultBranchServerSideProps";
import { FormatTanggalISO } from "@/utils/formatTanggal";
import { useFetchData } from "@/hooks/data/useFetchData";
import { KlikHero } from "@/components/klik/KlikHero";
import { PbKlikPerTanggal } from "@/components/klik/PbKlikPerTanggal";
import { PerformaPicker } from "@/components/klik/PerformaPicker";
import { ProdukTerlaris } from "@/components/klik/ProdukTerlaris";
import { StatusCard } from "@/components/klik/StatusCard";

export const getServerSideProps = getDefaultBranchServerSideProps;

type StatusSummaryRow = { key: string; total: number };

type StatusCardDef = {
  title: string;
  label: string;
  key: string;
  cod?: boolean;
  /** true = kartu "Belum Serah": PB recid 5/6 yang belum ada di tbtr_serahterima_ipp */
  belumSerah?: boolean;
};

// ponytail: 6 kartu status dashboard; count dari satu endpoint summary,
// detail di-fetch lazy saat modal dibuka (query status-order berat).
const STATUS_CARDS: StatusCardDef[] = [
  { title: "Siap Picking", label: "SIAP PICKING", key: "1" },
  { title: "Siap Scanning", label: "SIAP SCANNING", key: "2" },
  { title: "Draft Struk", label: "SIAP DRAFT STRUK", key: "3" },
  { title: "Siap Struk", label: "SIAP STRUK", key: "5" },
  { title: "Selesai Struk", label: "SELESAI STRUK", key: "6" },
  {
    title: "COD Belum Selesai",
    label: "COD BELUM SELESAI",
    key: "COD",
    cod: true,
  },
  {
    title: "Belum Serah",
    label: "BELUM SERAH",
    key: "BELUM_SERAH",
    belumSerah: true,
  },
];

function detailParamsFor(
  card: StatusCardDef,
  today: string,
): Record<string, string | number> {
  const params: Record<string, string | number> = {};
  if (card.cod) {
    params.typeBayar = "COD";
    params.notRecid = "6,B%";
  } else if (card.belumSerah) {
    params.belumSerah = "true";
    params.startDate = FormatTanggalISO(startOfMonth(subMonths(new Date(), 1)));
    params.endDate = today;
  } else {
    params.status = card.key;
  }
  if (card.label === "SELESAI STRUK") {
    params.startDate = today;
    params.endDate = today;
  } else if (!card.belumSerah) {
    // Semua kartu selain Selesai Struk & Belum Serah pakai rentang 2 bulan berjalan
    // supaya subquery rokok punya filter tanggal (konsisten). Angka kartu tetap
    // "semua masa" dari status-summary, jadi modal bisa beda jumlahnya.
    params.startDate = FormatTanggalISO(startOfMonth(subMonths(new Date(), 1)));
    params.endDate = today;
  }
  return params;
}

export default function DashboardKlik({
  defaultBranch,
}: DefaultBranchPageProps) {
  const [branch, setBranch] = useState(defaultBranch);
  const today = useMemo(() => FormatTanggalISO(new Date()), []);

  const {
    data: summary,
    loading: summaryLoading,
    refetch,
  } = useFetchData<StatusSummaryRow[]>({
    endpoint: "klik/status-summary",
  });

  useEffect(
    function refetchOnBranchChange() {
      refetch();
    },
    [branch, refetch],
  );

  // ponytail: sumary status di-polling tiap 1 menit agar angka kartu selalu segar
  useEffect(
    function pollSummaryEveryMinute() {
      const id = setInterval(() => {
        refetch();
      }, 60_000);
      return function clearPollInterval() {
        clearInterval(id);
      };
    },
    [refetch],
  );

  const counts = useMemo(
    () =>
      Object.fromEntries((summary ?? []).map((row) => [row.key, row.total])),
    [summary],
  );

  return (
    <Layout title="Dashboard Klik" branch={branch}>
      <div className="space-y-6">
        <KlikHero
          branch={branch}
          onBranchChange={setBranch}
          options={DATABASE_OPTIONS}
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
          {STATUS_CARDS.map((card) => (
            <StatusCard
              key={card.title}
              title={card.title}
              label={card.label}
              count={counts[card.key]}
              loading={summaryLoading}
              detailParams={detailParamsFor(card, today)}
            />
          ))}
        </div>

        <PbKlikPerTanggal branch={branch} />
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
          <div className="col-span-2">
            <ProdukTerlaris branch={branch} />
          </div>

          <div>
            <PerformaPicker branch={branch} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
