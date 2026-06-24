// src/components/navbar/index.tsx

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import NavDropdown from "@/components/navbar/NavDropdown";

import {
  INVENTORY_MENU,
  LOGISTIK_MENU,
  STORE_MENU,
  WEB_HO_MENU,
} from "@/components/navbar/menus";

import {
  getBranchLogo,
  getBranchNavbarBackground,
} from "@/utils/getBranchTheme";

interface NavbarProps {
  branch?: string;
  logoSrc?: string;
}

export default function Navbar({ branch, logoSrc }: NavbarProps) {
  const { resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const navbarBackground = getBranchNavbarBackground(branch);

  const resolvedLogoSrc = logoSrc ?? getBranchLogo(branch);

  const handleToggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <header
      className={`fixed left-1/2 top-4 z-50 flex min-h-20 w-[95%] max-w-6xl -translate-x-1/2 items-center justify-between rounded-2xl border border-white/20 px-4 py-2 text-white shadow-lg backdrop-blur-md transition-colors duration-300 dark:bg-slate-900/90 ${navbarBackground}`}>
      <Link href="/" aria-label="Kembali ke Dashboard" className="shrink-0">
        <Image
          src={resolvedLogoSrc}
          alt={`Logo ${branch ?? "Aplikasi"}`}
          width={120}
          height={60}
          priority
          className="h-auto max-h-[60px] w-auto object-contain"
        />
      </Link>

      <NavigationMenu viewport={false} className="mx-6 flex-1 justify-center">
        <NavigationMenuList className="gap-2">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="/"
                className="block rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none">
                Dashboard
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavDropdown label="Store" items={STORE_MENU} />

          <NavDropdown label="Inventory" items={INVENTORY_MENU} />

          <NavDropdown label="Logistik" items={LOGISTIK_MENU} />

          <NavDropdown
            label="Web HO"
            items={WEB_HO_MENU}
            contentClassName="w-[340px]"
          />
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex shrink-0 items-center gap-3">
        <Button
          type="button"
          className="cursor-pointer bg-white font-semibold text-black hover:bg-gray-200">
          Cek Sonas
        </Button>

        {mounted ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleToggleTheme}
            className="bg-white text-black hover:bg-gray-200 hover:text-black"
            aria-label={isDark ? "Gunakan tema terang" : "Gunakan tema gelap"}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        ) : (
          <div className="h-9 w-9" />
        )}
      </div>
    </header>
  );
}
