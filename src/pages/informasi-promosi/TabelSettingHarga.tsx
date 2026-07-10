import { stagger } from "animejs";
import { useAnimeCounter } from "@/hooks/useAnimeCounter";
import { useAnimeOnScroll } from "@/hooks/useAnimeOnScroll";

interface RowSettingHarga {
  satuan: string;
  acost: number;
  hrg: number;
  mrg: number;
  tag: string;
  promohrg: number;
  promomrg: number;
  awal: string;
  akhir: string;
}

const rows: RowSettingHarga[] = [
  {
    satuan: "CTN / 40",
    acost: 103649,
    hrg: 117000,
    mrg: 1.67,
    tag: "E",
    promohrg: 116500,
    promomrg: 1.24,
    awal: "08-07-2026",
    akhir: "14-07-2026",
  },
  {
    satuan: "PCS / 1",
    acost: 2591,
    hrg: 3100,
    mrg: 7.22,
    tag: "E",
    promohrg: 2910,
    promomrg: 1.16,
    awal: "08-07-2026",
    akhir: "14-07-2026",
  },
  {
    satuan: "PCS / 1",
    acost: 2591,
    hrg: 3000,
    mrg: 4.13,
    tag: "E",
    promohrg: 2910,
    promomrg: 1.16,
    awal: "08-07-2026",
    akhir: "14-07-2026",
  },
];

function fmtNum(n: number) {
  return Math.round(n).toLocaleString("en-US");
}

function Row({ r, i }: { r: RowSettingHarga; i: number }) {
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
      <td className="border p-0.5 text-center">{i}</td>
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
      <td className="border p-0.5 text-right whitespace-nowrap">
        {fmtNum(promohrg.value)}
      </td>
      <td className="border p-0.5 text-right">
        {(promomrg.value / 100).toFixed(2)}
      </td>
      <td className="border p-0.5 text-center whitespace-nowrap">{r.awal}</td>
      <td className="border p-0.5 text-center whitespace-nowrap">{r.akhir}</td>
      <td className="border p-0.5 text-center">
        <input className="w-14 text-right text-xxs" defaultValue="-" />
      </td>
      <td className="border p-0.5 text-center">
        {(mrg.value / 100).toFixed(2)}
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

export default function TabelSettingHarga() {
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

  return (
    <div className="table-setting-harga overflow-x-auto rounded-lg bg-white p-2 shadow-xl">
      <button className="btn-hover float-end my-1 rounded bg-blue-500 px-2 py-0.5 text-xxs font-bold text-white">
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
          {rows.map((r, i) => (
            <Row key={i} r={r} i={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
