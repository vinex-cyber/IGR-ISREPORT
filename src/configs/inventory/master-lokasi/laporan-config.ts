import { FormatTanggalISO } from "@/utils/formatTanggal";
import { ColumnConfig } from "@/types/report";

export type MasterLokasiRows = {
  alamat: string;
  Jenis: string;
  prd_kodedivisi: string;
  prd_kodedepartement: string;
  prd_kodekategoribarang: string;
  prd_prdcd: string;
  prd_deskripsipanjang: string;
  prd_frac: string;
  prd_kodetag: string;
  plano: number;
  LPP: number;
  ACOST: number;
  PKM_PKMT: number;
  AVG_REG: number;
  AVG_MM: number;
  hgb_kodesupplier: string;
  sup_namasupplier: string;
  lks_maxdisplay: number;
  lks_maxplano: number;
  lks_minpct: number;
  lks_expdate: string;
  maxpalet: number;
};

export const masterLokasiColumns: ColumnConfig<MasterLokasiRows>[] = [
  { field: "alamat", label: "Alamat", isSearchable: true },
  { field: "Jenis", label: "Jenis", isSearchable: true },
  { field: "prd_kodedivisi", label: "Divisi" },
  { field: "prd_kodedepartement", label: "Departemen" },
  { field: "prd_kodekategoribarang", label: "Kategori" },
  { field: "prd_prdcd", label: "PLU", isSearchable: true },
  { field: "prd_deskripsipanjang", label: "Nama Barang", isSearchable: true },
  { field: "prd_frac", label: "Frac/Unit" },
  { field: "prd_kodetag", label: "Tag" },
  { field: "plano", label: "Plano", isNumeric: true },
  { field: "LPP", label: "LPP", isNumeric: true },
  { field: "ACOST", label: "A Cost", isNumeric: true },
  { field: "PKM_PKMT", label: "PKM", isNumeric: true },
  { field: "AVG_REG", label: "Avg Reg", isNumeric: true },
  { field: "AVG_MM", label: "Avg MM", isNumeric: true },
  { field: "hgb_kodesupplier", label: "Kode Supplier", isSearchable: true },
  { field: "sup_namasupplier", label: "Nama Supplier", isSearchable: true },
  { field: "lks_maxdisplay", label: "Max Display", isNumeric: true },
  { field: "lks_maxplano", label: "Max Plano", isNumeric: true },
  { field: "lks_minpct", label: "Min PCT", isNumeric: true },
  { field: "lks_expdate", label: "Exp Date", render: (v) => FormatTanggalISO(v as string | Date) },
  { field: "maxpalet", label: "Max Palet", isNumeric: true },
];
