// src/components/navbar/NavItemLink.tsx

import Link from "next/link";

import { NavigationMenuLink } from "@/components/ui/navigation-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { NavbarMenuItem } from "./types";

interface NavItemLinkProps {
  item: NavbarMenuItem;
}

const linkClassName =
  "block w-full rounded-md px-3 py-2 text-sm transition-colors " +
  "hover:bg-accent hover:text-accent-foreground " +
  "focus:bg-accent focus:text-accent-foreground focus:outline-none";

export default function NavItemLink({ item }: NavItemLinkProps) {
  const menuLink = item.external ? (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClassName}>
      {item.title}
    </a>
  ) : (
    <Link href={item.href} className={linkClassName}>
      {item.title}
    </Link>
  );

  return (
    <li>
      {item.description ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <NavigationMenuLink asChild>{menuLink}</NavigationMenuLink>
          </TooltipTrigger>

          <TooltipContent
            side="right"
            align="start"
            sideOffset={10}
            className="max-w-[280px] text-sm leading-relaxed">
            {item.description}
          </TooltipContent>
        </Tooltip>
      ) : (
        <NavigationMenuLink asChild>{menuLink}</NavigationMenuLink>
      )}
    </li>
  );
}
