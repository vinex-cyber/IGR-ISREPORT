import type { ReportDefinition, ModalType, ActionItem } from "./types";

import { perDivisi } from "./per-divisi";
import { perDepartement } from "./per-departement";
import { perKategori } from "./per-kategori";
import { perTanggal } from "./per-tanggal";
import { perSupplier } from "./per-supplier";
import { perStruk } from "./per-struk";
import { perKasir } from "./per-kasir";
import { perBulan } from "./per-bulan";
import { perProduk } from "./per-produk";
import { perProdukTanggal } from "./per-produk-tanggal";
import { perMember } from "./per-member";

export const REPORT_CONFIG: Record<string, ReportDefinition> = {
  "per-divisi": perDivisi,
  "per-departement": perDepartement,
  "per-kategori": perKategori,
  "per-tanggal": perTanggal,
  "per-supplier": perSupplier,
  "per-struk": perStruk,
  "per-kasir": perKasir,
  "per-bulan": perBulan,
  "per-produk": perProduk,
  "per-produk-tanggal": perProdukTanggal,
  "per-member": perMember,
};

export type { ModalType, ActionItem, ReportDefinition };

export const convertToISODate = (dateStr: string): string => {
  const [day, month, year] = dateStr.split("-");
  return `${year}-${month}-${day}`;
};

export const getMonthRange = (
  monthYear?: string,
): { startDate: string; endDate: string } => {
  if (!monthYear) return { startDate: "", endDate: "" };
  const [monthStr, yearStr] = monthYear.split("-");
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);
  if (isNaN(month) || isNaN(year)) return { startDate: "", endDate: "" };
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);
  const fmt = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  return { startDate: fmt(start), endDate: fmt(end) };
};
