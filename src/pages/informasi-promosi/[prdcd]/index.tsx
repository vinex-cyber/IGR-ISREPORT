// pages/informasi-promosi/[prdcd]/index.tsx
import { useState } from "react";
import type { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

import Layout from "@/components/Layout";
import Reveal from "@/components/animation/Reveal";
import FormInformasiPromosi from "@/components/form/informasi-promosi/FormInformasiPromosi";
import KartuProduk from "@/pages/informasi-promosi/KartuProduk";
import TabelTrendSales from "@/pages/informasi-promosi/table/TabelTrendSales";
import { getDefaultBranchServerSideProps } from "@/utils/server/getDefaultBranchServerSideProps";
import TabelSettingHarga from "../table/TabelSettingHarga";
import TabelMemberPricing from "../table/TabelMemberPricing";
import TabelPromoCashback from "../table/TabelPromoCashback";
import TabelPromoGift from "../table/TabelPromoGift";
import TabelPromoInstore from "../table/TabelPromoInstore";
import TabelPromoHJK from "../table/TabelPromoHJK";

export const getServerSideProps = getDefaultBranchServerSideProps;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function InformasiPromosiPrdcd({ defaultBranch }: Props) {
  const router = useRouter();
  const [branch, setBranch] = useState(defaultBranch);

  const prdcd =
    typeof router.query.prdcd === "string" ? router.query.prdcd : "";

  const durationAnimasi = 2000;

  return (
    <Layout title="Informasi Promosi" branch={branch}>
      <div className="px-4">
        <section className="flex w-full gap-5 items-stretch">
          <div className="flex w-3/5 flex-col gap-5">
            <Reveal>
              <div>
                <h1 className="font-mono text-xl font-bold text-blue-500 dark:text-blue-400">
                  Informasi Promosi - {branch}
                  {prdcd ? ` - PLU ${prdcd}` : ""}
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
              <TabelSettingHarga plu={prdcd} branch={branch} />
            </Reveal>
            <Reveal>
              <TabelMemberPricing plu={prdcd} />
            </Reveal>
          </div>

          <div className="flex w-2/5 flex-col gap-5">
            <Reveal>
              <KartuProduk plu={prdcd} branch={branch} />
            </Reveal>
            <Reveal>
              <TabelTrendSales plu={prdcd} />
            </Reveal>
          </div>
        </section>

        <section className="mt-5 space-y-5">
          <Reveal direction="left" duration={durationAnimasi} ease="outCubic">
            <TabelPromoCashback plu={prdcd} />
          </Reveal>
          <Reveal direction="right" duration={durationAnimasi} ease="outCubic">
            <TabelPromoGift plu={prdcd} />
          </Reveal>
          <Reveal direction="left" duration={durationAnimasi} ease="outCubic">
            <TabelPromoInstore plu={prdcd} />
          </Reveal>
          <Reveal direction="right" duration={durationAnimasi} ease="outCubic">
            <TabelPromoHJK plu={prdcd} />
          </Reveal>
        </section>
      </div>
    </Layout>
  );
}
