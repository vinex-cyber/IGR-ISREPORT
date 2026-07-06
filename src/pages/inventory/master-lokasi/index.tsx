// src/pages/inventory/master-lokasi/index.tsx
import CardProduk from "@/components/form/shared/CardProduk";
import CardSupplier from "@/components/form/shared/CardSupplier";
import Layout from "@/components/Layout";
import SettingsDatabase from "@/components/Settings/SettingsDatabase";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getFilterMasterLokasiDefaultValues } from "@/configs/inventory/master-lokasi/filter-default-value";
import { DATABASE_OPTIONS } from "@/configs/database-options";
import type { MasterLokasiFilters } from "@/schema/inventory/master-lokasi/masterLokasiSchema";
import { MasterLokasiSchema } from "@/schema/inventory/master-lokasi/masterLokasiSchema";
import { getDefaultBranchServerSideProps } from "@/utils/server/getDefaultBranchServerSideProps";
import { useFormSubmit } from "@/hooks/useFormPage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { InferGetServerSidePropsType } from "next";
import {
  CardContent,
  CardFieldset,
  CardTitleLegend,
} from "@/components/ui/card";

export const getServerSideProps = getDefaultBranchServerSideProps;
type MasterLokasiProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function MasterLokasiPage({ defaultBranch }: MasterLokasiProps) {
  const [branch, setBranch] = useState(defaultBranch);

  const methods = useForm<MasterLokasiFilters>({
    resolver: zodResolver(MasterLokasiSchema),
    defaultValues: getFilterMasterLokasiDefaultValues(),
  });

  const { control, reset, clearErrors, handleSubmit } = methods;

  const { onSubmit, handleReset } = useFormSubmit<MasterLokasiFilters>({
    getDefaultValues: getFilterMasterLokasiDefaultValues,
    redirectPath: "/inventory/master-lokasi/laporan",
    defaultBranch,
    setBranch,
    reset,
    clearErrors,
    successMessage: "Laporan master lokasi sedang diproses",
    successDescription: "Mohon tunggu sebentar...",
  });

  return (
    <Layout title="Master Lokasi" branch={branch}>
      <Form {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-blue-500">
              Master Lokasi
              {branch ? ` - ${branch}` : ""}
            </h1>

            <SettingsDatabase
              value={branch}
              onChange={setBranch}
              options={DATABASE_OPTIONS}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <CardProduk<MasterLokasiFilters>
                control={control}
                fields={{
                  plu: { name: "prdcd" },
                  namaProduk: { name: "namaBarang" },
                  monitoringPlu: { name: "kodeMonitoringPlu" },
                  divisi: { name: "div" },
                  departement: { name: "dept", parentName: "div" },
                  kategori: { name: "katb", parentName: "dept" },
                  tag: { name: "tag" },
                }}
              />
            </div>

            <div>
              <CardSupplier<MasterLokasiFilters>
                control={control}
                fields={{
                  kodeSupplier: {
                    name: "kodeSupplier",
                    multiple: true,
                    separator: ",",
                    allowManualInput: true,
                  },
                  namaSupplier: { name: "namaSupplier" },
                }}
              />
            </div>
            <div>
              <CardFieldset className="relative rounded-lg border shadow">
                <CardTitleLegend className="mx-6 px-2 text-md font-semibold">
                  Proses
                </CardTitleLegend>

                <CardContent className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    className="bg-blue-500 dark:bg-slate-600 hover:cursor-pointer dark:hover:bg-blue-400 dark:text-white">
                    Submit
                  </Button>

                  <Button type="button" variant="outline" onClick={handleReset}>
                    <RotateCcw size={16} /> Reset
                  </Button>
                </CardContent>
              </CardFieldset>
            </div>
          </div>

          {/* <div className="border-t border-black pt-4 dark:border-slate-800">
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="gap-2 border-red-500 text-red-500 hover:cursor-pointer hover:bg-red-500 hover:text-white">
                <RotateCcw size={16} />
                Reset
              </Button>

              <Button
                type="submit"
                variant="outline"
                className="border-blue-500 bg-blue-500 text-white hover:cursor-pointer hover:bg-green-500">
                Submit
              </Button>
            </div>
          </div> */}
        </form>
      </Form>
    </Layout>
  );
}
