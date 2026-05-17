// configs/input/daftar-giftConfig.ts
import { ColumnConfig } from "@/types/report";

/**
 * =========================================
 * 🔥 REPORT CONFIG: DAFTARGIFT
 * =========================================
 *
 * 📌 Cara pakai:
 * - Tambah field → edit di DaftarGiftRows
 * - Atur tampilan tabel → edit di daftarGiftColumns
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

export type DaftarGiftRows = {
    // 🔥 isi field di sini
    gfh_kodepromosi: string;
    gfh_namapromosi: string;
    gfh_tglawal: string;
    gfh_tglakhir: string;
    gfh_status: string;
};

export const daftarGiftColumns: ColumnConfig<DaftarGiftRows>[] = [
    { field: "gfh_kodepromosi", label: "Kode Promosi", isSearchable: true },
    { field: "gfh_namapromosi", label: "Nama Promosi", isSearchable: true },
    { field: "gfh_tglawal", label: "Tgl Awal", isSearchable: true },
    { field: "gfh_tglakhir", label: "Tgl Akhir", isSearchable: true },
    { field: "gfh_status", label: "Status", isSearchable: true },
];
