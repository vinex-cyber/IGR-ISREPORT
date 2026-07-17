// pages/index.tsx
import { useEffect, useState } from "react";

import Layout from "@/components/Layout";
import { ChartTrendBulanan } from "@/components/charts/ChartTrendBulanan";
import { ChartTrendSalesDivisi } from "@/components/charts/ChartTrendSalesDivisi";
import { getBranchCookie } from "@/utils/branchCookie";

const charts = [
  { id: "trend-sales", node: <ChartTrendBulanan metric="sales" /> },
  { id: "trend-margin", node: <ChartTrendBulanan metric="margin" /> },
  { id: "trend-divisi-sales", node: <ChartTrendSalesDivisi metric="sales" /> },
  { id: "trend-divisi-margin", node: <ChartTrendSalesDivisi metric="margin" /> },
];

export default function Home() {
  const [branch, setBranch] = useState("");

  useEffect(function syncBranchFromCookie() {
    setBranch(getBranchCookie());
  }, []);

  return (
    <Layout title="Dashboard" branch={branch}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {charts.map((chart) => (
          <div key={chart.id}>{chart.node}</div>
        ))}
      </div>
    </Layout>
  );
}
