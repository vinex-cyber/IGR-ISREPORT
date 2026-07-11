// src/pages/informasi-promosi/TabelMemberPricing.tsx
import { stagger } from "animejs";
import { useAnimeCounter } from "@/hooks/animation/useAnimeCounter";
import { useAnimeOnScroll } from "@/hooks/animation/useAnimeOnScroll";
import { useFetchData } from "@/hooks/data/useFetchData";

interface CashbackRow {
  plu: string;
  hrgmm: string | null;
  cbmm: number | null;
  hrg_netmm: number | null;
  hrgbiru: string | null;
  cbbiru: number | null;
  hrg_netbiru: number | null;
  hrgpla: string | null;
  cbpla: number | null;
  hrg_netpla: number | null;
}

interface RowMemberPricing {
  merah: [number, number, number];
  biru: [number, number, number];
  platinum: [number, number, number];
}

function mapRow(row: CashbackRow): RowMemberPricing {
  return {
    merah: [Number(row.hrgmm ?? 0), Number(row.cbmm ?? 0), Number(row.hrg_netmm ?? 0)],
    biru: [Number(row.hrgbiru ?? 0), Number(row.cbbiru ?? 0), Number(row.hrg_netbiru ?? 0)],
    platinum: [Number(row.hrgpla ?? 0), Number(row.cbpla ?? 0), Number(row.hrg_netpla ?? 0)],
  };
}

function Cell({ to }: { to: number }) {
  const { value } = useAnimeCounter({ to, duration: 1200 });
  return <>{value.toLocaleString()}</>;
}

function Row({ m, plu }: { m: RowMemberPricing; plu: string }) {
  const lastDigit = plu.slice(-1);
  return (
    <tr className="row-member-pricing text-center">
      <td className="border p-0.5">{lastDigit}</td>
      {([m.merah, m.biru, m.platinum] as const).flat().map((v, j) => (
        <td key={j} className="border p-0.5 text-right whitespace-nowrap">
          <Cell to={v} />
        </td>
      ))}
    </tr>
  );
}

interface TabelMemberPricingProps {
  plu?: string;
}

export default function TabelMemberPricing({ plu }: TabelMemberPricingProps) {
  const { data, loading } = useFetchData<CashbackRow[]>({
    endpoint: "/informasi-promosi/data-cashback-jenismember",
    queryParams: plu ? { prdcd: plu } : undefined,
    enabled: Boolean(plu),
  });

  const memberData = data ? data.map(mapRow) : [];

  useAnimeOnScroll(
    ".table-member-pricing",
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
      childSelector: ".row-member-pricing",
    },
  );

  if (!plu) {
    return (
      <div className="table-member-pricing rounded-lg bg-white p-2 shadow-xl">
        <table className="w-full text-xxs">
          <thead>
            <tr>
              <th className="border bg-gray-400 p-0.5 text-center text-white" rowSpan={2}>#</th>
              <th className="border bg-red-500 p-0.5 text-center text-white" colSpan={3}>Member Merah</th>
              <th className="border bg-blue-500 p-0.5 text-center text-white" colSpan={3}>Member Biru</th>
              <th className="border bg-zinc-600 p-0.5 text-center text-white" colSpan={3}>Member Platinum</th>
            </tr>
            <tr>
              <th className="border bg-red-500 p-0.5 text-center text-white">Harga</th>
              <th className="border bg-red-500 p-0.5 text-center text-white">Cb</th>
              <th className="border bg-red-500 p-0.5 text-center text-white">Net</th>
              <th className="border bg-blue-500 p-0.5 text-center text-white">Harga</th>
              <th className="border bg-blue-500 p-0.5 text-center text-white">Cb</th>
              <th className="border bg-blue-500 p-0.5 text-center text-white">Net</th>
              <th className="border bg-zinc-600 p-0.5 text-center text-white">Harga</th>
              <th className="border bg-zinc-600 p-0.5 text-center text-white">Cb</th>
              <th className="border bg-zinc-600 p-0.5 text-center text-white">Net</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={10} className="border p-2 text-center text-xxs text-gray-400">
                Pilih PLU untuk melihat member pricing
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-member-pricing rounded-lg bg-white p-2 shadow-xl">
      <table className="w-full text-xxs">
        <thead>
          <tr>
            <th
              className="border bg-gray-400 p-0.5 text-center text-white"
              rowSpan={2}>
              #
            </th>
            <th
              className="border bg-red-500 p-0.5 text-center text-white"
              colSpan={3}>
              Member Merah
            </th>
            <th
              className="border bg-blue-500 p-0.5 text-center text-white"
              colSpan={3}>
              Member Biru
            </th>
            <th
              className="border bg-zinc-600 p-0.5 text-center text-white"
              colSpan={3}>
              Member Platinum
            </th>
          </tr>
          <tr>
            <th className="border bg-red-500 p-0.5 text-center text-white">
              Harga
            </th>
            <th className="border bg-red-500 p-0.5 text-center text-white">
              Cb
            </th>
            <th className="border bg-red-500 p-0.5 text-center text-white">
              Net
            </th>
            <th className="border bg-blue-500 p-0.5 text-center text-white">
              Harga
            </th>
            <th className="border bg-blue-500 p-0.5 text-center text-white">
              Cb
            </th>
            <th className="border bg-blue-500 p-0.5 text-center text-white">
              Net
            </th>
            <th className="border bg-zinc-600 p-0.5 text-center text-white">
              Harga
            </th>
            <th className="border bg-zinc-600 p-0.5 text-center text-white">
              Cb
            </th>
            <th className="border bg-zinc-600 p-0.5 text-center text-white">
              Net
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={10} className="border p-2 text-center text-xxs text-gray-400">
                Memuat...
              </td>
            </tr>
          ) : memberData.length === 0 ? (
            <tr>
              <td colSpan={10} className="border p-2 text-center text-xxs text-gray-400">
                Tidak ada data
              </td>
            </tr>
          ) : (
            memberData.map((m, i) => (
              <Row key={i} m={m} plu={data![i].plu} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
