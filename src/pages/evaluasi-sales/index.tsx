import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRightIcon, RotateCcw } from "lucide-react";

import Layout from "@/components/Layout";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import SettingsDatabase from "@/components/Settings/Settings";

import {
  FilterDetailStrukInput,
  FilterDetailStrukSchema,
} from "@/schema/filterDetailStruk";

import { DATABASE_OPTIONS } from "@/configs/database-options";
import { getFilterDetailStrukDefaultValues } from "@/configs/evaluasi-sales/filter-default-value";
import { FormatTanggal } from "@/utils/formatTanggal";
import PeriodeRange from "@/components/form/shared/PeriodeRange";

// Dynamic import untuk menghindari masalah SSR

const SelectReport = dynamic(
  () => import("@/components/form/evaluasisales/SelectReport"),
  {
    ssr: false,
  },
);

const CardMember = dynamic(
  () => import("@/components/form/evaluasisales/CardMember"),
  {
    ssr: false,
  },
);

const CardProduk = dynamic(
  () => import("@/components/form/evaluasisales/CardProduk"),
  {
    ssr: false,
  },
);

const CardSupplier = dynamic(
  () => import("@/components/form/evaluasisales/CardSupplier"),
  {
    ssr: false,
  },
);

const CardPromo = dynamic(
  () => import("@/components/form/evaluasisales/CardPromo"),
  {
    ssr: false,
  },
);

const CardKasir = dynamic(
  () => import("@/components/form/evaluasisales/CardKasir"),
  {
    ssr: false,
  },
);

const EvaluasiSales = () => {
  const router = useRouter();

  const methods = useForm<FilterDetailStrukInput>({
    resolver: zodResolver(FilterDetailStrukSchema),

    /*
     * Semua nilai awal diambil dari satu file.
     */
    defaultValues: getFilterDetailStrukDefaultValues(),
  });

  const { control, reset, clearErrors, watch, handleSubmit } = methods;

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
    /*
     * Memanggil fungsi lagi agar tanggal kembali
     * menggunakan tanggal hari ini saat tombol diklik.
     */
    reset(getFilterDetailStrukDefaultValues());

    clearErrors();

    toast.success("Semua filter berhasil direset", {
      position: "top-right",
      duration: 1500,
    });
  };

  return (
    <Layout title="Evaluasi Sales">
      <Form {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="flex items-center gap-1 text-2xl font-bold text-blue-500">
              Evaluasi Sales
              <ArrowRightIcon size={22} />
              {watch("branch")}
            </h1>

            <SettingsDatabase
              control={control}
              name="branch"
              options={DATABASE_OPTIONS}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-4">
              <PeriodeRange
                control={methods.control}
                startDateName="startDate"
                endDateName="endDate"
              />

              <CardMember control={control} />
            </div>

            <div className="space-y-4">
              <CardProduk control={control} />
            </div>

            <div className="space-y-4">
              <CardPromo />

              <CardKasir control={control} />
            </div>

            <div className="space-y-4">
              <CardSupplier />

              <SelectReport control={control} />
            </div>
          </div>

          <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="gap-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:cursor-pointer">
                <RotateCcw size={16} />
                Reset
              </Button>

              <Button
                type="submit"
                variant="outline"
                className="bg-blue-500 text-white hover:bg-green-500 border-blue-500 hover:cursor-pointer">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </Layout>
  );
};

export default EvaluasiSales;
