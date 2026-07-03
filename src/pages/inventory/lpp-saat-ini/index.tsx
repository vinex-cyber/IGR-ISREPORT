// src/pages/inventory/lpp-saat-ini/index.tsx

import type { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

import Layout from "@/components/Layout";
import SettingsDatabase from "@/components/Settings/SettingsDatabase";

import CardProduk from "@/components/form/shared/CardProduk";
import SelectLokasi from "@/components/form/shared/SelectLokasi";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import {
  FilterLppSaatIniSchema,
  type FilterLppSaatIniInput,
} from "@/schema/filterLppSaatIni";

import { DATABASE_OPTIONS } from "@/configs/database-options";

import { getFilterLppSaatIniDefaultValues } from "@/configs/lpp-saat-ini/filter-default-value";

import {
  CardContent,
  CardDescription,
  CardFieldset,
  CardTitleLegend,
} from "@/components/ui/card";
import { getDefaultBranchServerSideProps } from "@/utils/server/getDefaultBranchServerSideProps";
import SelectGroupFlag from "@/components/form/shared/SelectGroupFlag";
import SelectStatusTag from "@/components/form/shared/SelectStatusTag";
import CardSupplier from "@/components/form/shared/CardSupplier";
import SelectStatusQty from "@/components/form/shared/SelectStatusQty";

/**
 * Dijalankan oleh server pada setiap request halaman.
 */
export const getServerSideProps = getDefaultBranchServerSideProps;

type LppSaatIniPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

export default function LppSaatIniPage({ defaultBranch }: LppSaatIniPageProps) {
  const router = useRouter();

  const methods = useForm<FilterLppSaatIniInput>({
    resolver: zodResolver(FilterLppSaatIniSchema),

    /**
     * Gunakan default values khusus LPP Saat Ini
     * dan kirim branch hasil pembacaan IP client.
     */
    defaultValues: getFilterLppSaatIniDefaultValues(defaultBranch),
  });

  const { control, reset, clearErrors, watch, handleSubmit } = methods;

  const selectedBranch = watch("branch");

  const onSubmit = async (data: FilterLppSaatIniInput) => {
    try {
      const params = new URLSearchParams();

      Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          return;
        }

        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (item !== "") {
              params.append(key, String(item));
            }
          });

          return;
        }

        params.append(key, String(value));
      });

      await router.push(`/inventory/lpp-saat-ini/laporan?${params.toString()}`);
    } catch (error) {
      console.error("Submit error:", error);

      toast.error("Terjadi kesalahan saat menampilkan laporan", {
        position: "top-right",
      });
    }
  };

  const handleReset = () => {
    /**
     * Reset menggunakan branch hasil deteksi IP.
     */
    reset(getFilterLppSaatIniDefaultValues(defaultBranch));

    clearErrors();

    toast.success("Filter berhasil direset", {
      position: "top-right",
      duration: 1500,
    });
  };

  return (
    <Layout title="LPP Saat Ini" branch={selectedBranch}>
      <Form {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-blue-500">
              LPP Saat Ini
              {selectedBranch ? ` - ${selectedBranch}` : ""}
            </h1>

            <SettingsDatabase<FilterLppSaatIniInput>
              control={control}
              name="branch"
              options={DATABASE_OPTIONS}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <div>
              <CardFieldset className={`relative rounded-lg border shadow`}>
                <CardTitleLegend className="mx-6 px-2 text-md font-semibold">
                  Lokasi
                </CardTitleLegend>

                <CardContent>
                  <SelectLokasi<FilterLppSaatIniInput>
                    control={control}
                    name="lokasi"
                    labelAll="All Lokasi"
                    placeholder="All Lokasi"
                  />
                </CardContent>
              </CardFieldset>

              <CardFieldset className={`relative rounded-lg border shadow`}>
                <CardTitleLegend className="mx-6 px-2 text-md font-semibold">
                  Group Flag
                </CardTitleLegend>

                <CardContent>
                  <SelectGroupFlag<FilterLppSaatIniInput>
                    control={control}
                    name="groupFlag"
                    labelAll="All Flag"
                    placeholder="All Flag"
                  />
                </CardContent>
              </CardFieldset>

              <CardFieldset className={`relative rounded-lg border shadow`}>
                <CardTitleLegend className="mx-6 px-2 text-md font-semibold">
                  Status Tag
                </CardTitleLegend>

                <CardContent>
                  <SelectStatusTag<FilterLppSaatIniInput>
                    control={control}
                    name="statusTag"
                    labelAll="All Status Tag"
                    placeholder="All Status Tag"
                  />
                  <CardDescription>
                    <span className="px-3 text-xs text-muted-foreground">
                      Discontinue: <i>ARNHOTX</i>
                    </span>
                  </CardDescription>
                </CardContent>
              </CardFieldset>

              <CardFieldset className={`relative rounded-lg border shadow`}>
                <CardTitleLegend className="mx-6 px-2 text-md font-semibold">
                  Status Qty
                </CardTitleLegend>

                <CardContent>
                  <SelectStatusQty<FilterLppSaatIniInput>
                    control={control}
                    name="statusQty"
                    labelAll="All Status Qty"
                    placeholder="All"
                    enableSearch={true}
                  />
                </CardContent>
              </CardFieldset>
            </div>

            <div>
              <CardProduk<FilterLppSaatIniInput>
                control={control}
                fields={{
                  plu: {
                    name: "prdcd",
                  },

                  namaProduk: {
                    name: "namaBarang",
                  },

                  monitoringPlu: {
                    name: "kodeMonitoringPlu",
                  },

                  divisi: {
                    name: "div",
                  },

                  departement: {
                    name: "dept",
                    parentName: "div",
                  },

                  kategori: {
                    name: "katb",
                    parentName: "dept",
                  },

                  tag: {
                    name: "tag",
                  },
                }}
              />
            </div>

            <div>
              <CardSupplier<FilterLppSaatIniInput>
                control={control}
                fields={{
                  kodeSupplier: {
                    name: "kodeSupplier",
                    multiple: true,
                    separator: ",",
                    allowManualInput: true,
                  },
                  namaSupplier: {
                    name: "namaSupplier",
                  },
                }}
              />
            </div>
          </div>

          <div className="border-t border-black pt-4 dark:border-slate-800">
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
          </div>
        </form>
      </Form>
    </Layout>
  );
}
