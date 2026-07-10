// src/pages/informasi-promosi/index.tsx
import { useState } from "react";
import type { InferGetServerSidePropsType } from "next";

import Layout from "@/components/Layout";
import Reveal from "@/components/animation/Reveal";
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

  const durationAnimasi = 900;

  return (
    <Layout title="Informasi Promosi" branch={branch}>
      <div className="px-4">
        <section className="flex w-full gap-5 items-stretch">
          <div className="flex w-3/5 flex-col gap-5">
            <Reveal>
              <div>
                <h1 className="font-mono text-xl text-blue-500 font-bold">
                  Informasi Promosi - {branch}
                </h1>
              </div>
            </Reveal>
            <Reveal>
              <FormInformasiPromosi
                branch={branch}
                onBranchChange={setBranch}
              />
            </Reveal>
            <Reveal>
              <TabelSettingHarga />
            </Reveal>
            <Reveal>
              <TabelMemberPricing />
            </Reveal>
          </div>

          <div className="flex w-2/5 flex-col gap-5">
            <Reveal>
              <KartuProduk />
            </Reveal>
            <Reveal>
              <TabelTrendSales />
            </Reveal>
          </div>
        </section>

        <section className="mt-5 space-y-5">
          <Reveal direction="left" duration={durationAnimasi} ease="outCubic">
            <TabelPromoCashback />
          </Reveal>
          <Reveal direction="right" duration={durationAnimasi} ease="outCubic">
            <TabelPromoGift />
          </Reveal>
          <Reveal direction="left" duration={durationAnimasi} ease="outCubic">
            <TabelPromoInstore />
          </Reveal>
          <Reveal direction="right" duration={durationAnimasi} ease="outCubic">
            <TabelPromoHJK />
          </Reveal>
        </section>
      </div>
    </Layout>
  );
}
