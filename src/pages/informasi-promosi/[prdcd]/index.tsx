// pages/informasi-promosi/[prdcd]/index.tsx
import { useState } from "react";
import type { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

import Layout from "@/components/Layout";
import FormInformasiPromosi from "@/components/form/informasi-promosi/FormInformasiPromosi";
import KartuProduk from "@/pages/informasi-promosi/KartuProduk";
import { getDefaultBranchServerSideProps } from "@/utils/server/getDefaultBranchServerSideProps";

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
        <h1 className="font-mono text-xl text-blue-500 font-bold">
          Informasi Promosi - {branch}
          {prdcd ? ` - PLU ${prdcd}` : ""}
        </h1>
        <FormInformasiPromosi branch={branch} onBranchChange={setBranch} />
        <KartuProduk plu={prdcd} />
      </div>
    </Layout>
  );
}
