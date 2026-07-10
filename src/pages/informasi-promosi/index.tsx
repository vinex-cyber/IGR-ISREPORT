// src/pages/informasi-promosi/index.tsx
import { useState, useRef, useEffect } from "react";
import type { InferGetServerSidePropsType } from "next";
import { animate } from "animejs";

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

function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(function revealOnScroll() {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          animate(el, {
            opacity: [0, 1],
            translateY: [40, 0],
            duration: 500,
            ease: "outQuad",
          });
          observer.unobserve(el);
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return function disconnectReveal() {
      observer.disconnect();
    };
  }, []);

  return ref;
}

export default function InformasiPromosi({ defaultBranch }: Props) {
  const [branch, setBranch] = useState(defaultBranch);

  const promosiRef = useScrollReveal<HTMLElement>();

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
            <FormInformasiPromosi
              branch={branch}
              onBranchChange={setBranch}
            />
            <TabelSettingHarga />
            <TabelMemberPricing />
          </div>

          <div className="flex w-2/5 flex-col gap-5">
            <KartuProduk />
            <TabelTrendSales />
          </div>
        </section>

        <section
          ref={promosiRef}
          className="mt-5 space-y-5 opacity-0">
          <TabelPromoCashback />
          <TabelPromoGift />
          <TabelPromoInstore />
          <TabelPromoHJK />
        </section>
      </div>
    </Layout>
  );
}
