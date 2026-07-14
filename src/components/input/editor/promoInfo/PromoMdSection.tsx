// src/components/input/editor/promoInfo/PromoMdSection.tsx
import { FormatTanggal } from "@/utils/formatTanggal";
import { calcMargin, num, PromoRow, str, toNetto } from "./promoInfoShared";

export function PromoMdSection({ rows }: { rows: PromoRow[] }) {
  return (
    <section className="min-w-0 flex-1">
      <h1 className="bg-slate-300 p-1 text-center font-mono text-base font-bold dark:bg-slate-700 dark:text-gray-200">
        Promo MD
      </h1>
      <div className="overflow-x-auto border">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="text-center font-bold text-white">
              <th
                className="border bg-blue-400 p-1"
                rowSpan={2}>
                #
              </th>
              <th
                className="border bg-blue-400 p-1"
                rowSpan={2}>
                Satuan
              </th>
              <th
                className="border bg-blue-400 p-1"
                rowSpan={2}>
                Acost
              </th>
              <th
                className="border bg-blue-400 p-1"
                rowSpan={2}>
                Hrg
              </th>
              <th
                className="border bg-blue-400 p-1"
                rowSpan={2}>
                Tag
              </th>
              <th
                className="border bg-green-400 p-1"
                colSpan={4}>
                Promo MD
              </th>
            </tr>
            <tr className="text-center font-bold text-white">
              <th className="border bg-green-400 p-1">Hrg</th>
              <th className="border bg-green-400 p-1">Mrg</th>
              <th className="border bg-green-400 p-1">Awal</th>
              <th className="border bg-green-400 p-1">Akhir</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(function renderSetting(row, i) {
              const acost = Number(row.prd_avgcost ?? 0);
              const promoNetto = toNetto(
                Number(row.prmd_hrgjual ?? 0),
                row.prd_flagbkp1,
                row.prd_flagbkp2,
              );
              const promoMrg = calcMargin(promoNetto, acost);
              return (
                <tr key={i} className="border text-center">
                  <td className="border p-1">
                    {str(String(row.prd_prdcd ?? "").slice(-1))}
                  </td>
                  <td className="border p-1">
                    {str(row.prd_unit)} / {str(row.prd_frac)}
                  </td>
                  <td className="border p-1 text-right">
                    {num(row.prd_avgcost)}
                  </td>
                  <td className="border p-1 text-right">
                    {num(row.prd_hrgjual)}
                  </td>
                  <td className="border p-1">{str(row.prd_kodetag)}</td>
                  <td className="border p-1 text-right">
                    {num(row.prmd_hrgjual)}
                  </td>
                  <td className="border p-1 text-right">{promoMrg}</td>
                  <td className="border p-1">
                    {FormatTanggal(row.prmd_tglawal as string | Date | null | undefined) || "-"}
                  </td>
                  <td className="border p-1">
                    {FormatTanggal(row.prmd_tglakhir as string | Date | null | undefined) || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
