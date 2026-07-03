// src/pages/evaluasi-sales/index.tsx
import { useRouter } from "next/router";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { ArrowRightIcon, RotateCcw } from "lucide-react";

import Layout from "@/components/Layout";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import SettingsDatabase from "@/components/Settings/SettingsDatabase";

import {
  FilterDetailStrukSchema,
  type FilterDetailStrukInput,
} from "@/schema/filterDetailStruk";

import { DATABASE_OPTIONS } from "@/configs/database-options";

import { getFilterDetailStrukDefaultValues } from "@/configs/evaluasi-sales/filter-default-value";

import { EVALUASI_SALES_REPORT_OPTIONS } from "@/configs/evaluasi-sales/report-options";

import { FormatTanggal } from "@/utils/formatTanggal";

import PeriodeRange from "@/components/form/shared/PeriodeRange";
import CardProduk from "@/components/form/shared/CardProduk";
import CardKasir from "@/components/form/shared/CardKasir";
import CardMember from "@/components/form/shared/CardMember";
import CardPromo from "@/components/form/shared/CardPromo";
import SelectReport from "@/components/form/shared/SelectReport";
import { getDefaultBranchServerSideProps } from "@/utils/server/getDefaultBranchServerSideProps";
import { InferGetServerSidePropsType } from "next";
import CardSupplier from "@/components/form/shared/CardSupplier";
import { useState } from "react";

/**
 * Dijalankan pada server setiap kali halaman dibuka.
 *
 * Request digunakan untuk membaca IP komputer client,
 * kemudian menentukan branch berdasarkan segment IP.
 */
export const getServerSideProps = getDefaultBranchServerSideProps;
type EvaluasiSalesPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

export default function EvaluasiSales({
  defaultBranch,
}: EvaluasiSalesPageProps) {
  const router = useRouter();
  const [branch, setBranch] = useState(defaultBranch);
  const methods = useForm<FilterDetailStrukInput>({
    resolver: zodResolver(FilterDetailStrukSchema),

    /**
     * Branch pertama diisi berdasarkan IP client.
     */
    defaultValues: getFilterDetailStrukDefaultValues(),
  });

  const { control, reset, clearErrors, handleSubmit } = methods;

  const onSubmit = async (data: FilterDetailStrukInput) => {
    try {
      const reportType = data.selectedReport ?? "per-divisi";

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
        `/evaluasi-sales/laporan/${reportType}?${params.toString()}`,
      );

      toast.success(`Laporan ${reportType} sedang diproses`, {
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

      toast.error("Terjadi kesalahan saat submit");
    }
  };

  const handleReset = () => {
    /**
     * Reset kembali ke default values.
     *
     * Branch tetap memakai hasil deteksi IP client,
     * bukan hanya nilai NEXT_PUBLIC_APP_NAME.
     *
     * Tanggal dihitung kembali agar selalu memakai
     * tanggal ketika tombol reset ditekan.
     */
    reset(getFilterDetailStrukDefaultValues());

    clearErrors();

    toast.success("Semua filter berhasil direset", {
      position: "top-right",
      duration: 1500,
    });
  };

  return (
    <Layout title="Evaluasi Sales" branch={branch}>
      <Form {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="flex items-center gap-1 text-2xl font-bold text-blue-500">
              Evaluasi Sales
              <ArrowRightIcon size={22} />
              {branch}
            </h1>

            <SettingsDatabase
              value={branch}
              onChange={setBranch}
              options={DATABASE_OPTIONS}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {/* KOLOM PERTAMA */}
            <div className="space-y-4">
              <PeriodeRange<FilterDetailStrukInput>
                control={control}
                startDateName="startDate"
                endDateName="endDate"
              />

              <CardMember<FilterDetailStrukInput>
                control={control}
                fields={{
                  namaMember: {
                    name: "namaMember",
                  },

                  noMember: {
                    name: "noMember",
                    multiple: true,
                    separator: ", ",
                    allowManualInput: true,
                  },

                  monitoringMember: {
                    name: "monitoringMember",
                  },

                  memberKhusus: {
                    name: "memberKhusus",
                  },

                  outlet: {
                    name: "outlet",
                  },

                  subOutlet: {
                    name: "subOutlet",
                    parentName: "outlet",
                  },

                  kategoriMember: {
                    name: "katMember",
                  },
                }}
              />
            </div>

            {/* KOLOM KEDUA */}
            <div className="space-y-4">
              <CardProduk<FilterDetailStrukInput>
                control={control}
                fields={{
                  plu: {
                    name: "prdcd",
                  },

                  namaProduk: {
                    name: "namaBarang",
                  },

                  barcode: {
                    name: "barcode",
                    placeholder: "Barcode",
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
                    name: "kat",
                    parentName: "dept",
                  },

                  tag: {
                    name: "tag",
                  },

                  nonPromo: {
                    name: "pluLarangan",
                    placeholder: "Larangan/Non Larangan",
                  },
                }}
              />
            </div>

            {/* KOLOM KETIGA */}
            <div className="space-y-4">
              <CardPromo<FilterDetailStrukInput>
                startDateName="startDate"
                endDateName="endDate"
                fields={{
                  gift: {
                    name: "kodeGift",
                    placeholder: "Kode Gift",
                    allowManualInput: true,
                    multiple: true,
                  },

                  cashback: {
                    name: "cashback",
                    placeholder: "Kode Cashback",
                    multiple: true,
                  },
                }}
              />

              <CardKasir<FilterDetailStrukInput>
                control={control}
                fields={{
                  kodeKasir: {
                    name: "kasir",
                    placeholder: "Kode Kasir",
                    multiple: true,
                    allowManualInput: true,
                    separator: ", ",
                  },

                  station: {
                    name: "station",
                    placeholder: "Station",
                  },

                  noTrans: {
                    name: "noTrans",
                    placeholder: "No Transaksi",
                  },

                  kassa: {
                    name: "kasirType",
                  },

                  methode: {
                    name: "methodType",
                  },
                }}
              />
            </div>

            {/* KOLOM KEEMPAT */}
            <div className="space-y-4">
              <CardSupplier<FilterDetailStrukInput>
                control={control}
                fields={{
                  kodeSupplier: {
                    name: "kodeSupplier",
                    placeholder: "Kode Supplier",
                    multiple: true,
                  },

                  namaSupplier: {
                    name: "namaSupplier",
                    placeholder: "Nama Supplier",
                  },
                }}
              />

              <SelectReport<FilterDetailStrukInput>
                control={control}
                name="selectedReport"
                options={EVALUASI_SALES_REPORT_OPTIONS}
              />
            </div>
          </div>

          <div className="mt-4 border-t border-black pt-4 dark:border-white">
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
