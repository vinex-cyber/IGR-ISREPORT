import { FileText, ReceiptText } from "lucide-react";
import { perSupplierColumns } from "../per-supplier-config";
import type { ReportDefinition } from "./types";

export const perSupplier: ReportDefinition = {
  columns: perSupplierColumns as ReportDefinition["columns"],
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
  paginated: true,
  defaultLimit: 100,
};
