// src/components/navbar/menus/inventory-menu.ts

import type { NavbarMenuItem } from "../types";

export const INVENTORY_MENU = [
  {
    title: "Monitoring PO & Stock Produk",
    href: "/inventory/monitoring-po-stock-produk",
    description:
      "Halaman untuk mengecek status PO dan stock produk, termasuk status PO, status PB, dan status stock.",
  },
  {
    title: "Produk Baru",
    href: "/inventory/produk-baru",
    description:
      "Halaman untuk mengecek produk baru berdasarkan tanggal masuknya produk.",
  },
  {
    title: "LPP Saat ini",
    href: "/inventory/lpp-saat-ini",
    description:
      "Halaman untuk mengecek LPP saat ini, status, tag, disc1, disc2 DLL.",
  },
  {
    title: "Master Lokasi",
    href: "/inventory/master-lokasi",
    description: "Halaman untuk mengecek Master Lokasi DLL.",
  },
] satisfies readonly NavbarMenuItem[];
