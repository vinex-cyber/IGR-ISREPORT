// configs/input/daftar-kodekasirConfig.ts
import { ColumnConfig } from "@/types/report";

/**
 * =========================================
 * 🔥 REPORT CONFIG: DAFTARKODEKASIR
 * =========================================
 *
 * 📌 Cara pakai:
 * - Tambah field → edit di DaftarKodeKasirRows
 * - Atur tampilan tabel → edit di daftarKodeKasirColumns
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

export type DaftarKodeKasirRows = {
  // 🔥 isi field di sini
  userid: string;
  username: string;
};

export const daftarKodeKasirColumns: ColumnConfig<DaftarKodeKasirRows>[] = [
  { field: "userid", label: "User ID", isSearchable: true },
  { field: "username", label: "User Name", isSearchable: true },
];
