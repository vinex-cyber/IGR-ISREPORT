import { ReceiptText } from "lucide-react";
import { perMemberColumns } from "../per-member-config";
import type { ReportDefinition } from "./types";

export const perMember: ReportDefinition = {
  columns: perMemberColumns as ReportDefinition["columns"],
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
  paginated: true,
  defaultLimit: 100,
};
