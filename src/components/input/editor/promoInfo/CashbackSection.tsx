// src/components/input/editor/promoInfo/CashbackSection.tsx
import { FlagBadges, FlagConfig, num, PromoRow, str } from "./promoInfoShared";

const memberFlags: FlagConfig[] = [
  { key: "cba_reguler", label: "Reg", color: "bg-blue-500" },
  { key: "cba_reguler_biruplus", label: "Biru+", color: "bg-red-500" },
  { key: "cba_freepass", label: "FP", color: "bg-emerald-500" },
  { key: "cba_retailer", label: "Ret", color: "bg-orange-500" },
  { key: "cba_silver", label: "Sil", color: "bg-slate-400" },
  { key: "cba_gold1", label: "G1", color: "bg-yellow-500" },
  { key: "cba_gold2", label: "G2", color: "bg-yellow-600" },
  { key: "cba_gold3", label: "G3", color: "bg-yellow-700" },
  { key: "cba_platinum", label: "Pla", color: "bg-zinc-500" },
];

const promoFlags: FlagConfig[] = [
  { key: "cbh_flagigr", label: "IGR", color: "bg-blue-500" },
  { key: "cbh_flagklik", label: "Klik", color: "bg-yellow-400 text-black" },
  { key: "cbh_flagspi", label: "SPI", color: "bg-green-500" },
  { key: "cbh_flagtmi", label: "TMI", color: "bg-purple-500" },
];

export function CashbackSection({ rows }: { rows: PromoRow[] }) {
  return (
    <section>
      <h1 className="bg-slate-300 p-1 text-center font-mono text-base font-bold dark:bg-slate-700 dark:text-gray-200">
        Cashback
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
                colSpan={3}>
                Minimum Beli/Struk
              </th>
              <th
                className="border bg-blue-400 p-1"
                rowSpan={2}>
                Nilai CB
              </th>
              <th
                className="border bg-blue-400 p-1"
                rowSpan={2}>
                Jumlah Alokasi
              </th>
              <th
                className="border bg-blue-400 p-1"
                rowSpan={2}>
                Alokasi Keluar
              </th>
              <th
                className="border bg-blue-400 p-1"
                rowSpan={2}>
                Sisa
              </th>
              <th
                className="border bg-red-400 p-1"
                colSpan={4}>
                Maximum Beli/Struk
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
              <th className="border bg-green-400 p-1">Harga</th>
              <th className="border bg-green-400 p-1">Sponsor Rp</th>
              <th className="border bg-green-400 p-1">Total Rp</th>
              <th className="border bg-red-400 p-1">Struk</th>
              <th className="border bg-red-400 p-1">Mem/Hari</th>
              <th className="border bg-red-400 p-1">Frek/Event</th>
              <th className="border bg-red-400 p-1">Rp/Event</th>
              <th className="border bg-green-400 p-1">Mulai</th>
              <th className="border bg-green-400 p-1">Selesai</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(function renderCashback(row, i) {
              return (
                <tr key={i} className="border text-center">
                  <td className="border p-1">{str(row.cbd_kodepromosi)}</td>
                  <td className="border p-1 text-left">
                    {str(row.cbh_namapromosi)}
                  </td>
                  <td className="border p-1 text-right">
                    {num(row.cbd_minstruk)}
                  </td>
                  <td className="border p-1 text-right">
                    {num(row.cbh_minrphprodukpromo)}
                  </td>
                  <td className="border p-1 text-right">
                    {num(row.cbh_mintotbelanja)}
                  </td>
                  <td className="border p-1 text-right">
                    {num(row.cbd_cashback)}
                  </td>
                  <td className="border p-1 text-right">{num(row.alokasi)}</td>
                  <td className="border p-1 text-right">
                    {num(row.alokasi_keluar)}
                  </td>
                  <td className="border p-1 text-right">{num(row.cbk_sisa)}</td>
                  <td className="border p-1 text-right">
                    {num(row.cbd_maxstruk)}
                  </td>
                  <td className="border p-1 text-right">
                    {num(row.cbd_maxmemberperhari)}
                  </td>
                  <td className="border p-1 text-right">
                    {num(row.cbd_maxfrekperevent)}
                  </td>
                  <td className="border p-1 text-right">
                    {num(row.cbd_maxrphperevent)}
                  </td>
                  <td className="border p-1">{str(row.cbh_tglawal)}</td>
                  <td className="border p-1">{str(row.cbh_tglakhir)}</td>
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
