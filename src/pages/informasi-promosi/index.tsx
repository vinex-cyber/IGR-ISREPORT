// src/pages/informasi-promosi/index.tsx
import { useState } from "react";
import type { InferGetServerSidePropsType } from "next";

import Layout from "@/components/Layout";
import FormInformasiPromosi from "@/components/form/informasi-promosi/FormInformasiPromosi";
import { getDefaultBranchServerSideProps } from "@/utils/server/getDefaultBranchServerSideProps";

import TabelSettingHarga from "./TabelSettingHarga";
import TabelMemberPricing from "./TabelMemberPricing";
import KartuProduk from "./KartuProduk";
import TabelPromoCashback from "./TabelPromoCashback";
import TabelPromoGift from "./TabelPromoGift";
import TabelPromoInstore from "./TabelPromoInstore";
import TabelPromoHJK from "./TabelPromoHJK";
import TabelTrendSales from "./TabelTrendSales";

export const getServerSideProps = getDefaultBranchServerSideProps;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function InformasiPromosi({ defaultBranch }: Props) {
  const [branch, setBranch] = useState(defaultBranch);

  return (
    <Layout title="Informasi Promosi" branch={branch}>
      <div className="px-4">
        <section className="flex w-full gap-5 items-stretch">
          <div className="flex w-3/5 flex-col gap-5">
            <div>
              <h1 className="font-mono text-xl text-blue-500 font-bold">
                Informasi Promosi - {branch}
              </h1>
            </div>
            <FormInformasiPromosi branch={branch} onBranchChange={setBranch} />
            <TabelSettingHarga />
            <TabelMemberPricing />
          </div>

          <div className="flex w-2/5 flex-col gap-5">
            <KartuProduk />
            <TabelTrendSales />
          </div>
        </section>

        <section className="mt-5 space-y-5">
          <TabelPromoCashback />
          <TabelPromoGift />
          <TabelPromoInstore />
          <TabelPromoHJK />
        </section>
      </div>
    </Layout>
  );
}
