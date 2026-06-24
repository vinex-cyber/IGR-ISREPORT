// src/pages/inventory/produk-baru/index.tsx

import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import Layout from "@/components/Layout";
import SettingsDatabase from "@/components/Settings/Settings";

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

import { getBranchFromRequest } from "@/utils/server/getBranchFomRequest";
import { FormatTanggal } from "@/utils/formatTanggal";

interface ProdukBaruPageProps {
  /**
   * Branch awal berdasarkan IP client.
   *
   * Apabila IP tidak cocok dengan mapping jaringan,
   * nilainya akan fallback ke NEXT_PUBLIC_APP_NAME.
   */
  defaultBranch: string;
}

/**
 * Dijalankan pada server setiap halaman dibuka.
 *
 * IP client dibaca dari:
 * - X-Real-IP
 * - X-Forwarded-For
 * - req.socket.remoteAddress
 */
export const getServerSideProps: GetServerSideProps<
  ProdukBaruPageProps
> = async ({ req }) => {
  const defaultBranch = getBranchFromRequest(req);

  return {
    props: {
      defaultBranch,
    },
  };
};

export default function ProdukBaruPage({ defaultBranch }: ProdukBaruPageProps) {
  const router = useRouter();

  const methods = useForm<FilterProdukBaruInput>({
    resolver: zodResolver(FilterProdukBaruSchema),

    /**
     * Branch diisi berdasarkan IP client.
     */
    defaultValues: getFilterProdukBaruDefaultValues(defaultBranch),
  });

  const { control, reset, clearErrors, watch, handleSubmit } = methods;

  const selectedBranch = watch("branch");

  const onSubmit = async (data: FilterProdukBaruInput) => {
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

      await router.push(
        `/inventory/produk-baru/table-produk-baru?${params.toString()}`,
      );

      toast.success("Laporan produk baru sedang diproses", {
        duration: 2000,
        position: "top-right",
        description: `Periode: ${FormatTanggal(
          data.startDate ?? "",
        )} - ${FormatTanggal(data.endDate ?? "")}`,
        icon: "📊",
        closeButton: true,
      });
    } catch (error) {
      console.error("Submit error:", error);

      toast.error("Terjadi kesalahan saat submit", {
        position: "top-right",
      });
    }
  };

  const handleReset = () => {
    /**
     * Branch kembali ke hasil deteksi IP client.
     * Tanggal dihitung ulang menggunakan tanggal hari ini.
     */
    reset(getFilterProdukBaruDefaultValues(defaultBranch));

    clearErrors();

    toast.success("Filter berhasil direset", {
      duration: 1500,
      position: "top-right",
    });
  };

  return (
    <Layout title="Produk Baru">
      <Form {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-blue-500">
              Produk Baru
              {selectedBranch ? ` - ${selectedBranch}` : ""}
            </h1>

            <SettingsDatabase<FilterProdukBaruInput>
              control={control}
              name="branch"
              options={DATABASE_OPTIONS}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <PeriodeRange<FilterProdukBaruInput>
              control={control}
              startDateName="startDate"
              endDateName="endDate"
            />

            <CardFieldset className="relative rounded-lg border shadow">
              <CardTitleLegend className="mx-6 px-2 text-md font-semibold">
                Produk
              </CardTitleLegend>

              <CardContent className="space-y-2">
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
                <Button type="submit">Tampilkan</Button>

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
