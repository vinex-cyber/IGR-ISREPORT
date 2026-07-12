// src/pages/informasi-promosi/modal/ModalBtb.tsx
import { stagger } from "animejs";
import { useAnimeOnScroll } from "@/hooks/animation/useAnimeOnScroll";
import { useFetchData } from "@/hooks/data/useFetchData";
import BaseModal from "@/components/ui/BaseModal";
import { FormatTanggal } from "@/utils/formatTanggal";
import { formatNumber } from "@/utils/formatNumber";

interface RiwayatPembelianRow {
  mstd_typetrn: string;
  mstd_kodesupplier: string;
  mstd_namasupplier: string;
  mstd_qty: string;
  mstd_qtybonus1: string;
  mstd_qtybonus2: string;
  mstd_nodoc: string;
  mstd_tgldoc: string;
  mstd_jam: string;
  mstd_lastcost: string;
  mstd_avgcost: string;
}

interface ModalBtbProps {
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

export default function ModalBtb({
  isOpen,
  onClose,
  plu,
  branch,
  namaProduk,
}: ModalBtbProps) {
  const { data, loading } = useFetchData<RiwayatPembelianRow[]>({
    endpoint: "/informasi-promosi/data-riwayat-pembelian",
    queryParams: plu ? { prdcd: plu } : undefined,
    enabled: Boolean(plu),
  });

  const rows = data ?? [];

  useAnimeOnScroll(
    ".table-btb-modal",
    {
      opacity: [0, 1],
      y: [12, 0],
      duration: 600,
      ease: "outQuad",
      delay: stagger(40),
    },
    {
      threshold: 0.3,
      triggerOnce: true,
      childSelector: ".row-btb-modal",
    },
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Riwayat Pembelian - ${branch}`}
      subtitle={`${plu} - ${namaProduk}`}
      loading={loading}
      empty={rows.length === 0}
      maxWidth="max-w-4xl">
      <div className="overflow-auto">
        <table className="table-btb-modal w-full table-fixed text-[0.5rem]">
          <thead className="sticky top-0 z-10 bg-blue-400">
            <tr className="bg-blue-400 text-center text-[0.5rem] font-bold text-white">
              <th className="border p-1">Supplier</th>
              <th className="border p-1">Qty</th>
              <th className="border p-1">Bonus 1</th>
              <th className="border p-1">Bonus 2</th>
              <th className="border p-1">Docno</th>
              <th className="border p-1">Tanggal</th>
              <th className="border p-1">Jam</th>
              <th className="border p-1">LCost</th>
              <th className="border p-1">ACost</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={`${r.mstd_nodoc}-${i}`}
                className="row-btb-modal border text-center text-[0.5rem] hover:bg-blue-50">
                <td className="border p-1 text-left break-words">
                  {r.mstd_namasupplier || "-"}
                </td>
                <td className="border p-1 text-right">{fmtNum(r.mstd_qty)}</td>
                <td className="border p-1 text-right">
                  {fmtNum(r.mstd_qtybonus1)}
                </td>
                <td className="border p-1 text-right">
                  {fmtNum(r.mstd_qtybonus2)}
                </td>
                <td className="border p-1 text-left">{r.mstd_nodoc || "-"}</td>
                <td className="border p-1 whitespace-nowrap">
                  {FormatTanggal(r.mstd_tgldoc) || "-"}
                </td>
                <td className="border p-1 whitespace-nowrap">{r.mstd_jam || "-"}</td>
                <td className="border p-1 text-right">
                  {fmtNum(r.mstd_lastcost)}
                </td>
                <td className="border p-1 text-right">
                  {fmtNum(r.mstd_avgcost)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BaseModal>
  );
}
