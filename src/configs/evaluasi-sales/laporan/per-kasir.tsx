import { FileText, ReceiptText } from "lucide-react";
import { perKasirColumns } from "../per-kasir-config";
import type { ReportDefinition } from "./types";

export const perKasir: ReportDefinition = {
  columns: perKasirColumns as ReportDefinition["columns"],
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
    { label: "Struk", icon: <FileText size={16} />, modal: "struk" },
  ],
  textHeader: "sm",
  textFooter: "sm",
  textBody: "xs",
  paginated: true,
  defaultLimit: 100,
};
