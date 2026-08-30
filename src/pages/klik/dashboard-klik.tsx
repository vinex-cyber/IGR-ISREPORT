// src/pages/klik/dashboard-klik.tsx

import { useState } from "react";

import Layout from "@/components/Layout";
import { DATABASE_OPTIONS } from "@/configs/database-options";
import type { DefaultBranchPageProps } from "@/utils/server/getDefaultBranchServerSideProps";
import { getDefaultBranchServerSideProps } from "@/utils/server/getDefaultBranchServerSideProps";
import { KlikHero } from "./components/KlikHero";
import { ProdukTerlaris } from "./components/ProdukTerlaris";

export const getServerSideProps = getDefaultBranchServerSideProps;

export default function DashboardKlik({
  defaultBranch,
}: DefaultBranchPageProps) {
  const [branch, setBranch] = useState(defaultBranch);

  return (
    <Layout title="Dashboard Klik" branch={branch}>
      <div className="space-y-6">
        <KlikHero
          branch={branch}
          onBranchChange={setBranch}
          options={DATABASE_OPTIONS}
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ProdukTerlaris branch={branch} />
        </div>
      </div>
    </Layout>
  );
}
