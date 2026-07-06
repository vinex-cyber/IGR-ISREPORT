import { FileText } from "lucide-react";
import { perProdukTanggalColumns } from "../per-produk-tanggal-config";
import type { ReportDefinition } from "./types";

export const perProdukTanggal: ReportDefinition = {
  columns: perProdukTanggalColumns as ReportDefinition["columns"],
  keyField: (row) => row.plu as string,
  rowLabel: (row) => (
    <div>
      <span className="text-xs text-gray-500">Div: {row.div as string} - Dept: {row.dept as string} - Kat: {row.kategori as string}</span>
      <br />
      {row.plu as string} - {row.nama_produk as string}
    </div>
  ),
  actions: [{ label: "Struk", icon: <FileText size={16} />, modal: "struk" }],
  paginated: true,
  defaultLimit: 100,
};
