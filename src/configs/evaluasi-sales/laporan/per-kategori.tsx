import { FileText, PackageSearch, ReceiptText } from "lucide-react";
import { perKategoriColumns } from "../per-kategori-config";
import type { ReportDefinition } from "./types";

export const perKategori: ReportDefinition = {
  columns: perKategoriColumns as ReportDefinition["columns"],
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
  paginated: true,
  defaultLimit: 100,
};
