import { FileText, PackageSearch, ReceiptText } from "lucide-react";
import { perTanggalColumns } from "../per-tanggal-config";
import type { ReportDefinition } from "./types";

export const perTanggal: ReportDefinition = {
  columns: perTanggalColumns as ReportDefinition["columns"],
  keyField: (row) => row.tanggal as string,
  rowLabel: (row) => `Tgl: ${row.tanggal}`,
  actions: [
    { label: "Produk Per Tanggal", icon: <PackageSearch size={16} />, modal: "produk-tanggal" },
    { label: "Produk", icon: <ReceiptText size={16} />, modal: "produk" },
    { label: "Struk", icon: <FileText size={16} />, modal: "struk" },
  ],
  textHeader: "sm",
  textFooter: "sm",
  paginated: true,
  defaultLimit: 100,
};
