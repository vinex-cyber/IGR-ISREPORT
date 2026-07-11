// src/pages/informasi-promosi/index.tsx
import { useState } from "react";
import type { InferGetServerSidePropsType } from "next";

import Layout from "@/components/Layout";
import Reveal from "@/components/animation/Reveal";
import FormInformasiPromosi from "@/components/form/informasi-promosi/FormInformasiPromosi";
import { getDefaultBranchServerSideProps } from "@/utils/server/getDefaultBranchServerSideProps";

export const getServerSideProps = getDefaultBranchServerSideProps;
type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function InformasiPromosi({ defaultBranch }: Props) {
  const [branch, setBranch] = useState(defaultBranch);

  return (
    <Layout title="Informasi Promosi" branch={branch}>
      <div className="px-4">
        <section className="flex w-full gap-5 items-stretch">
          <div className="flex w-3/5 flex-col gap-5">
            <Reveal>
              <div>
                <h1 className="font-mono text-xl font-bold text-blue-500 dark:text-blue-400">
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
          </div>
        </section>
      </div>
    </Layout>
  );
}
