// src/components/navbar/types.ts

export interface NavbarMenuItem {
  title: string;
  href: string;
  description?: string;
  external?: boolean;
}

export interface NavbarDropdownProps {
  label: string;
  items: readonly NavbarMenuItem[];
  contentClassName?: string;
}
