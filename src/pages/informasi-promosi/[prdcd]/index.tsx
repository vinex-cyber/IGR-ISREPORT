// pages/informasi-promosi/[prdcd]/index.tsx
import { useState } from "react";
import type { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

import Layout from "@/components/Layout";
import FormInformasiPromosi from "@/components/form/informasi-promosi/FormInformasiPromosi";
import KartuProduk from "@/pages/informasi-promosi/KartuProduk";
import { getDefaultBranchServerSideProps } from "@/utils/server/getDefaultBranchServerSideProps";
import TabelSettingHarga from "../TabelSettingHarga";
import TabelMemberPricing from "../TabelMemberPricing";
import TabelTrendSales from "../TabelTrendSales";

export const getServerSideProps = getDefaultBranchServerSideProps;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function InformasiPromosiPrdcd({ defaultBranch }: Props) {
  const router = useRouter();
  const [branch, setBranch] = useState(defaultBranch);

  const prdcd =
    typeof router.query.prdcd === "string" ? router.query.prdcd : "";

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
            <KartuProduk plu={prdcd} />
            <TabelTrendSales />
          </div>
        </section>
      </div>
    </Layout>
  );
}
