// src/pages/informasi-promosi/ModalSalesKartuProduk.tsx
import { useFetchData } from "@/hooks/data/useFetchData";
import { useAnimeCounter } from "@/hooks/animation/useAnimeCounter";
import { stagger } from "animejs";
import { useAnimeOnScroll } from "@/hooks/animation/useAnimeOnScroll";
import BaseModal from "@/components/ui/BaseModal";

interface TrendSalesByMemberRow {
  bln: string;
  qty_mb: string | number;
  netto_mb: string | number;
  qty_mm: string | number;
  netto_mm: string | number;
  qty_omi: string | number;
  netto_omi: string | number;
  qty_idm: string | number;
  netto_idm: string | number;
}

interface ModalSalesKartuProdukProps {
  isOpen: boolean;
  onClose: () => void;
  plu: string;
  branch: string;
  namaProduk: string;
}

function fmtNum(n: number) {
  return Math.round(n).toLocaleString("en-US");
}

function num(v: string | number) {
  return Number(v) || 0;
}

function Totals({ data }: { data: TrendSalesByMemberRow[] }) {
  const totalMb = data.reduce((s, r) => s + num(r.qty_mb), 0);
  const totalMbRp = data.reduce((s, r) => s + num(r.netto_mb), 0);
  const totalMm = data.reduce((s, r) => s + num(r.qty_mm), 0);
  const totalMmRp = data.reduce((s, r) => s + num(r.netto_mm), 0);
  const totalOmi = data.reduce((s, r) => s + num(r.qty_omi), 0);
  const totalOmiRp = data.reduce((s, r) => s + num(r.netto_omi), 0);
  const totalIdm = data.reduce((s, r) => s + num(r.qty_idm), 0);
  const totalIdmRp = data.reduce((s, r) => s + num(r.netto_idm), 0);
  const totalAll = totalMb + totalMm + totalOmi + totalIdm;
  const totalAllRp = totalMbRp + totalMmRp + totalOmiRp + totalIdmRp;

  const qtyMb = useAnimeCounter({ to: totalMb, duration: 1200 });
  const rphMb = useAnimeCounter({ to: totalMbRp, duration: 1200 });
  const qtyMm = useAnimeCounter({ to: totalMm, duration: 1200 });
  const rphMm = useAnimeCounter({ to: totalMmRp, duration: 1200 });
  const qtyOmi = useAnimeCounter({ to: totalOmi, duration: 1200 });
  const rphOmi = useAnimeCounter({ to: totalOmiRp, duration: 1200 });
  const qtyIdm = useAnimeCounter({ to: totalIdm, duration: 1200 });
  const rphIdm = useAnimeCounter({ to: totalIdmRp, duration: 1200 });
  const qtyAll = useAnimeCounter({ to: totalAll, duration: 1200 });
  const rphAll = useAnimeCounter({ to: totalAllRp, duration: 1200 });

  return (
    <tfoot>
      <tr className="bg-gray-200 text-center text-xxs font-bold dark:bg-gray-600">
        <td className="border p-1.5">TOTAL</td>
        <td className="border p-1.5 text-right">{fmtNum(qtyMb.value)}</td>
        <td className="border p-1.5 text-right">{fmtNum(rphMb.value)}</td>
        <td className="border p-1.5 text-right">{fmtNum(qtyMm.value)}</td>
        <td className="border p-1.5 text-right">{fmtNum(rphMm.value)}</td>
        <td className="border p-1.5 text-right">{fmtNum(qtyOmi.value)}</td>
        <td className="border p-1.5 text-right">{fmtNum(rphOmi.value)}</td>
        <td className="border p-1.5 text-right">{fmtNum(qtyIdm.value)}</td>
        <td className="border p-1.5 text-right">{fmtNum(rphIdm.value)}</td>
        <td className="border p-1.5 text-right">{fmtNum(qtyAll.value)}</td>
        <td className="border p-1.5 text-right font-bold">{fmtNum(rphAll.value)}</td>
      </tr>
    </tfoot>
  );
}

function MonthRow({ m }: { m: TrendSalesByMemberRow }) {
  const qtyMb = useAnimeCounter({ to: num(m.qty_mb), duration: 1200 });
  const rphMb = useAnimeCounter({ to: num(m.netto_mb), duration: 1200 });
  const qtyMm = useAnimeCounter({ to: num(m.qty_mm), duration: 1200 });
  const rphMm = useAnimeCounter({ to: num(m.netto_mm), duration: 1200 });
  const qtyOmi = useAnimeCounter({ to: num(m.qty_omi), duration: 1200 });
  const rphOmi = useAnimeCounter({ to: num(m.netto_omi), duration: 1200 });
  const qtyIdm = useAnimeCounter({ to: num(m.qty_idm), duration: 1200 });
  const rphIdm = useAnimeCounter({ to: num(m.netto_idm), duration: 1200 });

  const totalQty = num(m.qty_mb) + num(m.qty_mm) + num(m.qty_omi) + num(m.qty_idm);
  const totalRph = num(m.netto_mb) + num(m.netto_mm) + num(m.netto_omi) + num(m.netto_idm);
  const qtyAll = useAnimeCounter({ to: totalQty, duration: 1200 });
  const rphAll = useAnimeCounter({ to: totalRph, duration: 1200 });

  const currentMonth = new Date().getMonth() + 1;
  const monthIndex = [
    "jan","feb","mar","apr","mei","jun",
    "jul","agu","sep","okt","nov","des",
  ].indexOf(m.bln.toLowerCase()) + 1;
  const isCurrent = monthIndex === currentMonth;

  return (
    <tr className={`row-sales-modal border text-center text-xxs ${isCurrent ? "bg-amber-100 font-bold dark:bg-amber-200 dark:text-black" : "hover:bg-blue-50"}`}>
      <td className="border p-1.5 font-medium">{m.bln.toUpperCase()}</td>
      <td className="border p-1.5 text-right">{fmtNum(qtyMb.value)}</td>
      <td className="border p-1.5 text-right">{fmtNum(rphMb.value)}</td>
      <td className="border p-1.5 text-right">{fmtNum(qtyMm.value)}</td>
      <td className="border p-1.5 text-right">{fmtNum(rphMm.value)}</td>
      <td className="border p-1.5 text-right">{fmtNum(qtyOmi.value)}</td>
      <td className="border p-1.5 text-right">{fmtNum(rphOmi.value)}</td>
      <td className="border p-1.5 text-right">{fmtNum(qtyIdm.value)}</td>
      <td className="border p-1.5 text-right">{fmtNum(rphIdm.value)}</td>
      <td className="border p-1.5 text-right">{fmtNum(qtyAll.value)}</td>
      <td className="border p-1.5 text-right font-bold">{fmtNum(rphAll.value)}</td>
    </tr>
  );
}

export default function ModalSalesKartuProduk({
  isOpen,
  onClose,
  plu,
  branch,
  namaProduk,
}: ModalSalesKartuProdukProps) {
  const { data, loading } = useFetchData<TrendSalesByMemberRow[]>({
    endpoint: "/informasi-promosi/data-trend-sales-by-member",
    queryParams: plu ? { prdcd: plu } : undefined,
    enabled: Boolean(plu),
  });

  const rows = data ?? [];

  useAnimeOnScroll(
    ".table-sales-modal",
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
      childSelector: ".row-sales-modal",
    },
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Trend Sales - ${branch}`}
      subtitle={`${plu} - ${namaProduk}`}
      loading={loading}
      empty={rows.length === 0}>
      <table className="table-sales-modal w-full text-xxs">
        <thead>
          <tr className="bg-blue-400 text-center text-xxs font-bold text-white">
            <th className="border p-2" rowSpan={2}>Bulan</th>
            <th className="border p-2" colSpan={2}>Member Biru</th>
            <th className="border p-2" colSpan={2}>Member Merah</th>
            <th className="border p-2" colSpan={2}>OMI</th>
            <th className="border p-2" colSpan={2}>IDM</th>
            <th className="border p-2" colSpan={2}>Total</th>
          </tr>
          <tr className="bg-blue-400 text-center text-xxs font-bold text-white">
            <th className="border p-1">Qty</th>
            <th className="border p-1">Netto</th>
            <th className="border p-1">Qty</th>
            <th className="border p-1">Netto</th>
            <th className="border p-1">Qty</th>
            <th className="border p-1">Netto</th>
            <th className="border p-1">Qty</th>
            <th className="border p-1">Netto</th>
            <th className="border p-1">Qty</th>
            <th className="border p-1 font-bold">Netto</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((m) => (
            <MonthRow key={m.bln} m={m} />
          ))}
        </tbody>
        <Totals data={rows} />
      </table>
    </BaseModal>
  );
}
