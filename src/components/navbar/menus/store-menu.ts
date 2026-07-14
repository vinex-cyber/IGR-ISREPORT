// src/components/navbar/menus/store-menu.ts

import type { NavbarMenuItem } from "../types";

export const STORE_MENU = [
  {
    title: "Evaluasi Sales",
    href: "/evaluasi-sales",
    description:
      "Halaman untuk mengevaluasi performa sales berdasarkan data penjualan dan target yang telah ditetapkan.",
  },
  {
    title: "Informasi Promosi",
    href: "/informasi-promosi",
    description:
      "Halaman untuk melihat informasi promosi yang sedang berlangsung.",
  },
  {
    title: "Form SO Harian",
    href: "/form-so-harian",
    description: "Halaman untuk Cek Data SO harian.",
  },
  {
    title: "Editor Surat",
    href: "/editor-surat",
    description: "Halaman editor surat penawaran (Tiptap) dengan preview PDF.",
  },
] satisfies readonly NavbarMenuItem[];
