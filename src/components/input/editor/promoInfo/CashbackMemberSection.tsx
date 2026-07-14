// src/components/input/editor/promoInfo/CashbackMemberSection.tsx
import { num, PromoRow } from "./promoInfoShared";

export function CashbackMemberSection({ rows }: { rows: PromoRow[] }) {
  return (
    <section className="min-w-0 flex-1">
      <h1 className="bg-slate-300 p-1 text-center font-mono text-base font-bold dark:bg-slate-700 dark:text-gray-200">
        Cashback Member
      </h1>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Tidak ada data cashback member.
        </p>
      ) : (
        <div className="overflow-x-auto border">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="text-center font-bold text-white">
                <th
                  className="border bg-gray-400 p-0.5"
                  rowSpan={2}>
                  #
                </th>
                <th
                  className="border bg-red-500 p-0.5"
                  colSpan={3}>
                  Member Merah
                </th>
                <th
                  className="border bg-blue-500 p-0.5"
                  colSpan={3}>
                  Member Biru
                </th>
                <th
                  className="border bg-zinc-600 p-0.5"
                  colSpan={3}>
                  Member Platinum
                </th>
              </tr>
              <tr className="text-center font-bold text-white">
                <th className="border bg-red-500 p-0.5">Harga</th>
                <th className="border bg-red-500 p-0.5">Cb</th>
                <th className="border bg-red-500 p-0.5">Net</th>
                <th className="border bg-blue-500 p-0.5">Harga</th>
                <th className="border bg-blue-500 p-0.5">Cb</th>
                <th className="border bg-blue-500 p-0.5">Net</th>
                <th className="border bg-zinc-600 p-0.5">Harga</th>
                <th className="border bg-zinc-600 p-0.5">Cb</th>
                <th className="border bg-zinc-600 p-0.5">Net</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(function renderMemberRow(row, i) {
                return (
                  <tr key={i} className="text-center">
                    <td className="border p-0.5">{i}</td>
                    <td className="border p-0.5 text-right whitespace-nowrap">
                      {num(row.hrgmm)}
                    </td>
                    <td className="border p-0.5 text-right whitespace-nowrap">
                      {num(row.cbmm)}
                    </td>
                    <td className="border p-0.5 text-right whitespace-nowrap">
                      {num(row.hrg_netmm)}
                    </td>
                    <td className="border p-0.5 text-right whitespace-nowrap">
                      {num(row.hrgbiru)}
                    </td>
                    <td className="border p-0.5 text-right whitespace-nowrap">
                      {num(row.cbbiru)}
                    </td>
                    <td className="border p-0.5 text-right whitespace-nowrap">
                      {num(row.hrg_netbiru)}
                    </td>
                    <td className="border p-0.5 text-right whitespace-nowrap">
                      {num(row.hrgpla)}
                    </td>
                    <td className="border p-0.5 text-right whitespace-nowrap">
                      {num(row.cbpla)}
                    </td>
                    <td className="border p-0.5 text-right whitespace-nowrap">
                      {num(row.hrg_netpla)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
