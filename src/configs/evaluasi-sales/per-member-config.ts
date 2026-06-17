// configs/perMemberConfig.ts
import { ColumnConfig } from "@/types/report";

/**
 * 🔥 CONFIGURATION REPORT PER MEMBER
 * - Cukup edit di sini untuk ubah seluruh report per member
 * - Tambah field baru, cukup tambahkan di MemberRows dan perMemberColumns
 * - Otomatis header, grouping, dan fitur lainnya akan menyesuaikan dari sini
 * @param MemberRows tipe data untuk setiap baris (harus sesuai dengan field di database)
 * @param perMemberColumns konfigurasi kolom untuk report per member
 * - field: nama field di data (harus sesuai dengan MemberRows)
 * - label: nama kolom yang tampil di tabel
 * - isNumeric: apakah field ini angka (akan diratakan kanan dan bisa dijumlahkan di total)
 * - isSearchable: apakah field ini bisa dicari dengan search box
 * - group: nama grup untuk header grouping (kolom dengan group yang sama akan digabung di header)
 * Contoh:
 * { field: "kd_member", label: "Kode Member", isSearchable: true, group: "Info Member" }
 * - group: "Info Member" akan membuat kolom "Kode Member" dan "Nama Member" menjadi satu header
 */

export type MemberRows = {
  outlet: string;
  suboutlet: string;
  kd_member: string;
  nama_member: string;
  jumlah_struk: number;
  jumlah_produk: number;
  total_qty: number;
  total_gross: number;
  total_netto: number;
  total_margin: number;
  tgl_mulai: string;
  tgl_akhir: string;
  jenis_member: string;
};

export const perMemberColumns: ColumnConfig<MemberRows>[] = [
  {
    field: "outlet",
    label: "Outlet",
    isSearchable: true,
    group: "Info Member",
    groupColor: "bg-green-400",
  },
  {
    field: "suboutlet",
    label: "Sub Outlet",
    isSearchable: true,
    group: "Info Member",
    groupColor: "bg-green-400",
  },
  {
    field: "kd_member",
    label: "Kode",
    isSearchable: true,
    group: "Info Member",
    groupColor: "bg-green-400",
  },
  {
    field: "nama_member",
    label: "Nama",
    isSearchable: true,
    group: "Info Member",
    groupColor: "bg-green-400",
  },

  {
    field: "jumlah_struk",
    label: "Jumlah Struk",
    isNumeric: true,
    group: "Sales",
    groupColor: "bg-red-400",
  },
  {
    field: "jumlah_produk",
    label: "Jumlah Produk",
    isNumeric: true,
    group: "Sales",
    groupColor: "bg-red-400",
  },
  {
    field: "total_qty",
    label: "Qty",
    isNumeric: true,
    group: "Sales",
    groupColor: "bg-red-400",
  },
  {
    field: "total_gross",
    label: "Gross",
    isNumeric: true,
    group: "Sales",
    groupColor: "bg-red-400",
  },
  {
    field: "total_netto",
    label: "Netto",
    isNumeric: true,
    group: "Sales",
    groupColor: "bg-red-400",
  },
  {
    field: "total_margin",
    label: "Margin",
    isNumeric: true,
    group: "Sales",
    groupColor: "bg-red-400",
  },

  {
    field: "tgl_mulai",
    label: "Tgl Mulai",
    group: "Sales",
    groupColor: "bg-red-400",
  },
  {
    field: "tgl_akhir",
    label: "Tgl Akhir",
    group: "Sales",
    groupColor: "bg-red-400",
  },
  {
    field: "jenis_member",
    label: "Jenis Member",
    group: "Sales",
    groupColor: "bg-red-400",
  },
];
