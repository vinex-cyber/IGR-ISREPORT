"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    // <header className="fixed top-0 left-0 w-full z-50 bg-blue-500 text-white px-4 py-2 flex items-center justify-between shadow">
    <header className="fixed top-4 left-1/2 z-50 w-[95%] max-w-6xl -translate-x-1/2 rounded-2xl border border-white/20 bg-blue-500/90 px-4 py-2 text-white shadow-lg backdrop-blur-md dark:bg-slate-900/90 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image
          src="/images/logo.png"
          alt="Logo Indogrosir"
          width={120}
          height={60}
          priority
        />
      </div>

      {/* Navigation Menu */}
      <NavigationMenu viewport={false} className="flex-1">
        <NavigationMenuList className="gap-6">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/" className="text-sm font-medium hover:underline">
                Dashboard
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {/* Store */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 dark:hover:bg-white/20 dark:text-white">
              Store
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-white text-black p-4 rounded shadow">
              <ul className="grid gap-2 w-[200px]">
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/evaluasi-sales"
                      className="text-sm hover:underline">
                      Evaluasi Sales
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/informasi-promosi"
                      className="text-sm hover:underline">
                      Informasi Promosi
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/form-so-harian"
                      className="text-sm hover:underline">
                      Form SO Harian
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {/* Logistik */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 dark:hover:bg-white/20 dark:text-white">
              Logistik
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-white text-black p-4 rounded shadow">
              <ul className="grid gap-2 w-[200px]">
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/lpp-produk"
                      className="text-sm hover:underline">
                      LPP PRODUK
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link href="/" className="text-sm hover:underline">
                      Cabang 2
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {/* Web HO */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-white hover:bg-white/10 dark:hover:bg-white/20 dark:text-white">
              Web HO
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-4">
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      href="http://192.168.226.190:81/login"
                      target="_blank"
                      rel="noopener noreferrer">
                      <div className="font-medium">IAS PHP</div>
                      <div className="text-muted-foreground">
                        Program IAS dari IT HO.
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="http://172.20.30.3/tsm/"
                      target="_blank"
                      rel="noopener noreferrer">
                      <div className="font-medium">TSM 1</div>
                      <div className="text-muted-foreground">
                        Program TSM 1 untuk input/merubah/edit Jadwal.
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="http://172.20.30.4/tsm/"
                      target="_blank"
                      rel="noopener noreferrer">
                      <div className="font-medium">TSM 2</div>
                      <div className="text-muted-foreground">
                        Program TSM 2 untuk input/merubah/edit Jadwal.
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="http://172.20.30.5/tsm/"
                      target="_blank"
                      rel="noopener noreferrer">
                      <div className="font-medium">TSM 3</div>
                      <div className="text-muted-foreground">
                        Program TSM 3 untuk input/merubah/edit Jadwal.
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="http://172.20.30.6/tsm/"
                      target="_blank"
                      rel="noopener noreferrer">
                      <div className="font-medium">TSM 4</div>
                      <div className="text-muted-foreground">
                        Program TSM 4 untuk input/merubah/edit Jadwal.
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Right Side: Button + Theme Toggle */}
      <div className="flex items-center gap-3">
        <Button className="bg-white text-black font-semibold hover:bg-gray-200 cursor-pointer">
          Cek Sonas
        </Button>

        {mounted && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="bg-white text-black hover:bg-gray-200">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
