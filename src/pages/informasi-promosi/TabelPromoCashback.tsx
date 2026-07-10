interface RowCashback {
  kode: string;
  namaPromosi: string;
  minBeliHarga: number;
  minBeliSponsor: number;
  minBeliTotal: number;
  nilaiCB: number;
  jumlahAlokasi: number;
  alokasiKeluar: number;
  sisa: number;
  maxStruk: number;
  maxMemHari: number;
  maxFrekEvent: number;
  maxRpEvent: number;
  periodeMulai: string;
  PeriodeSelesai: string;
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

const rows: RowCashback[] = [
  {
    kode: "CNNI2",
    namaPromosi: "PWP PROMOSI SHOPEEPAY & SPAYLATER [NAS]",
    minBeliHarga: 40,
    minBeliSponsor: 0,
    minBeliTotal: 500_000,
    nilaiCB: 10_000,
    jumlahAlokasi: 99_999_999,
    alokasiKeluar: 14,
    sisa: 99_999_985,
    maxStruk: 40,
    maxMemHari: 40,
    maxFrekEvent: 0,
    maxRpEvent: 0,
    periodeMulai: "01-06-2026",
    PeriodeSelesai: "31-08-2026",
    jenisMem: ["Mb", "Mm", "Pla"],
    flagPromo: ["IGR"],
  },
  {
    kode: "CNVW7",
    namaPromosi: "POT+KLIK INDOFOOD NOODLE - CPG",
    minBeliHarga: 40,
    minBeliSponsor: 0,
    minBeliTotal: 0,
    nilaiCB: 2_500,
    jumlahAlokasi: 99_999_999,
    alokasiKeluar: 5_755,
    sisa: 99_994_244,
    maxStruk: 400,
    maxMemHari: 400,
    maxFrekEvent: 0,
    maxRpEvent: 0,
    periodeMulai: "01-07-2026",
    PeriodeSelesai: "31-07-2026",
    jenisMem: ["Mm"],
    flagPromo: ["IGR", "Klik"],
  },
  {
    kode: "CNVW8",
    namaPromosi: "POT INDOFOOD NOODLE MP - CPG",
    minBeliHarga: 40,
    minBeliSponsor: 0,
    minBeliTotal: 0,
    nilaiCB: 2_500,
    jumlahAlokasi: 99_999_999,
    alokasiKeluar: 198,
    sisa: 99_999_801,
    maxStruk: 800,
    maxMemHari: 800,
    maxFrekEvent: 0,
    maxRpEvent: 0,
    periodeMulai: "01-07-2026",
    PeriodeSelesai: "31-07-2026",
    jenisMem: ["Pla"],
    flagPromo: ["IGR"],
  },
  {
    kode: "COBM9",
    namaPromosi: "POT+KLIK INDOMIE MIE GORENG PLUS SPECIAL [NAS]",
    minBeliHarga: 40,
    minBeliSponsor: 0,
    minBeliTotal: 0,
    nilaiCB: 2_000,
    jumlahAlokasi: 99_999_999,
    alokasiKeluar: 3_869,
    sisa: 99_996_130,
    maxStruk: 400,
    maxMemHari: 400,
    maxFrekEvent: 0,
    maxRpEvent: 0,
    periodeMulai: "01-07-2026",
    PeriodeSelesai: "14-07-2026",
    jenisMem: ["Mm", "Pla"],
    flagPromo: ["IGR", "Klik"],
  },
];

export default function TabelPromoCashback() {
  return (
    <div className="overflow-x-auto rounded-lg bg-white p-2 shadow-xl">
      <h1 className="bg-slate-300 p-1 text-center font-mono text-xl font-bold">
        Table Promo Cashback
      </h1>
      <table className="w-full text-xxs">
        <thead>
          <tr className="text-center text-xxs font-bold text-white">
            <th className="border bg-blue-400 p-2" rowSpan={2}>
              Kode
            </th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>
              Nama Promosi
            </th>
            <th className="border bg-green-400 p-2" colSpan={3}>
              Minimum Beli/Struk
            </th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>
              Nilai CB
            </th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>
              Jumlah Alokasi
            </th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>
              Alokasi Keluar
            </th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>
              Sisa
            </th>
            <th className="border bg-red-400 p-2" colSpan={4}>
              Maximum Beli/Struk
            </th>
            <th className="border bg-green-400 p-2" colSpan={2}>
              Periode
            </th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>
              Jenis Mem
            </th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>
              Flag Promo
            </th>
          </tr>
          <tr className="text-center text-xxs font-bold text-white">
            <th className="border bg-green-400 p-1">Harga</th>
            <th className="border bg-green-400 p-1">Sponsor Rp</th>
            <th className="border bg-green-400 p-1">Total Rp</th>
            <th className="border bg-red-400 p-1">Struk</th>
            <th className="border bg-red-400 p-1">Mem / Hari</th>
            <th className="border bg-red-400 p-1">Frek / Event</th>
            <th className="border bg-red-400 p-1">Rp / Event</th>
            <th className="border bg-green-400 p-1">Mulai</th>
            <th className="border bg-green-400 p-1">Selesai</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.kode} className="border text-center text-xxs">
              <td className="border p-1">{r.kode}</td>
              <td className="border p-1">{r.namaPromosi}</td>
              <td className="border p-1">{r.minBeliHarga}</td>
              <td className="border p-1">{r.minBeliSponsor}</td>
              <td className="border p-1">{r.minBeliTotal.toLocaleString()}</td>
              <td className="border p-1">{r.nilaiCB.toLocaleString()}</td>
              <td className="border p-1">{r.jumlahAlokasi.toLocaleString()}</td>
              <td className="border p-1">{r.alokasiKeluar.toLocaleString()}</td>
              <td className="border p-1">{r.sisa.toLocaleString()}</td>
              <td className="border p-1">{r.maxStruk}</td>
              <td className="border p-1">{r.maxMemHari}</td>
              <td className="border p-1">{r.maxFrekEvent}</td>
              <td className="border p-1">{r.maxRpEvent}</td>
              <td className="border p-1">{r.periodeMulai}</td>
              <td className="border p-1">{r.PeriodeSelesai}</td>
              <td className="border p-1">
                <div className="flex items-center justify-around gap-0.5">
                  {r.jenisMem.map((b) => (
                    <Badge key={b} label={b} />
                  ))}
                </div>
              </td>
              <td className="border p-1">
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
