import { FileText, PackageSearch, ReceiptText } from "lucide-react";
import { perDepartementColumns } from "../per-departement-config";
import type { ReportDefinition } from "./types";

export const perDepartement: ReportDefinition = {
  columns: perDepartementColumns as ReportDefinition["columns"],
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
  paginated: true,
  defaultLimit: 100,
};
