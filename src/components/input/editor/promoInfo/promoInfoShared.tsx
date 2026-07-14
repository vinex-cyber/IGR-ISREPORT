// src/components/input/editor/promoInfo/promoInfoShared.tsx
import axiosClient from "@/lib/axiosClient";
import { formatNumber } from "@/utils/formatNumber";

export type PromoRow = Record<string, unknown>;

export interface FlagConfig {
  key: string;
  label: string;
  color: string;
}

export async function fetchPromo(url: string, prdcd: string): Promise<PromoRow[]> {
  try {
    const res = await axiosClient.get(url, { params: { prdcd } });
    const payload = res.data as { data?: PromoRow[] };
    return Array.isArray(payload.data) ? payload.data : [];
  } catch {
    return [];
  }
}

export const str = (v: unknown): string =>
  v === null || v === undefined ? "-" : String(v);

export const num = (v: unknown): string =>
  v === null || v === undefined || v === "" ? "-" : formatNumber(Number(v));

export function toNetto(hrg: number, flag1: unknown, flag2: unknown): number {
  if (flag1 === "Y" && flag2 === "Y") return (hrg / 11.1) * 10;
  return hrg;
}

export function calcMargin(hargaNetto: number, avgCost: number): string {
  if (!hargaNetto || !avgCost || hargaNetto === 0) return "-";
  const margin = ((hargaNetto - avgCost) / hargaNetto) * 100;
  return margin.toFixed(2);
}

const isOn = (v: unknown) => v === "1" || v === 1;

export function FlagBadges({ flags, row }: { flags: FlagConfig[]; row: PromoRow }) {
  const active = flags.filter((f) => isOn(row[f.key]));
  if (active.length === 0) return <>-</>;
  return (
    <div className="flex flex-wrap items-center justify-center gap-0.5">
      {active.map(function render(f) {
        return (
          <span
            key={f.key}
            className={`rounded px-1 text-[10px] text-white ${f.color}`}>
            {f.label}
          </span>
        );
      })}
    </div>
  );
}
