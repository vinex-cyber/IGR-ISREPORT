// src/components/Layout.tsx

import Head from "next/head";
import type { ReactNode } from "react";

import Navbar from "@/components/navbar";

import { getBranchLogo, getBranchPageBackground } from "@/utils/getBranchTheme";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;

  /**
   * Branch aktif dari watch("branch").
   */
  branch?: string;
}

const defaultAppName = process.env.NEXT_PUBLIC_APP_NAME ?? "App Default";

export default function Layout({
  children,
  title = "Dashboard",
  description = "Selamat datang di aplikasi kami.",
  branch,
}: LayoutProps) {
  const activeBranch = branch?.trim() || defaultAppName;

  const fullTitle = `${activeBranch} | ${title}`;

  const pageBackground = getBranchPageBackground(activeBranch);

  const logoSrc = getBranchLogo(activeBranch);

  return (
    <>
      <Head>
        <title>{fullTitle}</title>

        <meta name="description" content={description} />

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link
          rel="icon"
          type="image/png"
          href={logoSrc}
          key={logoSrc}
          className="max-h-[60px]"
        />
      </Head>

      <Navbar branch={activeBranch} logoSrc={logoSrc} />

      <main
        className={`min-h-screen px-4 pb-8 pt-24 transition-colors duration-300 dark:bg-slate-900 ${pageBackground}`}>
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
    </>
  );
}
