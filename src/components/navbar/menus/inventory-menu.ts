// src/components/navbar/menus/inventory-menu.ts

import type { NavbarMenuItem } from "../types";

export const INVENTORY_MENU = [
  {
    title: "Produk Baru",
    href: "/inventory/produk-baru",
    description:
      "Halaman untuk mengecek produk baru berdasarkan tanggal masuknya produk.",
  },
] satisfies readonly NavbarMenuItem[];
