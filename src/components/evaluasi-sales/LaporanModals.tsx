import { useMemo } from "react";
import ProdukTanggalModal from "@/components/modal/evaluasi-sales/ProdukTanggalModal";
import ProdukModal from "@/components/modal/evaluasi-sales/ProdukModal";
import StrukModal from "@/components/modal/evaluasi-sales/StrukModal";
import StrukViewModal from "@/components/modal/ViewStrukModal";
import { convertToISODate, getMonthRange, type ModalType } from "@/configs/evaluasi-sales/laporan-config";

interface LaporanModalsProps {
  reportType: string;
  activeModal: ModalType | null;
  row: Record<string, unknown> | null;
  query: Record<string, unknown>;
  branch: string;
  onClose: () => void;
}

const LaporanModals = ({ reportType, activeModal, row, query, branch, onClose }: LaporanModalsProps) => {
  const show = activeModal !== null;

  const monthRange = useMemo(() => {
    if (reportType !== "per-bulan") return { startDate: "", endDate: "" };
    return getMonthRange(row?.bulan as string | undefined);
  }, [reportType, row?.bulan]);

  const dateTanggal = useMemo(() => {
    if (reportType !== "per-tanggal" || !row?.tanggal) return { startDate: "", endDate: "" };
    return { startDate: convertToISODate(row.tanggal as string), endDate: convertToISODate(row.tanggal as string) };
  }, [reportType, row?.tanggal]);

  const s = query.startDate as string;
  const e = query.endDate as string;

  if (!show) return null;

  return (
    <>
      {/* ── ProdukTanggalModal ─────────────────────── */}
      {activeModal === "produk-tanggal" && reportType === "per-divisi" && (
        <ProdukTanggalModal show onClose={onClose} startDate={s} endDate={e} div={row?.div as string | undefined} branch={branch} />
      )}
      {activeModal === "produk-tanggal" && reportType === "per-departement" && (
        <ProdukTanggalModal show onClose={onClose} startDate={s} endDate={e} div={row?.div as string | undefined} dept={`${row?.div as string}${row?.dept as string}`} branch={branch} />
      )}
      {activeModal === "produk-tanggal" && reportType === "per-kategori" && (
        <ProdukTanggalModal show onClose={onClose} startDate={s} endDate={e} div={row?.div as string | undefined} dept={`${row?.div as string}${row?.dept as string}`} kat={`${row?.dept as string}${row?.kategori as string}`} branch={branch} />
      )}
      {activeModal === "produk-tanggal" && reportType === "per-tanggal" && (
        <ProdukTanggalModal show onClose={onClose} startDate={dateTanggal.startDate} endDate={dateTanggal.endDate} branch={branch} />
      )}

      {/* ── ProdukModal ───────────────────────────── */}
      {activeModal === "produk" && reportType === "per-divisi" && (
        <ProdukModal show onClose={onClose} startDate={s} endDate={e} div={row?.div as string | undefined} branch={branch} />
      )}
      {activeModal === "produk" && reportType === "per-departement" && (
        <ProdukModal show onClose={onClose} startDate={s} endDate={e} div={row?.div as string | undefined} dept={`${row?.div as string}${row?.dept as string}`} branch={branch} />
      )}
      {activeModal === "produk" && reportType === "per-kategori" && (
        <ProdukModal show onClose={onClose} startDate={s} endDate={e} div={row?.div as string | undefined} dept={`${row?.div as string}${row?.dept as string}`} kat={`${row?.dept as string}${row?.kategori as string}`} branch={branch} />
      )}
      {activeModal === "produk" && reportType === "per-tanggal" && (
        <ProdukModal show onClose={onClose} startDate={dateTanggal.startDate} endDate={dateTanggal.endDate} branch={branch} />
      )}
      {activeModal === "produk" && reportType === "per-supplier" && (
        <ProdukModal show onClose={onClose} startDate={s} endDate={e} kode_supplier={row?.kode_supplier as string | undefined} branch={branch} />
      )}
      {activeModal === "produk" && reportType === "per-struk" && (
        <ProdukModal show onClose={onClose} startDate={s} endDate={e} struk={(row?.struk as string) || ""} branch={branch} />
      )}
      {activeModal === "produk" && reportType === "per-kasir" && (
        <ProdukModal show onClose={onClose} startDate={s} endDate={e} kasir={(row?.kasir as string) || ""} branch={branch} />
      )}
      {activeModal === "produk" && reportType === "per-bulan" && (
        <ProdukModal show onClose={onClose} startDate={monthRange.startDate} endDate={monthRange.endDate} branch={branch} />
      )}
      {activeModal === "produk" && reportType === "per-member" && (
        <ProdukModal show onClose={onClose} startDate={s} endDate={e} noMember={(row?.kd_member as string) || ""} branch={branch} />
      )}

      {/* ── StrukModal ────────────────────────────── */}
      {activeModal === "struk" && reportType === "per-divisi" && (
        <StrukModal show onClose={onClose} startDate={s} endDate={e} div={row?.div as string | undefined} branch={branch} />
      )}
      {activeModal === "struk" && reportType === "per-departement" && (
        <StrukModal show onClose={onClose} startDate={s} endDate={e} div={row?.div as string | undefined} dept={`${row?.div as string}${row?.dept as string}`} branch={branch} />
      )}
      {activeModal === "struk" && reportType === "per-kategori" && (
        <StrukModal show onClose={onClose} startDate={s} endDate={e} div={row?.div as string | undefined} dept={`${row?.div as string}${row?.dept as string}`} kat={`${row?.dept as string}${row?.kategori as string}`} branch={branch} />
      )}
      {activeModal === "struk" && reportType === "per-tanggal" && (
        <StrukModal show onClose={onClose} startDate={dateTanggal.startDate} endDate={dateTanggal.endDate} branch={branch} />
      )}
      {activeModal === "struk" && reportType === "per-supplier" && (
        <StrukModal show onClose={onClose} startDate={s} endDate={e} strukSupplier={(row?.kode_supplier as string) || ""} branch={branch} />
      )}
      {activeModal === "struk" && reportType === "per-kasir" && (
        <StrukModal show onClose={onClose} startDate={s} endDate={e} kasir={(row?.kasir as string) || ""} branch={branch} />
      )}
      {activeModal === "struk" && reportType === "per-bulan" && (
        <StrukModal show onClose={onClose} startDate={monthRange.startDate} endDate={monthRange.endDate} branch={branch} />
      )}
      {activeModal === "struk" && ["per-produk", "per-produk-tanggal"].includes(reportType) && (
        <StrukModal show onClose={onClose} startDate={s} endDate={e} div={row?.div as string | undefined} dept={`${row?.div as string}${row?.dept as string}`} kat={`${row?.dept as string}${row?.kategori as string}`} prdcd={row?.plu as string | undefined} branch={branch} />
      )}

      {/* ── StrukViewModal ────────────────────────── */}
      {activeModal === "struk-view" && reportType === "per-struk" && (
        <StrukViewModal show onClose={onClose} tanggal={(row?.tanggal as string) ?? ""} station={(row?.station as string) ?? ""} kasir={(row?.kasir as string) ?? ""} struk={(row?.struk as string) ?? ""} branch={branch} />
      )}
    </>
  );
};

export default LaporanModals;
