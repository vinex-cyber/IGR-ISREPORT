interface RowGift {
  kode: string;
  namaPromosi: string;
  minBeliQty: number;
  minBeliRph: number;
  minTotalStruk: number;
  minTotalSponsor: number;
  maxJumlhHari: number;
  maxFrekHari: number;
  maxJumlhEvent: number;
  maxFrekEvent: number;
  hadiahQty: number | string;
  hadiahNama: string;
  periodeAwal: string;
  periodeMulai: string;
  jenisMem: string[];
  flagPromo: string[];
}

const badgeColor: Record<string, string> = {
  Mb: "bg-blue-500 text-white",
  Mm: "bg-red-500 text-white",
  Pla: "bg-zinc-500 text-white",
  IGR: "bg-blue-500 text-white",
  Klik: "bg-yellow-400 text-black",
};

function Badge({ label }: { label: string }) {
  return (
    <span
      className={`px-1 rounded text-xxs ${badgeColor[label] ?? "bg-gray-500 text-white"}`}>
      {label}
    </span>
  );
}

const rows: RowGift[] = [
  {
    kode: "GJZ82",
    namaPromosi: "GF+KLIK INDOFOOD NOODLE FEST LOKAL [JAWA]",
    minBeliQty: 0,
    minBeliRph: 0,
    minTotalStruk: 0,
    minTotalSponsor: 350_000,
    maxJumlhHari: 0,
    maxFrekHari: 0,
    maxJumlhEvent: 0,
    maxFrekEvent: 0,
    hadiahQty: 3,
    hadiahNama: "INDOMIE MIE GORENG PLUS SPECIAL PCK 80g",
    periodeAwal: "04-07-2026",
    periodeMulai: "17-07-2026",
    jenisMem: ["Mb", "Mm", "Pla"],
    flagPromo: ["IGR", "Klik"],
  },
  {
    kode: "GKA09",
    namaPromosi: "EXTRA POIN ITEM TAMBAH UNTUNG - NAS 2",
    minBeliQty: 0,
    minBeliRph: 0,
    minTotalStruk: 0,
    minTotalSponsor: 500_000,
    maxJumlhHari: 0,
    maxFrekHari: 5,
    maxJumlhEvent: 0,
    maxFrekEvent: 0,
    hadiahQty: "1,000",
    hadiahNama: "",
    periodeAwal: "08-07-2026",
    periodeMulai: "14-07-2026",
    jenisMem: ["Mm", "Pla"],
    flagPromo: ["IGR", "Klik"],
  },
  {
    kode: "GKA18",
    namaPromosi: "EXTRA POIN INDOMIE MIE GORENG PLUS BBMU - NAS",
    minBeliQty: 200,
    minBeliRph: 0,
    minTotalStruk: 0,
    minTotalSponsor: 0,
    maxJumlhHari: 0,
    maxFrekHari: 1,
    maxJumlhEvent: 0,
    maxFrekEvent: 0,
    hadiahQty: "2,500",
    hadiahNama: "",
    periodeAwal: "08-07-2026",
    periodeMulai: "14-07-2026",
    jenisMem: ["Mm", "Pla"],
    flagPromo: ["IGR", "Klik"],
  },
];

export default function TabelPromoGift() {
  return (
    <div className="overflow-x-auto rounded-lg bg-white p-2 shadow-xl dark:bg-gray-800 dark:text-gray-200">
      <h1 className="bg-slate-300 p-1 text-center font-mono text-xl font-bold dark:bg-slate-700 dark:text-gray-200">
        Table Promo Gift
      </h1>
      <table className="w-full text-xxs">
        <thead>
          <tr className="text-center text-xxs font-bold text-white">
            <th className="border bg-blue-400 p-2" rowSpan={2}>Kode</th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>Nama Promosi</th>
            <th className="border bg-green-400 p-2" colSpan={2}>Minimum Beli</th>
            <th className="border bg-green-400 p-2" colSpan={2}>Minimum Total Belanja</th>
            <th className="border bg-red-400 p-2" colSpan={2}>Maximum Total Belanja</th>
            <th className="border bg-red-400 p-2" colSpan={2}>Maximum / Event</th>
            <th className="border bg-green-400 p-2" colSpan={2}>Hadiah</th>
            <th className="border bg-green-400 p-2" colSpan={2}>Periode</th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>Jenis Mem</th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>Flag Promo</th>
          </tr>
          <tr className="text-center text-xxs font-bold text-white">
            <th className="border bg-green-400 p-1">Qty</th>
            <th className="border bg-green-400 p-1">Rph</th>
            <th className="border bg-green-400 p-1">Struk</th>
            <th className="border bg-green-400 p-1">Sponsor</th>
            <th className="border bg-red-400 p-1">Jumlh / Hari</th>
            <th className="border bg-red-400 p-1">Frek / Hari</th>
            <th className="border bg-red-400 p-1">Jumlh / Event</th>
            <th className="border bg-red-400 p-1">Frek / Event</th>
            <th className="border bg-green-400 p-1">Qty</th>
            <th className="border bg-green-400 p-1">Nama</th>
            <th className="border bg-green-400 p-1">Awal</th>
            <th className="border bg-green-400 p-1">Mulai</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.kode} className="border text-center text-xxs">
              <td className="border p-2">{r.kode}</td>
              <td className="border p-2">{r.namaPromosi}</td>
              <td className="border p-2">{r.minBeliQty}</td>
              <td className="border p-2">{r.minBeliRph}</td>
              <td className="border p-2">{r.minTotalStruk}</td>
              <td className="border p-2">{r.minTotalSponsor.toLocaleString()}</td>
              <td className="border p-2">{r.maxJumlhHari}</td>
              <td className="border p-2">{r.maxFrekHari}</td>
              <td className="border p-2">{r.maxJumlhEvent}</td>
              <td className="border p-2">{r.maxFrekEvent}</td>
              <td className="border p-2">{typeof r.hadiahQty === "number" ? r.hadiahQty : r.hadiahQty}</td>
              <td className="border p-2">{r.hadiahNama}</td>
              <td className="border p-2">{r.periodeAwal}</td>
              <td className="border p-2">{r.periodeMulai}</td>
              <td className="border p-2">
                <div className="flex items-center justify-around gap-0.5">
                  {r.jenisMem.map((b) => (
                    <Badge key={b} label={b} />
                  ))}
                </div>
              </td>
              <td className="border p-2">
                <div className="flex items-center justify-around gap-0.5">
                  {r.flagPromo.map((b) => (
                    <Badge key={b} label={b} />
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
