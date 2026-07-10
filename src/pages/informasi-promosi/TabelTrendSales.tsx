import { animate, stagger } from "animejs";
import { useEffect, useRef, useState } from "react";
import { useAnimeOnScroll } from "@/hooks/useAnimeOnScroll";

interface RowSales {
  bulan: string;
  qty: number;
  rupiah: number;
  isCurrent?: boolean;
}

const months: RowSales[] = [
  { bulan: "JAN", qty: 758536, rupiah: 2004682297.30 },
  { bulan: "FEB", qty: 589590, rupiah: 1560786373.87 },
  { bulan: "MAR", qty: 457558, rupiah: 1210959459.46 },
  { bulan: "APR", qty: 697907, rupiah: 1849221193.69 },
  { bulan: "MEI", qty: 252331, rupiah: 665430746.85 },
  { bulan: "JUN", qty: 745321, rupiah: 1972257265.77 },
  { bulan: "JUL", qty: 204797, rupiah: 530673191.06, isCurrent: true },
  { bulan: "AGU", qty: 1279003, rupiah: 3385392863.51 },
  { bulan: "SEP", qty: 495788, rupiah: 1296282074.77 },
  { bulan: "OKT", qty: 1126184, rupiah: 2954650644.14 },
  { bulan: "NOV", qty: 483452, rupiah: 1285267608.11 },
  { bulan: "DES", qty: 670624, rupiah: 1771068536.04 },
];

function fmt(n: number) {
  return Math.round(n).toLocaleString("en-US");
}

export default function TabelTrendSales() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
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
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const obj = { v: 0 };
    const anim = animate(obj, {
      v: 1,
      duration: 800,
      ease: "outExpo",
      onUpdate: () => setProgress(obj.v),
    });
    return () => { anim.cancel(); };
  }, [started]);

  useAnimeOnScroll(".table-trend-sales", {
    opacity: [0, 1],
    y: [12, 0],
    duration: 600,
    ease: "outQuad",
    delay: stagger(60),
  }, {
    threshold: 0.3,
    triggerOnce: true,
    childSelector: ".row-trend",
  });

  return (
    <div ref={ref} className="table-trend-sales rounded-lg bg-white p-2 shadow-xl">
      <table className="w-full text-xxs">
        <thead>
          <tr className="border bg-blue-400 text-center text-xxs font-bold text-white">
            <th className="border p-1" colSpan={3}>TREND SALES</th>
          </tr>
          <tr className="border bg-blue-400 text-center text-xxs font-bold text-white">
            <th className="border p-1 w-1/5"></th>
            <th className="border p-1 w-2/5">QTY</th>
            <th className="border p-1 w-2/5">RUPIAH</th>
          </tr>
        </thead>
        <tbody>
          {months.map((m, i) => (
            <tr key={m.bulan} className={`row-trend border text-center ${m.isCurrent ? "bg-amber-200" : ""}`}>
              <td className="border p-0">{m.bulan}</td>
              <td className="border p-0">
                <input
                  type="text"
                  readOnly
                  value={fmt(m.qty * progress)}
                  className={`w-full bg-transparent px-1 py-0.5 text-right text-xxs outline-none ${m.isCurrent ? "bg-amber-200" : ""}`}
                />
              </td>
              <td className="border p-0">
                <input
                  type="text"
                  readOnly
                  value={fmt(m.rupiah * progress)}
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
