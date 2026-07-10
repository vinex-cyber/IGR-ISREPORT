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

export default function TabelMemberPricing() {
  return (
    <div className="rounded-lg bg-white p-2 shadow-xl">
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
            <tr key={i} className="text-center">
              <td className="border p-0.5">{i}</td>
              {([m.merah, m.biru, m.platinum] as const).flat().map((v, j) => (
                <td key={j} className="border p-0.5 text-right whitespace-nowrap">
                  {v.toLocaleString()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
