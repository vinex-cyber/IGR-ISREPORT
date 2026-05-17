// configs/input/daftar-memberConfig.ts
import { ColumnConfig } from "@/types/report";

/**
 * =========================================
 * 🔥 REPORT CONFIG: DAFTARMEMBER
 * =========================================
 *
 * 📌 Cara pakai:
 * - Tambah field → edit di DaftarMemberRows
 * - Atur tampilan tabel → edit di daftarMemberColumns
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

export type DaftarMemberRows = {
    // 🔥 isi field di sini
    cus_kodeigr: string;
    cus_kodemember: string;
    cus_namamember: string;
    jenis_member: string;
};

export const daftarMemberColumns: ColumnConfig<DaftarMemberRows>[] = [
    {
        field: "cus_kodeigr",
        label: "Kode IGR",
    },
    {
        field: "cus_kodemember",
        label: "Kode Member",
    },
    {
        field: "cus_namamember",
        label: "Nama Member",
    },
    {
        field: "jenis_member",
        label: "Jenis Member",
    }
];
