interface RowSettingHarga {
  satuan: string;
  acost: number;
  hrg: number;
  mrg: number;
  tag: string;
  promohrg: number;
  promomrg: number;
  awal: string;
  akhir: string;
}

const rows: RowSettingHarga[] = [
  {
    satuan: "CTN / 40",
    acost: 103649,
    hrg: 117000,
    mrg: 1.67,
    tag: "E",
    promohrg: 116500,
    promomrg: 1.24,
    awal: "08-07-2026",
    akhir: "14-07-2026",
  },
  {
    satuan: "PCS / 1",
    acost: 2591,
    hrg: 3100,
    mrg: 7.22,
    tag: "E",
    promohrg: 2910,
    promomrg: 1.16,
    awal: "08-07-2026",
    akhir: "14-07-2026",
  },
  {
    satuan: "PCS / 1",
    acost: 2591,
    hrg: 3000,
    mrg: 4.13,
    tag: "E",
    promohrg: 2910,
    promomrg: 1.16,
    awal: "08-07-2026",
    akhir: "14-07-2026",
  },
];

export default function TabelSettingHarga() {
  return (
    <div className="overflow-x-auto rounded-lg bg-white p-2 shadow-xl">
      <button className="btn-hover float-end my-1 rounded bg-blue-500 px-2 py-0.5 text-xxs font-bold text-white">
        View Setting Harga
      </button>
      <table className="w-full text-xxs">
        <thead>
          <tr>
            <th
              className="border bg-blue-400 px-0.5 text-center text-white"
              rowSpan={2}>
              #
            </th>
            <th
              className="border bg-blue-400 px-0.5 text-center text-white"
              rowSpan={2}>
              Satuan
            </th>
            <th
              className="border bg-blue-400 px-0.5 text-center text-white"
              rowSpan={2}>
              Acost
            </th>
            <th
              className="border bg-blue-400 px-0.5 text-center text-white"
              rowSpan={2}>
              Hrg
            </th>
            <th
              className="border bg-blue-400 px-0.5 text-center text-white"
              rowSpan={2}>
              Mrg
            </th>
            <th
              className="border bg-blue-400 px-0.5 text-center text-white"
              rowSpan={2}>
              Tag
            </th>
            <th
              className="border bg-green-400 px-0.5 text-center text-white"
              colSpan={4}>
              Promo MD
            </th>
            <th
              className="border bg-red-400 px-0.5 text-center text-white"
              colSpan={2}>
              Setting
            </th>
            <th
              className="border bg-blue-400 px-0.5 text-center text-white"
              rowSpan={2}>
              Action
            </th>
          </tr>
          <tr>
            <th className="border bg-green-400 p-0.5 text-center text-white">
              Hrg
            </th>
            <th className="border bg-green-400 p-0.5 text-center text-white">
              Mrg
            </th>
            <th className="border bg-green-400 p-0.5 text-center text-white">
              Awal
            </th>
            <th className="border bg-green-400 p-0.5 text-center text-white">
              Akhir
            </th>
            <th className="border bg-red-400 p-0.5 text-center text-white">
              Hrg
            </th>
            <th className="border bg-red-400 p-0.5 text-center text-white">
              Mrg
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border">
              <td className="border p-0.5 text-center">{i}</td>
              <td className="border p-0.5 text-center whitespace-nowrap">
                {r.satuan}
              </td>
              <td className="border p-0.5 text-right whitespace-nowrap">
                {r.acost.toLocaleString()}
              </td>
              <td className="border p-0.5 text-right whitespace-nowrap">
                {r.hrg.toLocaleString()}
              </td>
              <td className="border p-0.5 text-right">{r.mrg}</td>
              <td className="border p-0.5 text-center">{r.tag}</td>
              <td className="border p-0.5 text-right whitespace-nowrap">
                {r.promohrg.toLocaleString()}
              </td>
              <td className="border p-0.5 text-right">{r.promomrg}</td>
              <td className="border p-0.5 text-center whitespace-nowrap">
                {r.awal}
              </td>
              <td className="border p-0.5 text-center whitespace-nowrap">
                {r.akhir}
              </td>
              <td className="border p-0.5 text-center">
                <input className="w-14 text-right text-xxs" defaultValue="-" />
              </td>
              <td className="border p-0.5 text-center">{r.mrg}</td>
              <td className="border p-0.5 text-center">
                <button
                  className="btn-hover cursor-not-allowed rounded bg-gray-500 px-1 py-0.5 text-xxs font-bold text-white"
                  disabled>
                  Simpan
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
