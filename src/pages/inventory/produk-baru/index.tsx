// src/pages/inventory/produk-baru/index.tsx

import type { InferGetServerSidePropsType } from "next";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Layout from "@/components/Layout";
import SettingsDatabase from "@/components/Settings/SettingsDatabase";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import {
  CardContent,
  CardFieldset,
  CardTitleLegend,
} from "@/components/ui/card";

import PeriodeRange from "@/components/form/shared/PeriodeRange";
import SelectDivisi from "@/components/form/shared/SelectDivisi";
import SelectDepartement from "@/components/form/shared/SelectDepartement";
import SelectKategori from "@/components/form/shared/Selectkategori";

import {
  FilterProdukBaruSchema,
  type FilterProdukBaruInput,
} from "@/schema/filterProdukBaru";

import { DATABASE_OPTIONS } from "@/configs/database-options";

import { getFilterProdukBaruDefaultValues } from "@/configs/produk-baru/filter-default-value";

import { getDefaultBranchServerSideProps } from "@/utils/server/getDefaultBranchServerSideProps";
import { useFormSubmit } from "@/hooks/useFormPage";
import { FormatTanggal } from "@/utils/formatTanggal";

/**
 * Dijalankan pada server setiap halaman dibuka.
 *
 * IP client dibaca dari:
 * - X-Real-IP
 * - X-Forwarded-For
 * - req.socket.remoteAddress
 */
export const getServerSideProps = getDefaultBranchServerSideProps;
type ProdukBaruPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

export default function ProdukBaruPage({ defaultBranch }: ProdukBaruPageProps) {
  const [branch, setBranch] = useState(defaultBranch);

  const methods = useForm<FilterProdukBaruInput>({
    resolver: zodResolver(FilterProdukBaruSchema),
    defaultValues: getFilterProdukBaruDefaultValues(),
  });

  const { control, reset, clearErrors, handleSubmit } = methods;

  const { onSubmit, handleReset } = useFormSubmit<FilterProdukBaruInput>({
    getDefaultValues: getFilterProdukBaruDefaultValues,
    redirectPath: "/inventory/produk-baru/table-produk-baru",
    defaultBranch,
    setBranch,
    reset,
    clearErrors,
    successMessage: "Laporan produk baru sedang diproses",
    successDescription: (data) =>
      `Periode: ${FormatTanggal(
        data.startDate ?? "",
      )} - ${FormatTanggal(data.endDate ?? "")}`,
  });

  return (
    <Layout title="Produk Baru" branch={branch}>
      <Form {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-blue-500">
              Produk Baru
              {branch ? ` - ${branch}` : ""}
            </h1>

            <SettingsDatabase
              value={branch}
              onChange={setBranch}
              options={DATABASE_OPTIONS}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <PeriodeRange<FilterProdukBaruInput>
                control={control}
                startDateName="startDate"
                endDateName="endDate"
              />
            </div>

            <CardFieldset className="relative rounded-lg border shadow">
              <CardTitleLegend className="mx-6 px-2 text-md font-semibold">
                Produk
              </CardTitleLegend>

              <CardContent className="space-y-2 text-xs">
                <SelectDivisi<FilterProdukBaruInput>
                  control={control}
                  name="div"
                />

                <SelectDepartement<FilterProdukBaruInput>
                  control={control}
                  name="dept"
                  parentName="div"
                  disableWhenParentEmpty={false}
                  valueMode="division-department"
                />

                <SelectKategori<FilterProdukBaruInput>
                  control={control}
                  name="katb"
                  parentName="dept"
                  parentValueMode="division-department"
                  valueMode="department-category"
                  disableWhenParentEmpty={false}
                />
              </CardContent>
            </CardFieldset>

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
                  Reset
                </Button>
              </CardContent>
            </CardFieldset>
          </div>
        </form>
      </Form>
    </Layout>
  );
}
