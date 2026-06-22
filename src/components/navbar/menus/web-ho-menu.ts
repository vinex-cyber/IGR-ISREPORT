// src/components/navbar/menus/web-ho-menu.ts

import type { NavbarMenuItem } from "../types";

export const WEB_HO_MENU = [
  {
    title: "IAS PHP",
    href: "http://192.168.226.190:81/login",
    description: "Program IAS dari IT HO.",
    external: true,
  },
  {
    title: "TSM 1",
    href: "http://172.20.30.3/tsm/",
    description: "Program TSM 1 untuk input atau mengubah jadwal.",
    external: true,
  },
  {
    title: "TSM 2",
    href: "http://172.20.30.4/tsm/",
    description: "Program TSM 2 untuk input atau mengubah jadwal.",
    external: true,
  },
  {
    title: "TSM 3",
    href: "http://172.20.30.5/tsm/",
    description: "Program TSM 3 untuk input atau mengubah jadwal.",
    external: true,
  },
  {
    title: "TSM 4",
    href: "http://172.20.30.6/tsm/",
    description: "Program TSM 4 untuk input atau mengubah jadwal.",
    external: true,
  },
] satisfies readonly NavbarMenuItem[];
