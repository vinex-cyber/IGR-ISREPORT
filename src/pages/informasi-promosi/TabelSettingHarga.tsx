// src/pages/informasi-promosi/TabelSettingHarga.tsx
import { stagger } from "animejs";
import { useAnimeCounter } from "@/hooks/animation/useAnimeCounter";
import { useAnimeOnScroll } from "@/hooks/animation/useAnimeOnScroll";
import { useFetchData } from "@/hooks/data/useFetchData";
import { Button } from "@/components/ui/button";

interface SettingHargaRow {
  prd_prdcd: string;
  prd_unit: string;
  prd_frac: string;
  prd_avgcost: string;
  prd_hrgjual: string;
  prd_kodetag: string;
  prmd_hrgjual: number | null;
  prmd_tglawal: string | null;
  prmd_tglakhir: string | null;
  prmd_flag_pos: string | null;
  prmd_flag_klik: string | null;
  prmd_flag_spi: string | null;
}

interface MappedRow {
  plu: string;
  satuan: string;
  acost: number;
  hrg: number;
  mrg: number;
  tag: string;
  promohrg: number;
  promomrg: number;
  awal: string;
  akhir: string;
  flag_pos: string | null;
  flag_klik: string | null;
  flag_spi: string | null;
}

function mapRow(row: SettingHargaRow): MappedRow {
  const acost = Number(row.prd_avgcost ?? 0);
  const hrg = Number(row.prd_hrgjual ?? 0);
  const mrg = hrg > 0 ? ((hrg - acost) / hrg) * 100 : 0;

  const promohrg = Number(row.prmd_hrgjual ?? 0);
  const promomrg = promohrg > 0 ? ((promohrg - acost) / promohrg) * 100 : 0;

  const fmtDate = (d: string | null) => {
    if (!d) return "-";
    const date = new Date(d);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  return {
    plu: row.prd_prdcd,
    satuan: `${row.prd_unit} / ${row.prd_frac}`,
    acost: Math.round(acost),
    hrg: Math.round(hrg),
    mrg,
    tag: row.prd_kodetag ?? "-",
    promohrg: Math.round(promohrg),
    promomrg,
    awal: fmtDate(row.prmd_tglawal),
    akhir: fmtDate(row.prmd_tglakhir),
    flag_pos: row.prmd_flag_pos,
    flag_klik: row.prmd_flag_klik,
    flag_spi: row.prmd_flag_spi,
  };
}

function fmtNum(n: number) {
  return Math.round(n).toLocaleString("en-US");
}

function Row({ r }: { r: MappedRow }) {
  const lastDigit = r.plu.slice(-1);
  const acost = useAnimeCounter({ to: r.acost, duration: 1200 });
  const hrg = useAnimeCounter({ to: r.hrg, duration: 1200 });
  const mrg = useAnimeCounter({ to: Math.round(r.mrg * 100), duration: 1000 });
  const promohrg = useAnimeCounter({ to: r.promohrg, duration: 1200 });
  const promomrg = useAnimeCounter({
    to: Math.round(r.promomrg * 100),
    duration: 1000,
  });

  return (
    <tr className="row-setting-harga border">
      <td className="border p-0.5 text-center">{lastDigit}</td>
      <td className="border p-0.5 text-center whitespace-nowrap">{r.satuan}</td>
      <td className="border p-0.5 text-right whitespace-nowrap">
        {fmtNum(acost.value)}
      </td>
      <td className="border p-0.5 text-right whitespace-nowrap">
        {fmtNum(hrg.value)}
      </td>
      <td className="border p-0.5 text-right">
        {(mrg.value / 100).toFixed(2)}
      </td>
      <td className="border p-0.5 text-center">{r.tag}</td>
      <td
        className={`border p-0.5 text-right whitespace-nowrap ${promohrg.value > 0 && !r.flag_pos && !r.flag_klik && !r.flag_spi ? "line-through text-muted-foreground" : ""}`}>
        {fmtNum(promohrg.value)}
      </td>
      <td
        className={`border p-0.5 text-right ${promohrg.value > 0 && !r.flag_pos && !r.flag_klik && !r.flag_spi ? "line-through text-muted-foreground" : ""}`}>
        {(promomrg.value / 100).toFixed(2)}
      </td>
      <td
        className={`border p-0.5 text-center whitespace-nowrap ${promohrg.value > 0 && !r.flag_pos && !r.flag_klik && !r.flag_spi ? "line-through text-muted-foreground" : ""}`}>
        {r.awal}
      </td>
      <td
        className={`border p-0.5 text-center whitespace-nowrap ${promohrg.value > 0 && !r.flag_pos && !r.flag_klik && !r.flag_spi ? "line-through text-muted-foreground" : ""}`}>
        {r.akhir}
      </td>
      <td className="border p-0.5 text-center">
        <input
          className="w-14 text-right text-xxs dark:text-gray-200"
          defaultValue="-"
        />
      </td>
      <td className={`border p-0.5 text-center`}>
        {promohrg.value > 0 && !r.flag_pos && !r.flag_klik && !r.flag_spi
          ? (mrg.value / 100).toFixed(2)
          : promomrg
            ? (promomrg.value / 100).toFixed(2)
            : (mrg.value / 100).toFixed(2)}
      </td>
      <td className="border p-0.5 text-center">
        <button
          className="btn-hover cursor-not-allowed rounded bg-gray-500 px-1 py-0.5 text-xxs font-bold text-white"
          disabled>
          Simpan
        </button>
      </td>
    </tr>
  );
}

interface TabelSettingHargaProps {
  plu?: string;
}

export default function TabelSettingHarga({ plu }: TabelSettingHargaProps) {
  const { data, loading } = useFetchData<SettingHargaRow[]>({
    endpoint: "/informasi-promosi/data-setting-harga",
    queryParams: plu ? { prdcd: plu } : undefined,
    enabled: Boolean(plu),
  });

  const rows = data ? data.map(mapRow) : [];

  useAnimeOnScroll(
    ".table-setting-harga",
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
      childSelector: ".row-setting-harga",
    },
  );

  if (!plu) {
    return (
      <div className="table-setting-harga overflow-x-auto rounded-lg bg-white p-2 shadow-xl dark:bg-gray-800 dark:text-gray-200">
        <Button className="hover:cursor-pointer float-end my-1 rounded bg-blue-500 px-2 py-0.5 !text-xxs font-bold text-white">
          View Setting Harga
        </Button>
        <table className="w-full text-xxs">
          <thead>
            <tr>
              <th
                className="border bg-blue-400 px-0.5 text-center text-white"
                rowSpan={2}>
                #
              </th>
              <th
                className="border bg-blue-400 px-0.5 text-center text-white"
                rowSpan={2}>
                Satuan
              </th>
              <th
                className="border bg-blue-400 px-0.5 text-center text-white"
                rowSpan={2}>
                Acost
              </th>
              <th
                className="border bg-blue-400 px-0.5 text-center text-white"
                rowSpan={2}>
                Hrg
              </th>
              <th
                className="border bg-blue-400 px-0.5 text-center text-white"
                rowSpan={2}>
                Mrg
              </th>
              <th
                className="border bg-blue-400 px-0.5 text-center text-white"
                rowSpan={2}>
                Tag
              </th>
              <th
                className="border bg-green-400 px-0.5 text-center text-white"
                colSpan={4}>
                Promo MD
              </th>
              <th
                className="border bg-red-400 px-0.5 text-center text-white"
                colSpan={2}>
                Setting
              </th>
              <th
                className="border bg-blue-400 px-0.5 text-center text-white"
                rowSpan={2}>
                Action
              </th>
            </tr>
            <tr>
              <th className="border bg-green-400 p-0.5 text-center text-white">
                Hrg
              </th>
              <th className="border bg-green-400 p-0.5 text-center text-white">
                Mrg
              </th>
              <th className="border bg-green-400 p-0.5 text-center text-white">
                Awal
              </th>
              <th className="border bg-green-400 p-0.5 text-center text-white">
                Akhir
              </th>
              <th className="border bg-red-400 p-0.5 text-center text-white">
                Hrg
              </th>
              <th className="border bg-red-400 p-0.5 text-center text-white">
                Mrg
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={13}
                className="border p-2 text-center text-xxs text-gray-400 dark:text-gray-300">
                Pilih PLU untuk melihat setting harga
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-setting-harga overflow-x-auto rounded-lg bg-white p-2 shadow-xl dark:bg-gray-800 dark:text-gray-200">
      <button className="btn-hover hover:cursor-pointer hover:bg-gray-700 float-end my-1 rounded bg-blue-500 px-2 py-0.5 text-xxs font-bold text-white">
        View Setting Harga
      </button>
      <table className="w-full text-xxs">
        <thead>
          <tr>
            <th
              className="border bg-blue-400 px-0.5 text-center text-white"
              rowSpan={2}>
              #
            </th>
            <th
              className="border bg-blue-400 px-0.5 text-center text-white"
              rowSpan={2}>
              Satuan
            </th>
            <th
              className="border bg-blue-400 px-0.5 text-center text-white"
              rowSpan={2}>
              Acost
            </th>
            <th
              className="border bg-blue-400 px-0.5 text-center text-white"
              rowSpan={2}>
              Hrg
            </th>
            <th
              className="border bg-blue-400 px-0.5 text-center text-white"
              rowSpan={2}>
              Mrg
            </th>
            <th
              className="border bg-blue-400 px-0.5 text-center text-white"
              rowSpan={2}>
              Tag
            </th>
            <th
              className="border bg-green-400 px-0.5 text-center text-white"
              colSpan={4}>
              Promo MD
            </th>
            <th
              className="border bg-red-400 px-0.5 text-center text-white"
              colSpan={2}>
              Setting
            </th>
            <th
              className="border bg-blue-400 px-0.5 text-center text-white"
              rowSpan={2}>
              Action
            </th>
          </tr>
          <tr>
            <th className="border bg-green-400 p-0.5 text-center text-white">
              Hrg
            </th>
            <th className="border bg-green-400 p-0.5 text-center text-white">
              Mrg
            </th>
            <th className="border bg-green-400 p-0.5 text-center text-white">
              Awal
            </th>
            <th className="border bg-green-400 p-0.5 text-center text-white">
              Akhir
            </th>
            <th className="border bg-red-400 p-0.5 text-center text-white">
              Hrg
            </th>
            <th className="border bg-red-400 p-0.5 text-center text-white">
              Mrg
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={13}
                className="border p-2 text-center text-xxs text-gray-400 dark:text-gray-300">
                Memuat...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td
                colSpan={13}
                className="border p-2 text-center text-xxs text-gray-400 dark:text-gray-300">
                Tidak ada data
              </td>
            </tr>
          ) : (
            rows.map((r) => <Row key={r.plu} r={r} />)
          )}
        </tbody>
      </table>
    </div>
  );
}
