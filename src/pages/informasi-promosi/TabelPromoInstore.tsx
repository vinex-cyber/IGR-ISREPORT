// src/pages/informasi-promosi/TabelPromoInstore.tsx
import { stagger } from "animejs";
import { useAnimeOnScroll } from "@/hooks/animation/useAnimeOnScroll";
import { useFetchData } from "@/hooks/data/useFetchData";

interface InstoreApiResponse {
  isd_prdcd: string;
  isd_kodepromosi: string;
  isd_jenispromosi: string;
  ish_tglawal: string;
  ish_tglakhir: string;
  isd_minpcs: string;
  isd_minrph: string;
  ish_minstruk: string;
  ish_prdcdhadiah: string;
  bprp_ketpanjang: string | null;
  ish_jmlhadiah: number;
  ish_kelipatanhadiah: string;
  ish_qtyalokasi: number;
  ish_qtyalokasiout: number;
  ish_reguler: string;
  ish_regulerbiruplus: string;
  ish_freepass: string;
  ish_retailer: string;
  ish_silver: string;
  ish_gold1: string;
  ish_gold2: string;
  ish_gold3: string;
  ish_platinum: string;
}

interface RowInstore {
  kode: string;
  jenisPromo: string;
  minPcs: number;
  minRph: number;
  minStruk: number;
  hadiahNama: string;
  jmlHadiah: number;
  kelipatan: string;
  alokasi: number;
  alokasiOut: number;
  periodeMulai: string;
  periodeSelesai: string;
  jenisMem: string[];
}

interface TabelPromoInstoreProps {
  plu?: string;
}

const badgeColor: Record<string, string> = {
  Mb: "bg-blue-500 text-white",
  Mm: "bg-red-500 text-white",
  Pla: "bg-zinc-500 text-white",
};

function Badge({ label }: { label: string }) {
  return (
    <span
      className={`rounded px-1 text-xxs ${badgeColor[label] ?? "bg-gray-500 text-white"}`}>
      {label}
    </span>
  );
}

function mapRow(item: InstoreApiResponse): RowInstore {
  const jenisMem: string[] = [];
  if (item.ish_reguler === "1" || item.ish_regulerbiruplus === "1")
    jenisMem.push("Mb");
  if (
    item.ish_retailer === "1" ||
    item.ish_silver === "1" ||
    item.ish_gold1 === "1" ||
    item.ish_gold2 === "1" ||
    item.ish_gold3 === "1"
  )
    jenisMem.push("Mm");
  if (item.ish_platinum === "1") jenisMem.push("Pla");

  return {
    kode: item.isd_kodepromosi,
    jenisPromo: item.isd_jenispromosi === "G" ? "Gift" : "Instore",
    minPcs: Number(item.isd_minpcs ?? 0),
    minRph: Number(item.isd_minrph ?? 0),
    minStruk: Number(item.ish_minstruk ?? 0),
    hadiahNama: item.bprp_ketpanjang ?? item.ish_prdcdhadiah ?? "-",
    jmlHadiah: item.ish_jmlhadiah ?? 0,
    kelipatan: item.ish_kelipatanhadiah ?? "-",
    alokasi: item.ish_qtyalokasi ?? 0,
    alokasiOut: item.ish_qtyalokasiout ?? 0,
    periodeMulai: item.ish_tglawal ?? "",
    periodeSelesai: item.ish_tglakhir ?? "",
    jenisMem,
  };
}

export default function TabelPromoInstore({ plu }: TabelPromoInstoreProps) {
  const { data, loading } = useFetchData<InstoreApiResponse[]>({
    endpoint: "/informasi-promosi/data-promo-instore",
    queryParams: plu ? { prdcd: plu } : undefined,
    enabled: Boolean(plu),
  });

  const rows = data ? data.map(mapRow) : [];
  const isActive = Boolean(plu) && !loading && rows.length > 0;

  useAnimeOnScroll(
    ".table-promo-instore",
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
      childSelector: ".row-promo-instore",
    },
  );

  if (!isActive) return null;

  return (
    <div className="table-promo-instore overflow-x-auto rounded-lg bg-white p-2 shadow-xl dark:bg-gray-800 dark:text-gray-200">
      <h1 className="bg-slate-300 p-1 text-center font-mono text-xl font-bold dark:bg-slate-700 dark:text-gray-200">
        Table Promo Instore
      </h1>
      <table className="w-full text-xxs">
        <thead>
          <tr className="text-center text-xxs font-bold text-white">
            <th className="border bg-blue-400 p-2" rowSpan={2}>Kode</th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>Jenis</th>
            <th className="border bg-green-400 p-2" colSpan={3}>Minimum Beli</th>
            <th className="border bg-green-400 p-2" colSpan={2}>Hadiah</th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>Kelipatan</th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>Alokasi</th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>Keluar</th>
            <th className="border bg-green-400 p-2" colSpan={2}>Periode</th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>Jenis Mem</th>
          </tr>
          <tr className="text-center text-xxs font-bold text-white">
            <th className="border bg-green-400 p-1">Qty</th>
            <th className="border bg-green-400 p-1">Harga</th>
            <th className="border bg-green-400 p-1">Struk</th>
            <th className="border bg-green-400 p-1">Qty</th>
            <th className="border bg-green-400 p-1">Nama</th>
            <th className="border bg-green-400 p-1">Mulai</th>
            <th className="border bg-green-400 p-1">Selesai</th>
          </tr>
        </thead>
        <tbody>
          {!plu ? (
            <tr>
              <td colSpan={12} className="border p-2 text-center text-xxs text-gray-400">
                Pilih PLU untuk melihat promo instore
              </td>
            </tr>
          ) : loading ? (
            <tr>
              <td colSpan={12} className="border p-2 text-center text-xxs text-gray-400">
                Memuat...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={12} className="border p-2 text-center text-xxs text-gray-400">
                Tidak ada data promo instore
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.kode} className="row-promo-instore border text-center text-xxs">
                <td className="border p-2">{r.kode}</td>
                <td className="border p-2">{r.jenisPromo}</td>
                <td className="border p-2">{r.minPcs}</td>
                <td className="border p-2">{r.minRph > 0 ? r.minRph.toLocaleString() : "-"}</td>
                <td className="border p-2">{r.minStruk > 0 ? r.minStruk.toLocaleString() : "-"}</td>
                <td className="border p-2">{r.jmlHadiah}</td>
                <td className="border p-2 text-left">{r.hadiahNama}</td>
                <td className="border p-2">{r.kelipatan}</td>
                <td className="border p-2">{r.alokasi}</td>
                <td className="border p-2">{r.alokasiOut}</td>
                <td className="border p-2">{r.periodeMulai}</td>
                <td className="border p-2">{r.periodeSelesai}</td>
                <td className="border p-2">
                  <div className="flex items-center justify-center gap-0.5">
                    {r.jenisMem.map((b) => (
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
