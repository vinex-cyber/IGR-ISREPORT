import { stagger } from "animejs";
import { useAnimeCounter } from "@/hooks/useAnimeCounter";
import { useAnimeOnScroll } from "@/hooks/useAnimeOnScroll";

interface RowMemberPricing {
  merah: [number, number, number];
  biru: [number, number, number];
  platinum: [number, number, number];
}

const memberData: RowMemberPricing[] = [
  {
    merah: [116500, 4500, 112000],
    biru: [117000, 0, 117000],
    platinum: [116500, 4500, 112000],
  },
  {
    merah: [2910, 0, 2910],
    biru: [3100, 0, 3100],
    platinum: [2910, 0, 2910],
  },
  {
    merah: [14550, 0, 14550],
    biru: [15000, 0, 15000],
    platinum: [14550, 0, 14550],
  },
];

function Cell({ to }: { to: number }) {
  const { value } = useAnimeCounter({ to, duration: 1200 });
  return <>{value.toLocaleString()}</>;
}

function Row({ m, i }: { m: RowMemberPricing; i: number }) {
  return (
    <tr className="row-member-pricing text-center">
      <td className="border p-0.5">{i}</td>
      {([m.merah, m.biru, m.platinum] as const).flat().map((v, j) => (
        <td key={j} className="border p-0.5 text-right whitespace-nowrap">
          <Cell to={v} />
        </td>
      ))}
    </tr>
  );
}

export default function TabelMemberPricing() {
  useAnimeOnScroll(".table-member-pricing", {
    opacity: [0, 1],
    y: [12, 0],
    duration: 600,
    ease: "outQuad",
    delay: stagger(60),
  }, {
    threshold: 0.3,
    triggerOnce: true,
    childSelector: ".row-member-pricing",
  });

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
          {memberData.map((m, i) => (
            <Row key={i} m={m} i={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
