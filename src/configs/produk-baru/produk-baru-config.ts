import { ColumnConfig } from "@/types/report";

export type ProdukBaruRows = {
  div: string;
  dept: string;
  katb: string;
  plu: string;
  desk: string;
  tgl_awal_penerimaan: string;
};

export const produkBaruColumns: ColumnConfig<ProdukBaruRows>[] = [
  { field: "div", label: "DIV" },
  { field: "dept", label: "DEPT" },
  { field: "katb", label: "KATB" },
  { field: "plu", label: "PLU", isSearchable: true },
  { field: "desk", label: "DESK", isSearchable: true },
  {
    field: "tgl_awal_penerimaan",
    label: "TGL AWAL PENERIMAAN",
    isSearchable: true,
  },
];
