import { ColumnConfig } from "@/types/report";

export type PerProdukRows = {
  st_div: string;
  st_div_nama: string;
  st_dept: string;
  st_dept_nama: string;
  st_katb: string;
  st_katb_nama: string;
  st_prdcd: string;
  st_deskripsi: string;
  st_unit: string;
  st_frac: number;
  st_kodetag: string;
  st_status_tag: string;
  st_lokasi: string;
  st_saldo_ctn: number;
  st_saldo_pcs: number;
  st_saldo_in_pcs: number;
  st_avgcost: number;
  st_saldo_rph: number;
  st_lastcost: number;
  st_saldo_rph_lastcost: number;
  st_pkm: number;
  st_spd: number;
  st_dsi: number;
  st_po_qty: number;
  st_flag: string;
  st_sales_bln_1: number;
  st_sales_bln_2: number;
  st_sales_bln_3: number;
  st_sales_bln_ini: number;
  st_supp_kode: string;
  st_supp_nama: string;
};

export const perProdukColumns: ColumnConfig<PerProdukRows>[] = [
  { field: "st_prdcd", label: "PLU", isSearchable: true },
  { field: "st_deskripsi", label: "Deskripsi", isSearchable: true },
  { field: "st_div", label: "Div" },
  { field: "st_div_nama", label: "Nama Divisi" },
  { field: "st_dept", label: "Dept" },
  { field: "st_dept_nama", label: "Nama Dept" },
  { field: "st_katb", label: "Katb" },
  { field: "st_katb_nama", label: "Nama Kategori" },
  { field: "st_unit", label: "Unit" },
  { field: "st_frac", label: "Frac" },
  { field: "st_kodetag", label: "Tag" },
  { field: "st_status_tag", label: "Status" },
  { field: "st_lokasi", label: "Lokasi" },
  { field: "st_saldo_ctn", label: "Saldo Ctn", isNumeric: true },
  { field: "st_saldo_pcs", label: "Saldo Pcs", isNumeric: true },
  { field: "st_saldo_in_pcs", label: "Saldo Pcs Total", isNumeric: true },
  { field: "st_avgcost", label: "Avg Cost", isNumeric: true },
  { field: "st_saldo_rph", label: "Saldo RPH", isNumeric: true },
  { field: "st_lastcost", label: "Last Cost", isNumeric: true },
  { field: "st_saldo_rph_lastcost", label: "Saldo RPH Lastcost", isNumeric: true },
  { field: "st_pkm", label: "PKM" },
  { field: "st_spd", label: "SPD" },
  { field: "st_dsi", label: "DSI", isNumeric: true },
  { field: "st_po_qty", label: "PO Qty", isNumeric: true },
  { field: "st_supp_kode", label: "Kode Supplier" },
  { field: "st_supp_nama", label: "Nama Supplier" },
  { field: "st_sales_bln_1", label: "Sales Bln 1", isNumeric: true },
  { field: "st_sales_bln_2", label: "Sales Bln 2", isNumeric: true },
  { field: "st_sales_bln_3", label: "Sales Bln 3", isNumeric: true },
  { field: "st_sales_bln_ini", label: "Sales Bln Ini", isNumeric: true },
  { field: "st_flag", label: "Flag" },
];
