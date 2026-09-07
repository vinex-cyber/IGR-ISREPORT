// src/pages/klik/dashboard-klik.tsx

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";

import Layout from "@/components/Layout";
import { DATABASE_OPTIONS } from "@/configs/database-options";
import type { DefaultBranchPageProps } from "@/utils/server/getDefaultBranchServerSideProps";
import { getDefaultBranchServerSideProps } from "@/utils/server/getDefaultBranchServerSideProps";
import { useFetchData } from "@/hooks/data/useFetchData";
import { KlikHero } from "@/components/klik/KlikHero";
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
];

// ponytail: status belum selesai (picking, scanning, draft, siap struk, COD)
// ambil semua masa; detail SELESAI STRUK dibatasi tanggal hari ini saja.
// TMI (member cus_jenismember='T') dikecualikan di query backend (FilterKlik + summary).
function detailParamsFor(
  card: StatusCardDef,
  today: string,
): Record<string, string | number> {
  const params: Record<string, string | number> = {};
  if (card.cod) {
    params.typeBayar = "COD";
    params.notRecid = "6,B%";
  } else {
    params.status = card.key;
  }
  if (card.label === "SELESAI STRUK") {
    params.startDate = today;
    params.endDate = today;
  }
  return params;
}

export default function DashboardKlik({
  defaultBranch,
}: DefaultBranchPageProps) {
  const [branch, setBranch] = useState(defaultBranch);
  const today = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

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

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
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

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
          <ProdukTerlaris branch={branch} />
          <PerformaPicker branch={branch} />
        </div>
      </div>
    </Layout>
  );
}
