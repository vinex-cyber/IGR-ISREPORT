// src/pages/informasi-promosi/TabelPromoMendatang.tsx
import { stagger } from "animejs";
import { useAnimeOnScroll } from "@/hooks/animation/useAnimeOnScroll";
import { useFetchData } from "@/hooks/data/useFetchData";

interface PromoMendatangApiRow {
  kd_promo: string;
  nama_promo: string;
  plu_promo: string;
  tglawal_promo: string;
  tglakhir_promo: string;
  flagigr: string;
  flagklik: string;
  flagspi: string;
  flagtmi: string;
  mm_reguler: string;
  mm_reguler_biruplus: string;
  mm_retailer: string;
  mm_silver: string;
  mm_gold1: string;
  mm_gold2: string;
  mm_gold3: string;
  mm_platinum: string;
}

interface RowPromoMendatang {
  kode: string;
  namaPromosi: string;
  plu: string;
  periodeMulai: string;
  periodeSelesai: string;
  jenisMem: string[];
  flagPromo: string[];
}

function mapRow(row: PromoMendatangApiRow): RowPromoMendatang {
  const jenisMem: string[] = [];
  if (row.mm_reguler === "1" || row.mm_reguler_biruplus === "1")
    jenisMem.push("Mb");
  if (
    row.mm_retailer === "1" ||
    row.mm_silver === "1" ||
    row.mm_gold1 === "1" ||
    row.mm_gold2 === "1" ||
    row.mm_gold3 === "1"
  )
    jenisMem.push("Mm");
  if (row.mm_platinum === "1") jenisMem.push("Pla");

  const flagPromo: string[] = [];
  if (row.flagigr === "Y") flagPromo.push("IGR");
  if (row.flagklik === "Y") flagPromo.push("Klik");
  if (row.flagspi === "Y") flagPromo.push("SPI");
  if (row.flagtmi === "Y") flagPromo.push("TMI");

  return {
    kode: row.kd_promo,
    namaPromosi: row.nama_promo,
    plu: row.plu_promo,
    periodeMulai: row.tglawal_promo ?? "",
    periodeSelesai: row.tglakhir_promo ?? "",
    jenisMem,
    flagPromo,
  };
}

const badgeColor: Record<string, string> = {
  Mb: "bg-blue-500 text-white",
  Mm: "bg-red-500 text-white",
  Pla: "bg-zinc-500 text-white",
  IGR: "bg-blue-500 text-white",
  Klik: "bg-yellow-400 text-black",
  SPI: "bg-green-500 text-white",
  TMI: "bg-purple-500 text-white",
};

function Badge({ label }: { label: string }) {
  return (
    <span
      className={`px-1 rounded text-xxs ${badgeColor[label] ?? "bg-gray-500 text-white"}`}>
      {label}
    </span>
  );
}

interface TabelPromoMendatangProps {
  plu?: string;
}

export default function TabelPromoMendatang({ plu }: TabelPromoMendatangProps) {
  const { data, loading } = useFetchData<PromoMendatangApiRow[]>({
    endpoint: "/informasi-promosi/data-promo-mendatang",
    queryParams: plu ? { prdcd: plu } : undefined,
    enabled: Boolean(plu),
  });

  const rows = data ? data.map(mapRow) : [];
  const isActive = Boolean(plu) && !loading && rows.length > 0;

  useAnimeOnScroll(
    ".table-promo-mendatang",
    {
      opacity: [0, 1],
      y: [12, 0],
      duration: 600,
      ease: "outQuad",
      delay: stagger(60),
    },
    {
      threshold: 0.3,
      triggerOnce: true,
      childSelector: ".row-promo-mendatang",
    },
  );

  if (!isActive) return null;

  return (
    <div className="table-promo-mendatang overflow-x-auto rounded-lg bg-white p-2 shadow-xl dark:bg-gray-800 dark:text-gray-200">
      <h1 className="bg-slate-300 p-1 text-center font-mono text-xl font-bold dark:bg-slate-700 dark:text-gray-200">
        Table Promo Mendatang
      </h1>
      <table className="w-full text-xxs">
        <thead>
          <tr className="text-center text-xxs font-bold text-white dark:text-gray-200">
            <th className="border bg-blue-400 p-2" rowSpan={2}>
              Kode
            </th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>
              Nama Promosi
            </th>
            <th className="border bg-green-400 p-2" colSpan={2}>
              Periode
            </th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>
              Jenis Mem
            </th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>
              Flag Promo
            </th>
          </tr>
          <tr className="text-center text-xxs font-bold text-white">
            <th className="border bg-green-400 p-1">Mulai</th>
            <th className="border bg-green-400 p-1">Selesai</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={17}
                className="border p-2 text-center text-xxs text-gray-400 dark:text-gray-300">
                Memuat...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={17}
                className="border p-2 text-center text-xxs text-gray-400 dark:text-gray-300">
                Tidak ada data
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr
                key={r.kode}
                className="row-promo-mendatang border text-center text-xxs">
                <td className="border p-1">{r.kode}</td>
                <td className="border p-1">{r.namaPromosi}</td>
                <td className="border p-1">{r.periodeMulai}</td>
                <td className="border p-1">{r.periodeSelesai}</td>
                <td className="border p-1">
                  <div className="flex items-center justify-around gap-0.5">
                    {r.jenisMem.map((b) => (
                      <Badge key={b} label={b} />
                    ))}
                  </div>
                </td>
                <td className="border p-1">
                  <div className="flex items-center justify-around gap-0.5">
                    {r.flagPromo.map((b) => (
                      <Badge key={b} label={b} />
                    ))}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
