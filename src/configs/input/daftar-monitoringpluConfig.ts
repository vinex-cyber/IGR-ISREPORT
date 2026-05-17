// configs/input/daftar-monitoringpluConfig.ts
import { ColumnConfig } from "@/types/report";

/**
 * =========================================
 * 🔥 REPORT CONFIG: DAFTARMONITORINGPLU
 * =========================================
 *
 * 📌 Cara pakai:
 * - Tambah field → edit di DaftarMonitoringpluRows
 * - Atur tampilan tabel → edit di daftarMonitoringpluColumns
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

export type DaftarMonitoringpluRows = {
    // 🔥 isi field di sini
    kodemonitoring: string;
    namamonitoring: string;
    ttl_plu: number;
};

export const daftarMonitoringpluColumns: ColumnConfig<DaftarMonitoringpluRows>[] = [
    {
        field: "kodemonitoring",
        label: "Kode Monitoring",
        isSearchable: true,
    },
    {
        field: "namamonitoring",
        label: "Nama Monitoring",
        isSearchable: true,
    },
    {
        field: "ttl_plu",
        label: "Ttl Produk",
        isNumeric: true,
    },
];
