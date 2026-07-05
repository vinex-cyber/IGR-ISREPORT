import { FileText, PackageSearch, ReceiptText } from "lucide-react";
import type { ColumnConfig } from "@/types/report";
import { perDivisiColumns } from "./per-divisi-config";
import { perDepartementColumns } from "./per-departement-config";
import { perKategoriColumns } from "./per-kategori-config";
import { perTanggalColumns } from "./per-tanggal-config";
import { perSupplierColumns } from "./per-supplier-config";
import { perStrukColumns } from "./per-struk-config";
import { perKasirColumns } from "./per-kasir-config";
import { perBulanColumns } from "./per-bulan-config";
import { perProdukColumns } from "./per-produk-config";
import { perProdukTanggalColumns } from "./per-produk-tanggal-config";
import { perMemberColumns } from "./per-member-config";

export type ModalType = "produk-tanggal" | "produk" | "struk" | "struk-view";

export interface ActionItem {
  label: string;
  icon: React.ReactNode;
  modal: ModalType;
}

export interface ReportDefinition {
  columns: ColumnConfig<Record<string, unknown>>[];
  keyField: (row: Record<string, unknown>) => string;
  rowLabel: (row: Record<string, unknown>) => string | React.ReactNode;
  actions: ActionItem[];
  paginated?: boolean;
  defaultLimit?: number;
  textHeader?: "xs" | "sm" | "md" | "lg" | "xl";
  textBody?: "xs" | "sm" | "md" | "lg" | "xl";
  textFooter?: "xs" | "sm" | "md" | "lg" | "xl";
  sectionClass?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asCols = (cols: any): ColumnConfig<Record<string, unknown>>[] => cols;

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

export const REPORT_CONFIG: Record<string, ReportDefinition> = {
  "per-divisi": {
    columns: asCols(perDivisiColumns),
    keyField: (row) => `${row.div}-${row.nama_div}`,
    rowLabel: (row) => (
      <div>
        <span className="text-xs text-gray-500">Divisi: {row.div as string}</span>
        <br />
        {row.div as string} - {row.nama_div as string}
      </div>
    ),
    actions: [
      { label: "Produk Per Tanggal", icon: <PackageSearch size={16} />, modal: "produk-tanggal" },
      { label: "Produk", icon: <ReceiptText size={16} />, modal: "produk" },
      { label: "Struk", icon: <FileText size={16} />, modal: "struk" },
    ],
    textHeader: "md",
    textBody: "sm",
    textFooter: "md",
    sectionClass: "space-y-2 p-2",
  },
  "per-departement": {
    columns: asCols(perDepartementColumns),
    keyField: (row) => `${row.div}-${row.dept}`,
    rowLabel: (row) => (
      <div>
        <span className="text-xs text-gray-500">Divisi: {row.div as string}</span>
        <br />
        {row.dept as string} - {row.nama_dept as string}
      </div>
    ),
    actions: [
      { label: "Produk Per Tanggal", icon: <PackageSearch size={16} />, modal: "produk-tanggal" },
      { label: "Produk", icon: <ReceiptText size={16} />, modal: "produk" },
      { label: "Struk", icon: <FileText size={16} />, modal: "struk" },
    ],
    sectionClass: "space-y-2 p-2",
  },
  "per-kategori": {
    columns: asCols(perKategoriColumns),
    keyField: (row) => `${row.div}-${row.dept}-${row.kategori}`,
    rowLabel: (row) => (
      <div>
        <span className="text-xs text-gray-500">Div: {row.div as string} - Dept: {row.dept as string}</span>
        <br />
        {row.kategori as string} - {row.nama_kategori as string}
      </div>
    ),
    actions: [
      { label: "Produk Per Tanggal", icon: <PackageSearch size={16} />, modal: "produk-tanggal" },
      { label: "Produk", icon: <ReceiptText size={16} />, modal: "produk" },
      { label: "Struk", icon: <FileText size={16} />, modal: "struk" },
    ],
  },
  "per-tanggal": {
    columns: asCols(perTanggalColumns),
    keyField: (row) => row.tanggal as string,
    rowLabel: (row) => `Tgl: ${row.tanggal}`,
    actions: [
      { label: "Produk Per Tanggal", icon: <PackageSearch size={16} />, modal: "produk-tanggal" },
      { label: "Produk", icon: <ReceiptText size={16} />, modal: "produk" },
      { label: "Struk", icon: <FileText size={16} />, modal: "struk" },
    ],
    textHeader: "sm",
    textFooter: "sm",
  },
  "per-supplier": {
    columns: asCols(perSupplierColumns),
    keyField: (row) => row.kode_supplier as string,
    rowLabel: (row) => (
      <div>
        <span className="text-xs text-gray-500">Supplier: {row.kode_supplier as string}</span>
        <br />
        {row.kode_supplier as string} - {row.nama_supplier as string}
      </div>
    ),
    actions: [
      { label: "Produk", icon: <ReceiptText size={16} />, modal: "produk" },
      { label: "Struk", icon: <FileText size={16} />, modal: "struk" },
    ],
    textHeader: "sm",
    textFooter: "sm",
    textBody: "xs",
  },
  "per-struk": {
    columns: asCols(perStrukColumns),
    keyField: (row) => row.struk as string,
    rowLabel: (row) => (
      <div>
        <span className="text-xs text-gray-500">Struk: {row.struk as string}</span>
        <br />
        {row.kd_member as string} - {row.nama_member as string}
      </div>
    ),
    actions: [
      { label: "Produk", icon: <ReceiptText size={16} />, modal: "produk" },
      { label: "View Struk", icon: <ReceiptText size={16} />, modal: "struk-view" },
    ],
    paginated: true,
    defaultLimit: 100,
    textHeader: "sm",
    textFooter: "sm",
    textBody: "xs",
  },
  "per-kasir": {
    columns: asCols(perKasirColumns),
    keyField: (row) => row.kasir as string,
    rowLabel: (row) => (
      <div>
        <span className="text-xs text-gray-500">Kasir: {row.kasir as string}</span>
        <br />
        {row.nama_kasir as string}
      </div>
    ),
    actions: [
      { label: "Produk", icon: <ReceiptText size={16} />, modal: "produk" },
      { label: "Struk", icon: <ReceiptText size={16} />, modal: "struk" },
    ],
    textHeader: "sm",
    textFooter: "sm",
    textBody: "xs",
  },
  "per-bulan": {
    columns: asCols(perBulanColumns),
    keyField: (row) => row.bulan as string,
    rowLabel: (row) => `Tgl: ${row.bulan}`,
    actions: [
      { label: "Produk", icon: <ReceiptText size={16} />, modal: "produk" },
      { label: "Struk", icon: <FileText size={16} />, modal: "struk" },
    ],
    textHeader: "sm",
    textFooter: "sm",
  },
  "per-produk": {
    columns: asCols(perProdukColumns),
    keyField: (row) => row.plu as string,
    rowLabel: (row) => (
      <div>
        <span className="text-xs text-gray-500">Div: {row.div as string} - Dept: {row.dept as string} - Kat: {row.kategori as string}</span>
        <br />
        {row.plu as string} - {row.nama_produk as string}
      </div>
    ),
    actions: [{ label: "Struk", icon: <FileText size={16} />, modal: "struk" }],
  },
  "per-produk-tanggal": {
    columns: asCols(perProdukTanggalColumns),
    keyField: (row) => row.plu as string,
    rowLabel: (row) => (
      <div>
        <span className="text-xs text-gray-500">Div: {row.div as string} - Dept: {row.dept as string} - Kat: {row.kategori as string}</span>
        <br />
        {row.plu as string} - {row.nama_produk as string}
      </div>
    ),
    actions: [{ label: "Struk", icon: <FileText size={16} />, modal: "struk" }],
  },
  "per-member": {
    columns: asCols(perMemberColumns),
    keyField: (row) => `${row.kd_member}-${row.outlet}`,
    rowLabel: (row) => (
      <div>
        <span className="text-xs text-gray-500">Kode: {row.kd_member as string}</span>
        <br />
        <span className="text-xs text-gray-500">Nama: {row.nama_member as string}</span>
      </div>
    ),
    actions: [{ label: "Produk", icon: <ReceiptText size={16} />, modal: "produk" }],
    textHeader: "sm",
    textFooter: "sm",
    textBody: "xs",
  },
};
