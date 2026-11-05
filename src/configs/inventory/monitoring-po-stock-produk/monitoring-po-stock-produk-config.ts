import type { ColumnConfig } from "@/types/report";

export type MonitoringPoStockProdukRows = {
  div: string;
  dept: string;
  kat: string;
  plu: string;
  nama_barang: string;
  frac: number;
  unit: string;
  tag: string;
  stock: number;
  dsi: number;
  lcost: number;
  acost: number;
  hgbeli: number;
  po_out: number;
  nopo: string;
  ket: string | null;
  sales_jalan: number;
  bulan_1: number;
  bulan_2: number;
  bulan_3: number;
  avgsls_qty: number;
  pkm: number;
  minorder: number;
  kd_supl: string;
  nama_supplier: string;
};

export const monitoringPoStockProdukColumns: ColumnConfig<MonitoringPoStockProdukRows>[] =
  [
    { field: "div", label: "Divisi" },
    { field: "dept", label: "Departemen" },
    { field: "kat", label: "Kategori" },
    { field: "plu", label: "PLU", isSearchable: true },
    { field: "nama_barang", label: "Nama Barang", isSearchable: true },
    { field: "frac", label: "Frac" },
    { field: "unit", label: "Unit" },
    { field: "tag", label: "Tag" },
    { field: "stock", label: "Stock" },
    { field: "dsi", label: "DSI" },
    { field: "lcost", label: "Lcost" },
    { field: "acost", label: "ACost" },
    { field: "hgbeli", label: "HGBeli" },
    { field: "po_out", label: "PO Out" },
    { field: "nopo", label: "No PO", isSearchable: true },
    { field: "ket", label: "Keterangan", isSearchable: true },
    { field: "sales_jalan", label: "Sales Jalan" },
    { field: "bulan_1", label: "Bulan 1" },
    { field: "bulan_2", label: "Bulan 2" },
    { field: "bulan_3", label: "Bulan 3" },
    { field: "avgsls_qty", label: "Avg Sls Qty" },
    { field: "pkm", label: "PKM" },
    { field: "minorder", label: "Min Order" },
    { field: "kd_supl", label: "Kode Supplier", isSearchable: true },
    { field: "nama_supplier", label: "Nama Supplier", isSearchable: true },
  ];
