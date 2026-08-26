// pages/index.tsx
import { useState } from "react";
import { BarChart3 } from "lucide-react";

import Layout from "@/components/Layout";
import { ChartTrendBulanan } from "@/components/charts/ChartTrendBulanan";
import { ChartTrendSalesDivisi } from "@/components/charts/ChartTrendSalesDivisi";
import { DashboardKpi } from "@/components/charts/DashboardKpi";
import { TodaySalesCard } from "@/components/charts/TodaySalesCard";
import { TodayDivisiCard } from "@/components/charts/TodayDivisiCard";
import SettingsDatabase from "@/components/Settings/SettingsDatabase";
import { DATABASE_OPTIONS } from "@/configs/database-options";
import { FormatTanggal } from "@/utils/formatTanggal";
import type { DefaultBranchPageProps } from "@/utils/server/getDefaultBranchServerSideProps";
import { getDefaultBranchServerSideProps } from "@/utils/server/getDefaultBranchServerSideProps";

export const getServerSideProps = getDefaultBranchServerSideProps;

export default function Home({ defaultBranch }: DefaultBranchPageProps) {
  const [branch, setBranch] = useState(defaultBranch);

  return (
    <Layout title="Dashboard" branch={branch}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-sm md:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-primary/10 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-20 -left-10 size-40 rounded-full bg-chart-1/10 blur-3xl" aria-hidden />
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border/60">
              <BarChart3 className="size-3.5 text-chart-1" aria-hidden />
              Ringkasan Performa
            </span>
            <span className="text-xs text-muted-foreground">
              {FormatTanggal(new Date())}
            </span>
            <div className="ml-auto">
              <SettingsDatabase
                value={branch}
                onChange={setBranch}
                options={DATABASE_OPTIONS}
              />
            </div>
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
            Dashboard {branch}
          </h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Pantau tren sales, margin, dan performa divisi dalam satu tampilan.
          </p>
          <div className="relative z-10 mt-5">
            <DashboardKpi branch={branch} />
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <TodaySalesCard branch={branch} />
          </div>
          <TodayDivisiCard branch={branch} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartTrendBulanan
            metric="sales"
            title="Tren Sales Bulanan"
            description="Total sales per bulan, dalam juta"
            branch={branch}
          />
          <ChartTrendBulanan
            metric="margin"
            title="Tren Margin Bulanan"
            description="Total margin per bulan, dalam juta"
            branch={branch}
          />
          <ChartTrendSalesDivisi
            metric="sales"
            title="Sales per Divisi"
            description="Stacked bar per bulan, dalam juta"
            branch={branch}
          />
          <ChartTrendSalesDivisi
            metric="margin"
            title="Margin per Divisi"
            description="Stacked bar per bulan, dalam juta"
            branch={branch}
          />
        </div>
      </div>
    </Layout>
  );
}
