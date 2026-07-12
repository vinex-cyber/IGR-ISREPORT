// src/pages/informasi-promosi/TabelPromoHJK.tsx
import { stagger } from "animejs";
import { useAnimeOnScroll } from "@/hooks/animation/useAnimeOnScroll";
import { useFetchData } from "@/hooks/data/useFetchData";

interface HjkApiResponse {
  hgk_prdcd: string;
  hgk_hrgjual: number;
  hgk_tglawal: string;
  hgk_jamawal: string;
  hgk_tglakhir: string;
  hgk_jamakhir: string;
  hgk_hariaktif: string;
}

interface RowHjk {
  plu: string;
  hargaJual: number;
  tglMulai: string;
  jamMulai: string;
  tglSelesai: string;
  jamSelesai: string;
  hariAktif: string;
}

interface TabelPromoHJKProps {
  plu?: string;
}

function mapRow(item: HjkApiResponse): RowHjk {
  return {
    plu: item.hgk_prdcd,
    hargaJual: Number(item.hgk_hrgjual ?? 0),
    tglMulai: item.hgk_tglawal ?? "-",
    jamMulai: item.hgk_jamawal ?? "-",
    tglSelesai: item.hgk_tglakhir ?? "-",
    jamSelesai: item.hgk_jamakhir ?? "-",
    hariAktif: item.hgk_hariaktif ?? "-",
  };
}

export default function TabelPromoHJK({ plu }: TabelPromoHJKProps) {
  const { data, loading } = useFetchData<HjkApiResponse[]>({
    endpoint: "/informasi-promosi/data-promo-hjk",
    queryParams: plu ? { prdcd: plu } : undefined,
    enabled: Boolean(plu),
  });

  const rows = data ? data.map(mapRow) : [];
  const isActive = Boolean(plu) && !loading && rows.length > 0;

  useAnimeOnScroll(
    ".table-promo-hjk",
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
      childSelector: ".row-promo-hjk",
    },
  );

  if (!isActive) return null;

  return (
    <div className="table-promo-hjk overflow-x-auto rounded-lg bg-white p-2 shadow-xl dark:bg-gray-800 dark:text-gray-200">
      <h1 className="bg-slate-300 p-1 text-center font-mono text-xl font-bold dark:bg-slate-700 dark:text-gray-200">
        Table Promo HJK
      </h1>
      <table className="w-full text-xxs">
        <thead>
          <tr className="text-center text-xxs font-bold text-white">
            <th className="border bg-blue-400 p-2">PLU</th>
            <th className="border bg-blue-400 p-2">Harga Jual</th>
            <th className="border bg-green-400 p-2" colSpan={2}>Mulai</th>
            <th className="border bg-green-400 p-2" colSpan={2}>Selesai</th>
            <th className="border bg-blue-400 p-2">Hari Aktif</th>
          </tr>
          <tr className="text-center text-xxs font-bold text-white">
            <th className="border bg-blue-400 p-1"></th>
            <th className="border bg-blue-400 p-1"></th>
            <th className="border bg-green-400 p-1">Tanggal</th>
            <th className="border bg-green-400 p-1">Jam</th>
            <th className="border bg-green-400 p-1">Tanggal</th>
            <th className="border bg-green-400 p-1">Jam</th>
            <th className="border bg-blue-400 p-1"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.plu} className="row-promo-hjk border text-center text-xxs">
              <td className="border p-2">{r.plu}</td>
              <td className="border p-2 text-right">{r.hargaJual.toLocaleString()}</td>
              <td className="border p-2">{r.tglMulai}</td>
              <td className="border p-2">{r.jamMulai}</td>
              <td className="border p-2">{r.tglSelesai}</td>
              <td className="border p-2">{r.jamSelesai}</td>
              <td className="border p-2">{r.hariAktif}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
