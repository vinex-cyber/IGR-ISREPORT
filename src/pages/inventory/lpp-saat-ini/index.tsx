// src/pages/inventory/lpp-saat-ini/index.tsx

import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

import Layout from "@/components/Layout";
import SettingsDatabase from "@/components/Settings/Settings";

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

import { getBranchFromRequest } from "@/utils/server/getBranchFomRequest";

interface LppSaatIniPageProps {
  /**
   * Branch default berdasarkan IP client.
   *
   * Jika IP tidak cocok dengan mapping jaringan,
   * akan menggunakan NEXT_PUBLIC_APP_NAME.
   */
  defaultBranch: string;
}

/**
 * Dijalankan oleh server pada setiap request halaman.
 */
export const getServerSideProps: GetServerSideProps<
  LppSaatIniPageProps
> = async ({ req }) => {
  const defaultBranch = getBranchFromRequest(req);

  return {
    props: {
      defaultBranch,
    },
  };
};

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
    <Layout title="LPP Saat Ini">
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

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="space-y-4">
              <SelectLokasi<FilterLppSaatIniInput>
                control={control}
                name="lokasi"
                labelAll="All Lokasi"
                placeholder="All Lokasi"
              />
            </div>

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

          <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
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
