// src/pages/informasi-promosi/modal/ModalSoIc.tsx
import { stagger } from "animejs";
import { useAnimeOnScroll } from "@/hooks/animation/useAnimeOnScroll";
import { useFetchData } from "@/hooks/data/useFetchData";
import BaseModal from "@/components/ui/BaseModal";
import { FormatTanggal } from "@/utils/formatTanggal";

interface SoIcRow {
  rso_tglso: string;
  prd_kodedivisi: string;
  prd_kodedepartement: string;
  prd_kodekategoribarang: string;
  rso_prdcd: string;
  prd_unit: string;
  prd_frac: string;
  flag: string;
  toko: string;
  gudang: string;
  rso_qtylpp: string;
  rso_qtyreset: string;
  rph: string;
  hgb_kodesupplier: string;
  sup_namasupplier: string;
}

interface ModalSoIcProps {
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
  return Math.round(n).toLocaleString("en-US");
}

export default function ModalSoIc({
  isOpen,
  onClose,
  plu,
  branch,
  namaProduk,
}: ModalSoIcProps) {
  const { data, loading } = useFetchData<SoIcRow[]>({
    endpoint: "/informasi-promosi/data-so-ic",
    queryParams: plu ? { prdcd: plu } : undefined,
    enabled: Boolean(plu),
  });

  const rows = data ?? [];

  useAnimeOnScroll(
    ".table-soic-modal",
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
      childSelector: ".row-soic-modal",
    },
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`SO IC - ${branch}`}
      subtitle={`${plu} - ${namaProduk}`}
      loading={loading}
      empty={rows.length === 0}
      maxWidth="max-w-4xl">
      <table className="table-soic-modal w-full table-fixed text-xxs">
        <thead>
          <tr className="bg-blue-400 text-center text-xxs font-bold text-white">
            <th className="border p-2" rowSpan={2}>
              Tgl SO
            </th>
            <th className="border p-2" colSpan={3}>
              Divisi
            </th>
            <th className="border p-2" rowSpan={2}>
              PLU
            </th>
            <th className="border p-2" rowSpan={2}>
              Unit
            </th>
            <th className="border p-2" rowSpan={2}>
              Flag
            </th>
            <th className="border p-2" colSpan={2}>
              Qty
            </th>
            <th className="border p-2" rowSpan={2}>
              Qty LPP
            </th>
            <th className="border p-2" rowSpan={2}>
              Qty Reset
            </th>
            <th className="border p-2" rowSpan={2}>
              RPH
            </th>
            <th className="border p-2" colSpan={2}>
              Supplier
            </th>
          </tr>
          <tr className="bg-blue-400 text-center text-xxs font-bold text-white">
            <th className="border p-1">Div</th>
            <th className="border p-1">Dept</th>
            <th className="border p-1">Kat</th>
            <th className="border p-1">Toko</th>
            <th className="border p-1">Gudang</th>
            <th className="border p-1">Kode</th>
            <th className="border p-1">Nama</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={`${r.rso_tglso}-${r.rso_prdcd}-${i}`}
              className="row-soic-modal border text-center text-xxs hover:bg-blue-50">
              <td className="border p-1.5">                  {FormatTanggal(r.rso_tglso) || "-"}</td>
              <td className="border p-1.5">{r.prd_kodedivisi}</td>
              <td className="border p-1.5">{r.prd_kodedepartement}</td>
              <td className="border p-1.5">{r.prd_kodekategoribarang}</td>
              <td className="border p-1.5">{r.rso_prdcd}</td>
              <td className="border p-1.5">{r.prd_unit}</td>
              <td className="border p-1.5 font-medium">{r.flag}</td>
              <td className="border p-1.5 text-right">{fmtNum(r.toko)}</td>
              <td className="border p-1.5 text-right">{fmtNum(r.gudang)}</td>
              <td className="border p-1.5 text-right">
                {fmtNum(r.rso_qtylpp)}
              </td>
              <td className="border p-1.5 text-right">
                {fmtNum(r.rso_qtyreset)}
              </td>
              <td className="border p-1.5 text-right">{fmtNum(r.rph)}</td>
              <td className="border p-1.5">{r.hgb_kodesupplier}</td>
              <td className="border p-1.5 truncate">{r.sup_namasupplier}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </BaseModal>
  );
}
