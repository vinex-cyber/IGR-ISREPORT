import CardProduk from "@/components/form/shared/CardProduk";
import SelectLokasi from "@/components/form/shared/SelectLokasi";
import Layout from "@/components/Layout";
import SettingsDatabase from "@/components/Settings/Settings";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DATABASE_OPTIONS } from "@/configs/database-options";
import { getFilterDetailStrukDefaultValues } from "@/configs/evaluasi-sales/filter-default-value";
import { getFilterLppSaatIniDefaultValues } from "@/configs/lpp-saat-ini/filter-default-value";
import {
  FilterLppSaatIniInput,
  FilterLppSaatIniSchema,
} from "@/schema/filterLppSaatIni";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export default function LppSaatIniPage() {
  const router = useRouter();
  const methods = useForm<FilterLppSaatIniInput>({
    resolver: zodResolver(FilterLppSaatIniSchema),
    defaultValues: getFilterDetailStrukDefaultValues(),
  });

  const { control, reset, clearErrors, watch, handleSubmit } = methods;

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

      await router.push(
        `/inventory/lpp-saat-ini/table-lpp-saat-ini?${params.toString()}`,
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleReset = () => {
    reset(getFilterLppSaatIniDefaultValues());

    clearErrors();
  };

  return (
    <Layout title="LPP Saat Ini">
      <Form {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between gap-4">
            <h1 className="text-2xl font-bold text-blue-500">
              Produk Baru - {watch("branch")}
            </h1>
            <SettingsDatabase
              control={control}
              name="branch"
              options={DATABASE_OPTIONS}
            />
          </div>
          <SelectLokasi control={control} name="lokasi" />

          <div className="space-y-4">
            <CardProduk
              control={control}
              fields={{
                plu: { name: "prdcd" },
                namaProduk: { name: "namaBarang" },
                monitoringPlu: { name: "kodeMonitoringPlu" },
                divisi: { name: "div" },
                departement: {
                  name: "dept",
                  parentName: "div",
                },
                kategori: {
                  name: "katb",
                  parentName: "dept",
                },
                tag: { name: "tag" },
              }}
            />
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
}
