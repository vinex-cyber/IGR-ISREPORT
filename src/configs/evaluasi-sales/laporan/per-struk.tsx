import { FileText, ReceiptText } from "lucide-react";
import { perStrukColumns } from "../per-struk-config";
import type { ReportDefinition } from "./types";

export const perStruk: ReportDefinition = {
  columns: perStrukColumns as ReportDefinition["columns"],
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
    { label: "View Struk", icon: <FileText size={16} />, modal: "struk-view" },
  ],
  paginated: true,
  defaultLimit: 100,
  textHeader: "sm",
  textFooter: "sm",
  textBody: "xs",
};
