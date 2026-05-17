// configs/input/daftar-cashbackConfig.ts
import { ColumnConfig } from "@/types/report";

/**
 * =========================================
 * 🔥 REPORT CONFIG: DAFTARCASHBACK
 * =========================================
 *
 * 📌 Cara pakai:
 * - Tambah field → edit di DaftarCashbackRows
 * - Atur tampilan tabel → edit di daftarCashbackColumns
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

export type DaftarCashbackRows = {
    // 🔥 isi field di sini
    cbh_kodepromosi: string;
    cbh_namapromosi: string;
    cbh_tglawal: string;
    cbh_tglakhir: string;
    cbh_status: string;
};

export const daftarCashbackColumns: ColumnConfig<DaftarCashbackRows>[] = [
    { field: "cbh_kodepromosi", label: "Kode Promosi" },
    { field: "cbh_namapromosi", label: "Nama Promosi" },
    { field: "cbh_tglawal", label: "Tanggal Awal" },
    { field: "cbh_tglakhir", label: "Tanggal Akhir" },
    { field: "cbh_status", label: "Status" },
];
