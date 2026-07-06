import { FileText, PackageSearch, ReceiptText } from "lucide-react";
import { perDivisiColumns } from "../per-divisi-config";
import type { ReportDefinition } from "./types";

export const perDivisi: ReportDefinition = {
  columns: perDivisiColumns as ReportDefinition["columns"],
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
  paginated: true,
  defaultLimit: 100,
};
