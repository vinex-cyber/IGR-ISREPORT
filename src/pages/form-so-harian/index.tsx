// src/pages/form-so-harian/index.tsx
import type { InferGetServerSidePropsType } from "next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import {
  FilterFormSoHarianInput,
  FilterFormSoHarianSchema,
} from "@/schema/filterFormSoHarian";

import InputProdukPlu from "@/components/input/InputProdukPlu";
import SettingsDatabase from "@/components/Settings/SettingsDatabase";
import { DATABASE_OPTIONS } from "@/configs/database-options";

import { getDefaultBranchServerSideProps } from "@/utils/server/getDefaultBranchServerSideProps";
import { formatPlu } from "@/utils/formatPlu";
import {
  CardContent,
  CardFieldset,
  CardTitleLegend,
} from "@/components/ui/card";
import { useState } from "react";

export const getServerSideProps = getDefaultBranchServerSideProps;

type FormSoHarianPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

export default function FormSoHarian({ defaultBranch }: FormSoHarianPageProps) {
  const router = useRouter();
  const [branch, setBranch] = useState(defaultBranch);

  const methods = useForm<FilterFormSoHarianInput>({
    resolver: zodResolver(FilterFormSoHarianSchema),
    defaultValues: { prdcd: "" },
  });

  const onSubmit = (formData: FilterFormSoHarianInput) => {
    try {
      const formattedPlu = formatPlu(formData.prdcd || "", { validate: true });
      router.push(`/form-so-harian/${formattedPlu}`);
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  return (
    <Layout title="Form SO Harian" branch={branch}>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Form SO Harian - {branch}</h1>

        <SettingsDatabase
          value={branch}
          onChange={setBranch}
          options={DATABASE_OPTIONS}
        />
      </div>

      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex items-center gap-4">
          <CardFieldset className="relative rounded-lg border shadow">
            <CardTitleLegend className="mx-6 px-2 text-md font-semibold">
              Input PLU
            </CardTitleLegend>
            <CardContent>
              <InputProdukPlu name="prdcd" />
            </CardContent>
          </CardFieldset>

          <CardFieldset className="relative rounded-lg border shadow">
            <CardTitleLegend className="mx-6 px-2 text-md font-semibold">
              Process
            </CardTitleLegend>
            <CardContent>
              <Button
                type="submit"
                variant="outline"
                className="bg-blue-500 border-none text-white hover:bg-green-500 hover:cursor-pointer">
                Cari
              </Button>
            </CardContent>
          </CardFieldset>
        </form>
      </Form>
    </Layout>
  );
}
