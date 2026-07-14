// src/components/input/editor/promoInfo/GiftSection.tsx
import { FlagBadges, FlagConfig, num, PromoRow, str } from "./promoInfoShared";

const memberFlags: FlagConfig[] = [
  { key: "gif_reguler", label: "Reg", color: "bg-blue-500" },
  { key: "gif_reguler_biruplus", label: "Mb", color: "bg-blue-500" },
  { key: "gif_freepass", label: "FP", color: "bg-emerald-500" },
  { key: "gif_retailer", label: "Ret", color: "bg-orange-500" },
  { key: "gif_silver", label: "Sil", color: "bg-slate-400" },
  { key: "gif_gold1", label: "G1", color: "bg-yellow-500" },
  { key: "gif_gold2", label: "G2", color: "bg-yellow-600" },
  { key: "gif_gold3", label: "G3", color: "bg-yellow-700" },
  { key: "gif_platinum", label: "Pla", color: "bg-zinc-500" },
];

const promoFlags: FlagConfig[] = [
  { key: "GFH_FLAGIGR", label: "IGR", color: "bg-blue-500" },
  { key: "GFH_FLAGKLIK", label: "Klik", color: "bg-yellow-400 text-black" },
  { key: "GFH_FLAGSPI", label: "SPI", color: "bg-green-500" },
  { key: "GFH_FLAGTMI", label: "TMI", color: "bg-purple-500" },
];

export function GiftSection({ rows }: { rows: PromoRow[] }) {
  return (
    <section>
      <h1 className="bg-slate-300 p-1 text-center font-mono text-base font-bold dark:bg-slate-700 dark:text-gray-200">
        Table Promo Gift
      </h1>
      <div className="overflow-x-auto border">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="text-center font-bold text-white">
              <th
                className="border bg-blue-400 p-1"
                rowSpan={2}>
                Kode
              </th>
              <th
                className="border bg-blue-400 p-1"
                rowSpan={2}>
                Nama Promosi
              </th>
              <th
                className="border bg-green-400 p-1"
                colSpan={2}>
                Minimum Beli
              </th>
              <th
                className="border bg-green-400 p-1"
                colSpan={2}>
                Minimum Total Belanja
              </th>
              <th
                className="border bg-red-400 p-1"
                colSpan={2}>
                Maximum / Hari
              </th>
              <th
                className="border bg-red-400 p-1"
                colSpan={2}>
                Maximum / Event
              </th>
              <th
                className="border bg-green-400 p-1"
                colSpan={2}>
                Hadiah
              </th>
              <th
                className="border bg-green-400 p-1"
                colSpan={2}>
                Periode
              </th>
              <th
                className="border bg-blue-400 p-1"
                rowSpan={2}>
                Jenis Mem
              </th>
              <th
                className="border bg-blue-400 p-1"
                rowSpan={2}>
                Flag Promo
              </th>
            </tr>
            <tr className="text-center font-bold text-white">
              <th className="border bg-green-400 p-1">Qty</th>
              <th className="border bg-green-400 p-1">Rph</th>
              <th className="border bg-green-400 p-1">Struk</th>
              <th className="border bg-green-400 p-1">Sponsor</th>
              <th className="border bg-red-400 p-1">Jml</th>
              <th className="border bg-red-400 p-1">Frek</th>
              <th className="border bg-red-400 p-1">Jml</th>
              <th className="border bg-red-400 p-1">Frek</th>
              <th className="border bg-green-400 p-1">Qty</th>
              <th className="border bg-green-400 p-1">Nama</th>
              <th className="border bg-green-400 p-1">Mulai</th>
              <th className="border bg-green-400 p-1">Selesai</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(function renderGift(row, i) {
              return (
                <tr key={i} className="border text-center">
                  <td className="border p-1">{str(row.gif_kode_promosi)}</td>
                  <td className="border p-1 text-left">
                    {str(row.gif_nama_promosi)}
                  </td>
                  <td className="border p-1 text-right">
                    {num(row.gif_min_beli_pcs)}
                  </td>
                  <td className="border p-1 text-right">
                    {num(row.gif_min_beli_rph)}
                  </td>
                  <td className="border p-1 text-right">
                    {num(row.gif_min_total_struk)}
                  </td>
                  <td className="border p-1 text-right">
                    {num(row.gif_min_total_sponsor)}
                  </td>
                  <td className="border p-1 text-right">
                    {num(row.gif_max_jml_hari)}
                  </td>
                  <td className="border p-1 text-right">
                    {num(row.gif_max_frek_hari)}
                  </td>
                  <td className="border p-1 text-right">
                    {num(row.gif_max_jml_event)}
                  </td>
                  <td className="border p-1 text-right">
                    {num(row.gif_max_frek_event)}
                  </td>
                  <td className="border p-1 text-right">
                    {num(row.gif_jumlah_hadiah)}
                  </td>
                  <td className="border p-1 text-left">
                    {str(row.gif_nama_hadiah)}
                  </td>
                  <td className="border p-1">{str(row.gif_mulai)}</td>
                  <td className="border p-1">{str(row.gif_selesai)}</td>
                  <td className="border p-1">
                    <FlagBadges flags={memberFlags} row={row} />
                  </td>
                  <td className="border p-1">
                    <FlagBadges flags={promoFlags} row={row} />
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
