// components/Layout.tsx
import Head from "next/head";
import Navbar from "@/components/navbar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string; // Tambahkan props description
}

const appName = process.env.NEXT_PUBLIC_APP_NAME || "App Default";

export default function Layout({
  children,
  title = "Dashboard",
  description = "Selamat datang di aplikasi kami.", // default desc
}: LayoutProps) {
  const fullTitle = `${appName} | ${title}`;

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/logo.png" />
      </Head>
      <Navbar />
      <main className="min-h-screen bg-blue-100 px-4 pt-28 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </>
  );
}
