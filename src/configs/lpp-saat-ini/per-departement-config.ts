import { ColumnConfig } from "@/types/report";

export type PerDepartementRows = {
  st_div: string;
  st_div_nama: string;
  st_dept: string;
  st_dept_nama: string;
  st_item_produk: number;
  st_saldo_in_pcs: number;
  st_saldo_rph: number;
  st_saldo_rph_lastcost: number;
  st_supp_jumlah: number;
};

export const perDepartementColumns: ColumnConfig<PerDepartementRows>[] = [
  { field: "st_div", label: "Div", isSearchable: true },
  { field: "st_div_nama", label: "Nama Divisi", isSearchable: true },
  { field: "st_dept", label: "Dept", isSearchable: true },
  { field: "st_dept_nama", label: "Nama Departemen", isSearchable: true },
  { field: "st_item_produk", label: "Item Produk", isNumeric: true },
  { field: "st_saldo_in_pcs", label: "Saldo Pcs", isNumeric: true },
  { field: "st_saldo_rph", label: "Saldo RPH", isNumeric: true },
  { field: "st_saldo_rph_lastcost", label: "Saldo RPH Lastcost", isNumeric: true },
  { field: "st_supp_jumlah", label: "Jml Supplier", isNumeric: true },
];
