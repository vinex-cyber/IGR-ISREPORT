// configs/input/daftar-produkConfig.ts
import { ColumnConfig } from "@/types/report";

/**
 * =========================================
 * 🔥 REPORT CONFIG: DAFTARPRODUK
 * =========================================
 *
 * 📌 Cara pakai:
 * - Tambah field → edit di DaftarProdukRows
 * - Atur tampilan tabel → edit di daftarProdukColumns
 *
 * 📌 Fitur otomatis:
 * - Header grouping berdasarkan `group`
 * - Warna header dari `groupColor`
 * - Search dari `isSearchable`
 * - Format angka + total dari `isNumeric`
 *
 * -----------------------------------------
 * 📦 ColumnConfig:
 * -----------------------------------------
 * field        → key data (WAJIB sesuai type)
 * label        → nama kolom di UI
 * isNumeric    → auto format number + total
 * isSearchable → ikut search filter
 * group        → grouping header
 * groupColor   → warna header group (Tailwind)
 *
 * -----------------------------------------
 * 📌 Contoh:
 * -----------------------------------------
 * {
 *   field: "nama",
 *   label: "Nama",
 *   isSearchable: true,
 *   group: "Info",
 *   groupColor: "bg-blue-400"
 * }
 */

export type DaftarProdukRows = {
    // 🔥 isi field di sini
    prd_prdcd: string;
    prd_deskripsipanjang: string;
    satuan: string;
    harga: number;
    st_saldoakhir: number;
};

export const daftarProdukColumns: ColumnConfig<DaftarProdukRows>[] = [
    {
        field: "prd_prdcd",
        label: "PLU"
    },
    {
        field: "prd_deskripsipanjang",
        label: "Deskripsi"
    },
    {
        field: "satuan",
        label: "Satuan",
    },
    {
        field: "st_saldoakhir",
        label: "LPP",
        isNumeric: true
    },
    {
        field: "harga",
        label: "Harga",
        isNumeric: true
    },
];
