// src/pages/informasi-promosi/TabelTrendSales.tsx
import { animate, stagger } from "animejs";
import { useEffect, useRef, useState } from "react";
import { useAnimeOnScroll } from "@/hooks/animation/useAnimeOnScroll";
import { useFetchData } from "@/hooks/data/useFetchData";

interface TrendSalesRow {
  sls_prdcd: string;
  sls_qty_01: number;
  sls_qty_02: number;
  sls_qty_03: number;
  sls_qty_04: number;
  sls_qty_05: number;
  sls_qty_06: number;
  sls_qty_07: number;
  sls_qty_08: number;
  sls_qty_09: number;
  sls_qty_10: number;
  sls_qty_11: number;
  sls_qty_12: number;
  sls_rph_01: number;
  sls_rph_02: number;
  sls_rph_03: number;
  sls_rph_04: number;
  sls_rph_05: number;
  sls_rph_06: number;
  sls_rph_07: number;
  sls_rph_08: number;
  sls_rph_09: number;
  sls_rph_10: number;
  sls_rph_11: number;
  sls_rph_12: number;
  st_sales: number;
  hpp: number;
}

interface MonthRow {
  bulan: string;
  qty: number;
  rupiah: number;
  isCurrent: boolean;
}

const MONTH_NAMES = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MEI",
  "JUN",
  "JUL",
  "AGU",
  "SEP",
  "OKT",
  "NOV",
  "DES",
];

const currentMonth = new Date().getMonth() + 1;

function unpivot(row: TrendSalesRow): MonthRow[] {
  return MONTH_NAMES.map((name, i) => {
    const month = i + 1;
    const idx = String(month).padStart(2, "0");
    const isCurrent = month === currentMonth;
    const r = row as unknown as Record<string, unknown>;
    return {
      bulan: name,
      qty: Number((isCurrent ? r["st_sales"] : r[`sls_qty_${idx}`]) ?? 0),
      rupiah: Number((isCurrent ? r["hpp"] : r[`sls_rph_${idx}`]) ?? 0),
      isCurrent,
    };
  });
}

function fmt(n: number) {
  return Math.round(n).toLocaleString("en-US");
}

interface TabelTrendSalesProps {
  plu?: string;
}

export default function TabelTrendSales({ plu }: TabelTrendSalesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);

  const { data, loading } = useFetchData<TrendSalesRow[]>({
    endpoint: "/informasi-promosi/data-trend-sales",
    queryParams: plu ? { prdcd: plu } : undefined,
    enabled: Boolean(plu),
  });

  const row = data?.[0];
  const months = row ? unpivot(row) : [];

  useEffect(
    function observeViewport() {
      const el = ref.current;
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !started) {
            setStarted(true);
            obs.unobserve(el);
          }
        },
        { threshold: 0.3 },
      );
      obs.observe(el);
      return function disconnectObserver() {
        obs.disconnect();
      };
    },
    [started],
  );

  useEffect(
    function animateProgress() {
      if (!started) return;
      const obj = { v: 0 };
      const anim = animate(obj, {
        v: 1,
        duration: 800,
        ease: "outExpo",
        onUpdate: () => setProgress(obj.v),
      });
      return function cancelAnimation() {
        anim.cancel();
      };
    },
    [started],
  );

  useAnimeOnScroll(
    ".table-trend-sales",
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
      childSelector: ".row-trend",
    },
  );

  if (!plu) {
    return (
      <div className="table-trend-sales rounded-lg bg-white p-2 shadow-xl">
        <table className="w-full text-xxs">
          <thead>
            <tr className="border bg-blue-400 text-center text-xxs font-bold text-white">
              <th className="border p-1" colSpan={3}>
                TREND SALES
              </th>
            </tr>
            <tr className="border bg-blue-400 text-center text-xxs font-bold text-white">
              <th className="border p-1 w-1/5"></th>
              <th className="border p-1 w-2/5">QTY</th>
              <th className="border p-1 w-2/5">RUPIAH</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={3} className="border p-2 text-center text-xxs text-gray-400">
                Pilih PLU untuk melihat trend sales
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="table-trend-sales rounded-lg bg-white p-2 shadow-xl">
      <table className="w-full text-xxs">
        <thead>
          <tr className="border bg-blue-400 text-center text-xxs font-bold text-white">
            <th className="border p-1" colSpan={3}>
              TREND SALES
            </th>
          </tr>
          <tr className="border bg-blue-400 text-center text-xxs font-bold text-white">
            <th className="border p-1 w-1/5"></th>
            <th className="border p-1 w-2/5">QTY</th>
            <th className="border p-1 w-2/5">RUPIAH</th>
          </tr>
        </thead>
        <tbody>
          {months.map((m) => (
            <tr
              key={m.bulan}
              className={`row-trend border text-center ${m.isCurrent ? "bg-amber-200" : ""}`}>
              <td className="border p-0">{m.bulan}</td>
              <td className="border p-0">
                <input
                  type="text"
                  readOnly
                  value={loading ? "..." : fmt(m.qty * progress)}
                  className={`w-full bg-transparent px-1 py-0.5 text-right text-xxs outline-none ${m.isCurrent ? "bg-amber-200" : ""}`}
                />
              </td>
              <td className="border p-0">
                <input
                  type="text"
                  readOnly
                  value={loading ? "..." : fmt(m.rupiah * progress)}
                  className={`w-full bg-transparent px-1 py-0.5 text-right text-xxs outline-none ${m.isCurrent ? "bg-amber-200" : ""}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
