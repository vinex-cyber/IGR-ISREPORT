// src/components/navbar/NavDropdown.tsx

import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import NavItemLink from "@/components/navbar/NavItemLink";

import type { NavbarDropdownProps } from "@/components/navbar/types";

const triggerClassName =
  "bg-transparent text-white " +
  "hover:bg-white/10 hover:text-white " +
  "focus:bg-white/10 focus:text-white " +
  "data-[state=open]:bg-white/10 " +
  "dark:bg-transparent dark:text-white " +
  "dark:hover:bg-white/20";

export default function NavDropdown({
  label,
  items,
  contentClassName = "w-[220px]",
}: NavbarDropdownProps) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className={triggerClassName}>
        {label}
      </NavigationMenuTrigger>

      <NavigationMenuContent className="rounded-md border bg-popover p-2 text-popover-foreground shadow-md">
        <ul className={`grid gap-1 ${contentClassName}`}>
          {items.map((item) => (
            <NavItemLink key={`${item.title}-${item.href}`} item={item} />
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
