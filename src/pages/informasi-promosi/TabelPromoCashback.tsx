// src/pages/informasi-promosi/TabelPromoCashback.tsx
import { stagger } from "animejs";
import { useAnimeOnScroll } from "@/hooks/animation/useAnimeOnScroll";
import { useFetchData } from "@/hooks/data/useFetchData";

interface CashbackApiRow {
  cbd_prdcd: string;
  prd_prdcd: string;
  cbd_kodepromosi: string;
  cbh_namapromosi: string;
  cbd_minstruk: string;
  cbh_minrphprodukpromo: string;
  cbh_mintotbelanja: string;
  cbd_cashback: string;
  alokasi: string;
  alokasi_keluar: string;
  cbk_sisa: string;
  cbd_maxstruk: string;
  cbd_maxmemberperhari: string;
  cbd_maxfrekperevent: string;
  cbd_maxrphperevent: string;
  cbd_alokasistok: string;
  cbh_tglawal: string;
  cbh_tglakhir: string;
  cbd_flagkelipatan: string;
  cba_reguler: string;
  cba_reguler_biruplus: string;
  cba_freepass: string;
  cba_retailer: string;
  cba_silver: string;
  cba_gold1: string;
  cba_gold2: string;
  cba_gold3: string;
  cba_platinum: string;
  cbh_flagigr: string;
  cbh_flagklik: string;
  cbh_flagspi: string;
  cbh_flagtmi: string;
}

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
  periodeSelesai: string;
  jenisMem: string[];
  flagPromo: string[];
}

function mapRow(row: CashbackApiRow): RowCashback {
  const jenisMem: string[] = [];
  if (row.cba_reguler === "1" || row.cba_reguler_biruplus === "1") jenisMem.push("Mb");
  if (row.cba_retailer === "1" || row.cba_silver === "1" || row.cba_gold1 === "1" || row.cba_gold2 === "1" || row.cba_gold3 === "1") jenisMem.push("Mm");
  if (row.cba_platinum === "1") jenisMem.push("Pla");

  const flagPromo: string[] = [];
  if (row.cbh_flagigr === "Y") flagPromo.push("IGR");
  if (row.cbh_flagklik === "Y") flagPromo.push("Klik");
  if (row.cbh_flagspi === "Y") flagPromo.push("SPI");
  if (row.cbh_flagtmi === "Y") flagPromo.push("TMI");

  return {
    kode: row.cbd_kodepromosi,
    namaPromosi: row.cbh_namapromosi,
    minBeliHarga: Number(row.cbd_minstruk ?? 0),
    minBeliSponsor: Number(row.cbh_minrphprodukpromo ?? 0),
    minBeliTotal: Number(row.cbh_mintotbelanja ?? 0),
    nilaiCB: Number(row.cbd_cashback ?? 0),
    jumlahAlokasi: Number(row.alokasi ?? 0),
    alokasiKeluar: Number(row.alokasi_keluar ?? 0),
    sisa: Number(row.cbk_sisa ?? 0),
    maxStruk: Number(row.cbd_maxstruk ?? 0),
    maxMemHari: Number(row.cbd_maxmemberperhari ?? 0),
    maxFrekEvent: Number(row.cbd_maxfrekperevent ?? 0),
    maxRpEvent: Number(row.cbd_maxrphperevent ?? 0),
    periodeMulai: row.cbh_tglawal ?? "",
    periodeSelesai: row.cbh_tglakhir ?? "",
    jenisMem,
    flagPromo,
  };
}

const badgeColor: Record<string, string> = {
  Mb: "bg-blue-500 text-white",
  Mm: "bg-red-500 text-white",
  Pla: "bg-zinc-500 text-white",
  IGR: "bg-blue-500 text-white",
  Klik: "bg-yellow-400 text-black",
  SPI: "bg-green-500 text-white",
  TMI: "bg-purple-500 text-white",
};

function Badge({ label }: { label: string }) {
  return (
    <span
      className={`px-1 rounded text-xxs ${badgeColor[label] ?? "bg-gray-500 text-white"}`}>
      {label}
    </span>
  );
}

interface TabelPromoCashbackProps {
  plu?: string;
}

export default function TabelPromoCashback({ plu }: TabelPromoCashbackProps) {
  const { data, loading } = useFetchData<CashbackApiRow[]>({
    endpoint: "/informasi-promosi/data-promo-cashback",
    queryParams: plu ? { prdcd: plu } : undefined,
    enabled: Boolean(plu),
  });

  const rows = data ? data.map(mapRow) : [];

  useAnimeOnScroll(
    ".table-promo-cashback",
    {
      opacity: [0, 1],
      y: [12, 0],
      duration: 600,
      ease: "outQuad",
      delay: stagger(60),
    },
    {
      threshold: 0.3,
      triggerOnce: true,
      childSelector: ".row-promo-cashback",
    },
  );

  if (!plu) {
    return (
      <div className="table-promo-cashback overflow-x-auto rounded-lg bg-white p-2 shadow-xl">
        <h1 className="bg-slate-300 p-1 text-center font-mono text-xl font-bold">
          Table Promo Cashback
        </h1>
        <table className="w-full text-xxs">
          <thead>
            <tr className="text-center text-xxs font-bold text-white">
              <th className="border bg-blue-400 p-2" rowSpan={2}>Kode</th>
              <th className="border bg-blue-400 p-2" rowSpan={2}>Nama Promosi</th>
              <th className="border bg-green-400 p-2" colSpan={3}>Minimum Beli/Struk</th>
              <th className="border bg-blue-400 p-2" rowSpan={2}>Nilai CB</th>
              <th className="border bg-blue-400 p-2" rowSpan={2}>Jumlah Alokasi</th>
              <th className="border bg-blue-400 p-2" rowSpan={2}>Alokasi Keluar</th>
              <th className="border bg-blue-400 p-2" rowSpan={2}>Sisa</th>
              <th className="border bg-red-400 p-2" colSpan={4}>Maximum Beli/Struk</th>
              <th className="border bg-green-400 p-2" colSpan={2}>Periode</th>
              <th className="border bg-blue-400 p-2" rowSpan={2}>Jenis Mem</th>
              <th className="border bg-blue-400 p-2" rowSpan={2}>Flag Promo</th>
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
            <tr>
              <td colSpan={17} className="border p-2 text-center text-xxs text-gray-400">
                Pilih PLU untuk melihat promo cashback
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-promo-cashback overflow-x-auto rounded-lg bg-white p-2 shadow-xl">
      <h1 className="bg-slate-300 p-1 text-center font-mono text-xl font-bold">
        Table Promo Cashback
      </h1>
      <table className="w-full text-xxs">
        <thead>
          <tr className="text-center text-xxs font-bold text-white">
            <th className="border bg-blue-400 p-2" rowSpan={2}>Kode</th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>Nama Promosi</th>
            <th className="border bg-green-400 p-2" colSpan={3}>Minimum Beli/Struk</th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>Nilai CB</th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>Jumlah Alokasi</th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>Alokasi Keluar</th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>Sisa</th>
            <th className="border bg-red-400 p-2" colSpan={4}>Maximum Beli/Struk</th>
            <th className="border bg-green-400 p-2" colSpan={2}>Periode</th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>Jenis Mem</th>
            <th className="border bg-blue-400 p-2" rowSpan={2}>Flag Promo</th>
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
          {loading ? (
            <tr>
              <td colSpan={17} className="border p-2 text-center text-xxs text-gray-400">
                Memuat...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={17} className="border p-2 text-center text-xxs text-gray-400">
                Tidak ada data
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.kode} className="row-promo-cashback border text-center text-xxs">
                <td className="border p-1">{r.kode}</td>
                <td className="border p-1">{r.namaPromosi}</td>
                <td className="border p-1">{r.minBeliHarga}</td>
                <td className="border p-1">{r.minBeliSponsor.toLocaleString()}</td>
                <td className="border p-1">{r.minBeliTotal.toLocaleString()}</td>
                <td className="border p-1">{r.nilaiCB.toLocaleString()}</td>
                <td className="border p-1">{r.jumlahAlokasi.toLocaleString()}</td>
                <td className="border p-1">{r.alokasiKeluar.toLocaleString()}</td>
                <td className="border p-1">{r.sisa.toLocaleString()}</td>
                <td className="border p-1">{r.maxStruk}</td>
                <td className="border p-1">{r.maxMemHari}</td>
                <td className="border p-1">{r.maxFrekEvent}</td>
                <td className="border p-1">{r.maxRpEvent.toLocaleString()}</td>
                <td className="border p-1">{r.periodeMulai}</td>
                <td className="border p-1">{r.periodeSelesai}</td>
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
