import { FileText, ReceiptText } from "lucide-react";
import { perBulanColumns } from "../per-bulan-config";
import type { ReportDefinition } from "./types";

export const perBulan: ReportDefinition = {
  columns: perBulanColumns as ReportDefinition["columns"],
  keyField: (row) => row.bulan as string,
  rowLabel: (row) => `Tgl: ${row.bulan}`,
  actions: [
    { label: "Produk", icon: <ReceiptText size={16} />, modal: "produk" },
    { label: "Struk", icon: <FileText size={16} />, modal: "struk" },
  ],
  textHeader: "sm",
  textFooter: "sm",
  paginated: true,
  defaultLimit: 100,
};
