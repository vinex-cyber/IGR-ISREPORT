// src/pages/informasi-promosi/modal/ModalPembelian.tsx
import { stagger } from "animejs";
import { useAnimeOnScroll } from "@/hooks/animation/useAnimeOnScroll";
import { useFetchData } from "@/hooks/data/useFetchData";
import BaseModal from "@/components/ui/BaseModal";
import { FormatTanggal } from "@/utils/formatTanggal";
import { formatNumber } from "@/utils/formatNumber";

interface PembelianRow {
  pbh_tglpb: string;
  pbd_nopb: string;
  pbd_prdcd: string;
  pbd_qtypb: string;
  pbd_rp: string;
  pbd_pkmt: string;
  pbd_saldoakhir: string;
  pbh_keteranganpb: string;
  pbd_nopo: string;
  tpod_tglpo: string;
  tpod_qtypo: string;
  mstd_nodoc: string;
  mstd_tgldoc: string;
  mstd_qty: string;
  mstd_rp: string;
  sup_jangkawaktukirimbarang: string;
  hgb_kodesupplier: string;
  sup_namasupplier: string;
  ket: string | null;
}

interface ModalPembelianProps {
  isOpen: boolean;
  onClose: () => void;
  plu: string;
  branch: string;
  namaProduk: string;
}

function fmtNum(v: string | null | undefined) {
  if (v === null || v === undefined || v === "") return "-";
  const n = Number(v);
  if (isNaN(n)) return "-";
  return formatNumber(n);
}

function ketBadge(ket: string | null) {
  if (!ket) return "-";
  const colorMap: Record<string, string> = {
    "Brg blm dikirim": "bg-yellow-100 text-yellow-700",
    "POmati/Kdlwarsa": "bg-red-100 text-red-700",
    "PO Alokasi/Mati": "bg-red-100 text-red-700",
    "QTY BPB 0": "bg-orange-100 text-orange-700",
    "PO Alokasi": "bg-blue-100 text-blue-700",
    "Sudah BTB": "bg-green-100 text-green-700",
  };
  const cls = colorMap[ket] ?? "bg-gray-100 text-gray-700";
  return (
    <span
      className={`inline-block rounded px-1.5 py-0.5 text-[0.5rem] font-medium ${cls}`}>
      {ket}
    </span>
  );
}

export default function ModalPbPoBtb({
  isOpen,
  onClose,
  plu,
  branch,
  namaProduk,
}: ModalPembelianProps) {
  const { data, loading } = useFetchData<PembelianRow[]>({
    endpoint: "/informasi-promosi/data-pembelian",
    queryParams: plu ? { prdcd: plu } : undefined,
    enabled: Boolean(plu),
  });

  const rows = data ?? [];

  useAnimeOnScroll(
    ".table-pembelian-modal",
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
      childSelector: ".row-pembelian-modal",
    },
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Pembelian - ${branch}`}
      subtitle={`${plu} - ${namaProduk}`}
      loading={loading}
      empty={rows.length === 0}
      maxWidth="max-w-4xl">
      <div className="overflow-auto">
        <table className="table-pembelian-modal w-full table-fixed text-[0.5rem]">
          <thead className="sticky top-0 z-10 bg-blue-400">
            <tr className="bg-blue-400 text-center text-[0.5rem] font-bold text-white">
              <th className="border p-2" colSpan={7}>
                PB
              </th>
              <th className="border p-2" colSpan={3}>
                PO
              </th>
              <th className="border p-2" colSpan={6}>
                BTB
              </th>
            </tr>
            <tr className="bg-blue-400 text-center text-[0.5rem] font-bold text-white">
              <th className="border p-1">No</th>
              <th className="border p-1">Tgl</th>
              <th className="border p-1">Qty</th>
              <th className="border p-1">Rp</th>
              <th className="border p-1">Pkmt</th>
              <th className="border p-1">Saldo Akhir</th>
              <th className="border p-1">Keterangan</th>
              <th className="border p-1">No</th>
              <th className="border p-1">Tgl</th>
              <th className="border p-1">Qty</th>
              <th className="border p-1">No</th>
              <th className="border p-1">Tgl</th>
              <th className="border p-1">Qty</th>
              <th className="border p-1">Rp</th>
              <th className="border p-1">Ket</th>
              <th className="border p-1">Kode Sup</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={`${r.pbd_nopb}-${r.pbd_nopo}-${r.mstd_nodoc}-${i}`}
                className="row-pembelian-modal border text-center text-[0.5rem] hover:bg-blue-50">
                <td className="border p-1 text-left text-[0.5rem] leading-tight break-words">
                  {r.pbd_nopb || "-"}
                </td>
                <td className="border p-1 whitespace-nowrap">
                  {FormatTanggal(r.pbh_tglpb) || "-"}
                </td>
                <td className="border p-1 text-right text-[0.5rem]">
                  {fmtNum(r.pbd_qtypb)}
                </td>
                <td className="border p-1 text-right text-[0.5rem]">
                  {fmtNum(r.pbd_rp)}
                </td>
                <td className="border p-1 text-right text-[0.5rem]">
                  {fmtNum(r.pbd_pkmt)}
                </td>
                <td className="border p-1 text-right text-[0.5rem]">
                  {fmtNum(r.pbd_saldoakhir)}
                </td>
                <td className="border p-1 truncate">
                  {r.pbh_keteranganpb || "-"}
                </td>
                <td className="border p-1 text-left text-[0.5rem] leading-tight break-words">
                  {r.pbd_nopo || "-"}
                </td>
                <td className="border p-1 whitespace-nowrap">
                  {FormatTanggal(r.tpod_tglpo) || "-"}
                </td>
                <td className="border p-1 text-right text-[0.5rem]">
                  {fmtNum(r.tpod_qtypo)}
                </td>
                <td className="border p-1 text-left text-[0.5rem] leading-tight break-words">
                  {r.mstd_nodoc || "-"}
                </td>
                <td className="border p-1 whitespace-nowrap">
                  {FormatTanggal(r.mstd_tgldoc) || "-"}
                </td>
                <td className="border p-1 text-right text-[0.5rem]">
                  {fmtNum(r.mstd_qty)}
                </td>
                <td className="border p-1 text-right text-[0.5rem]">
                  {fmtNum(r.mstd_rp)}
                </td>
                <td className="border p-1">{ketBadge(r.ket)}</td>
                <td className="border p-1 text-left text-[0.5rem] leading-tight">
                  {r.hgb_kodesupplier || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BaseModal>
  );
}
