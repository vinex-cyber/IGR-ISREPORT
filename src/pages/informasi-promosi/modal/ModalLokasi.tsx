// src/pages/informasi-promosi/modal/ModalLokasi.tsx
import { stagger } from "animejs";
import { useAnimeOnScroll } from "@/hooks/animation/useAnimeOnScroll";
import { useFetchData } from "@/hooks/data/useFetchData";
import BaseModal from "@/components/ui/BaseModal";
import { FormatTanggal } from "@/utils/formatTanggal";

interface LokasiRow {
  lks_lokasi: string;
  prd_prdcd: string;
  prd_deskripsipanjang: string;
  lks_koderak: string;
  lks_kodesubrak: string;
  lks_tiperak: string;
  lks_shelvingrak: string;
  lks_nourut: string;
  lks_qty: string;
  lks_expdate: string;
}

interface ModalLokasiProps {
  isOpen: boolean;
  onClose: () => void;
  plu: string;
  branch: string;
  namaProduk: string;
}

const LOKASI_MAP: Record<string, string> = {
  "1": "Toko",
  "2": "Gudang",
  HDH: "Gudang HDH",
};

export default function ModalLokasi({
  isOpen,
  onClose,
  plu,
  branch,
  namaProduk,
}: ModalLokasiProps) {
  const { data, loading } = useFetchData<LokasiRow[]>({
    endpoint: "/informasi-promosi/data-lokasi",
    queryParams: plu ? { prdcd: plu } : undefined,
    enabled: Boolean(plu),
  });

  const rows = data ?? [];

  useAnimeOnScroll(
    ".table-lokasi-modal",
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
      childSelector: ".row-lokasi-modal",
    },
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Lokasi - ${branch}`}
      subtitle={`${plu} - ${namaProduk}`}
      loading={loading}
      empty={rows.length === 0}>
      <table className="table-lokasi-modal w-full text-xxs">
        <thead>
          <tr className="bg-blue-400 text-center text-xxs font-bold text-white">
            <th className="border p-2">#</th>
            <th className="border p-2">Lokasi</th>
            <th className="border p-2">Kode Rak</th>
            <th className="border p-2">Sub Rak</th>
            <th className="border p-2">Tipe Rak</th>
            <th className="border p-2">Shelving</th>
            <th className="border p-2">No Urut</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Exp Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={`${r.lks_koderak}-${r.lks_kodesubrak}-${r.lks_tiperak}-${r.lks_shelvingrak}-${r.lks_nourut}-${i}`}
              className="row-lokasi-modal border text-center text-xxs hover:bg-blue-50">
              <td className="border p-1.5">{i + 1}</td>
              <td className="border p-1.5 font-medium">
                {LOKASI_MAP[r.lks_lokasi] ?? r.lks_lokasi}
              </td>
              <td className="border p-1.5">{r.lks_koderak}</td>
              <td className="border p-1.5">{r.lks_kodesubrak}</td>
              <td className="border p-1.5">{r.lks_tiperak}</td>
              <td className="border p-1.5">{r.lks_shelvingrak}</td>
              <td className="border p-1.5">{r.lks_nourut}</td>
              <td className="border p-1.5 text-right">
                {Number(r.lks_qty).toLocaleString()}
              </td>
              <td className="border p-1.5">{FormatTanggal(r.lks_expdate) || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </BaseModal>
  );
}
