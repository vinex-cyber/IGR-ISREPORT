// src/pages/informasi-promosi/TabelPromoGift.tsx
import { stagger } from "animejs";
import { useAnimeOnScroll } from "@/hooks/animation/useAnimeOnScroll";
import { useFetchData } from "@/hooks/data/useFetchData";

interface GiftApiResponse {
  gif_prdcd: string;
  gif_kode_promosi: string;
  gif_nama_promosi: string;
  gif_min_beli_pcs: string;
  gif_min_beli_rph: string;
  gif_mulai: string;
  gif_selesai: string;
  gif_jenis_promosi: string;
  gif_min_total_struk: string;
  gif_min_total_sponsor: string;
  gif_max_jml_hari: number;
  gif_max_frek_hari: number;
  gif_max_jml_event: number;
  gif_max_frek_event: number;
  gif_jenis_hadiah: string;
  gif_plu_hadiah: string;
  gif_nama_hadiah: string | null;
  gif_jumlah_hadiah: number;
  gif_reguler: string;
  gif_reguler_biruplus: string;
  gif_freepass: string;
  gif_retailer: string;
  gif_silver: string;
  gif_gold1: string;
  gif_gold2: string;
  gif_gold3: string;
  gif_platinum: string;
  gfh_flagigr: string;
  gfh_flagklik: string;
  gfh_flagspi: string;
  gfh_flagtmi: string;
}

interface RowGift {
  kode: string;
  namaPromosi: string;
  minBeliQty: number;
  minBeliRph: number;
  minTotalStruk: number;
  minTotalSponsor: number;
  maxJmlHari: number;
  maxFrekHari: number;
  maxJmlEvent: number;
  maxFrekEvent: number;
  hadiahQty: number;
  hadiahNama: string;
  periodeMulai: string;
  periodeSelesai: string;
  jenisMem: string[];
  flagPromo: string[];
}

interface TabelPromoGiftProps {
  plu?: string;
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
      className={`rounded px-1 text-xxs ${badgeColor[label] ?? "bg-gray-500 text-white"}`}>
      {label}
    </span>
  );
}

function mapGiftRow(item: GiftApiResponse): RowGift {
  const jenisMem: string[] = [];
  if (item.gif_reguler === "1" || item.gif_reguler_biruplus === "1")
    jenisMem.push("Mb");
  if (
    item.gif_retailer === "1" ||
    item.gif_silver === "1" ||
    item.gif_gold1 === "1" ||
    item.gif_gold2 === "1" ||
    item.gif_gold3 === "1"
  )
    jenisMem.push("Mm");
  if (item.gif_platinum === "1") jenisMem.push("Pla");

  const flagPromo: string[] = [];
  if (item.gfh_flagigr === "Y") flagPromo.push("IGR");
  if (item.gfh_flagklik === "Y") flagPromo.push("Klik");
  if (item.gfh_flagspi === "Y") flagPromo.push("SPI");
  if (item.gfh_flagtmi === "Y") flagPromo.push("TMI");

  return {
    kode: item.gif_kode_promosi,
    namaPromosi: item.gif_nama_promosi,
    minBeliQty: Number(item.gif_min_beli_pcs),
    minBeliRph: Number(item.gif_min_beli_rph),
    minTotalStruk: Number(item.gif_min_total_struk),
    minTotalSponsor: Number(item.gif_min_total_sponsor),
    maxJmlHari: item.gif_max_jml_hari,
    maxFrekHari: item.gif_max_frek_hari,
    maxJmlEvent: item.gif_max_jml_event,
    maxFrekEvent: item.gif_max_frek_event,
    hadiahQty: item.gif_jumlah_hadiah,
    hadiahNama: item.gif_nama_hadiah ?? "Point Reward",
    periodeMulai: item.gif_mulai,
    periodeSelesai: item.gif_selesai,
    jenisMem,
    flagPromo,
  };
}

export default function TabelPromoGift({ plu }: TabelPromoGiftProps) {
  const { data, loading } = useFetchData<GiftApiResponse[]>({
    endpoint: "/informasi-promosi/data-promo-gift",
    queryParams: plu ? { prdcd: plu } : undefined,
    enabled: Boolean(plu),
  });

  const rows = data ? data.map(mapGiftRow) : [];
  const isActive = Boolean(plu) && !loading && rows.length > 0;

  useAnimeOnScroll(
    ".table-promo-gift",
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
      childSelector: ".row-promo-gift",
    },
  );

  if (!isActive) return null;

  return (
    <div className="table-promo-gift overflow-x-auto rounded-lg bg-white p-2 shadow-xl dark:bg-gray-800 dark:text-gray-200">
      <h1 className="bg-slate-300 p-1 text-center font-mono text-xl font-bold dark:bg-slate-700 dark:text-gray-200">
        Table Promo Gift
      </h1>
      <table className="w-full text-xxs">
        <thead>
          <tr className="text-center text-xxs font-bold text-white">
            <th className="border bg-blue-400 p-2" rowSpan={2}>
              Kode
            </th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>
              Nama Promosi
            </th>
            <th className="border bg-green-400 p-2" colSpan={2}>
              Minimum Beli
            </th>
            <th className="border bg-green-400 p-2" colSpan={2}>
              Minimum Total Belanja
            </th>
            <th className="border bg-red-400 p-2" colSpan={2}>
              Maximum / Hari
            </th>
            <th className="border bg-red-400 p-2" colSpan={2}>
              Maximum / Event
            </th>
            <th className="border bg-green-400 p-2" colSpan={2}>
              Hadiah
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
            <th className="border bg-green-400 p-1">Qty</th>
            <th className="border bg-green-400 p-1">Rph</th>
            <th className="border bg-green-400 p-1">Struk</th>
            <th className="border bg-green-400 p-1">Sponsor</th>
            <th className="border bg-red-400 p-1">Jml</th>
            <th className="border bg-red-400 p-1">Frek</th>
            <th className="border bg-red-400 p-1">Jml</th>
            <th className="border bg-red-400 p-1">Frek</th>
            <th className="border bg-green-400 p-1">Qty</th>
            <th className="border bg-green-400 p-1">Nama</th>
            <th className="border bg-green-400 p-1">Mulai</th>
            <th className="border bg-green-400 p-1">Selesai</th>
          </tr>
        </thead>
        <tbody>
          {!plu ? (
            <tr>
              <td colSpan={16} className="border p-2 text-center text-xxs text-gray-400">
                Pilih PLU untuk melihat promo gift
              </td>
            </tr>
          ) : loading ? (
            <tr>
              <td colSpan={16} className="border p-2 text-center text-xxs text-gray-400">
                Memuat...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={16} className="border p-2 text-center text-xxs text-gray-400">
                Tidak ada data promo gift
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.kode} className="row-promo-gift border text-center text-xxs">
                <td className="border p-2">{r.kode}</td>
                <td className="border p-2 text-left">{r.namaPromosi}</td>
                <td className="border p-2">{r.minBeliQty}</td>
                <td className="border p-2">
                  {r.minBeliRph > 0 ? r.minBeliRph.toLocaleString() : "-"}
                </td>
                <td className="border p-2">
                  {r.minTotalStruk > 0 ? r.minTotalStruk.toLocaleString() : "-"}
                </td>
                <td className="border p-2">
                  {r.minTotalSponsor > 0
                    ? r.minTotalSponsor.toLocaleString()
                    : "-"}
                </td>
                <td className="border p-2">{r.maxJmlHari}</td>
                <td className="border p-2">{r.maxFrekHari}</td>
                <td className="border p-2">{r.maxJmlEvent}</td>
                <td className="border p-2">{r.maxFrekEvent}</td>
                <td className="border p-2">{r.hadiahQty}</td>
                <td className="border p-2">{r.hadiahNama}</td>
                <td className="border p-2">{r.periodeMulai}</td>
                <td className="border p-2">{r.periodeSelesai}</td>
                <td className="border p-2">
                  <div className="flex items-center justify-center gap-0.5">
                    {r.jenisMem.map((b) => (
                      <Badge key={b} label={b} />
                    ))}
                  </div>
                </td>
                <td className="border p-2">
                  <div className="flex items-center justify-center gap-0.5">
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
