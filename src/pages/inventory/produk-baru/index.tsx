import SelectDivisi from "@/components/form/shared/SelectDivisi";
import SettingsDatabase from "@/components/Settings/Settings";
import Layout from "@/components/Layout";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import {
  FilterProdukBaruInput,
  FilterProdukBaruSchema,
} from "@/schema/filterProdukBaru";

import { getFilterProdukBaruDefaultValues } from "@/configs/produk-baru/filter-default-value";
import { DATABASE_OPTIONS } from "@/configs/database-options";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PeriodeRange from "@/components/form/shared/PeriodeRange";
import SelectDepartement from "@/components/form/shared/SelectDepartement";
import SelectKategori from "@/components/form/shared/Selectkategori";
import {
  CardContent,
  CardFieldset,
  CardTitleLegend,
} from "@/components/ui/card";

export default function ProdukBaruPage() {
  const methods = useForm<FilterProdukBaruInput>({
    resolver: zodResolver(FilterProdukBaruSchema),
    defaultValues: getFilterProdukBaruDefaultValues(),
  });

  const onSubmit = (data: FilterProdukBaruInput) => {
    console.log(data);
  };

  const handleReset = () => {
    methods.reset(getFilterProdukBaruDefaultValues());

    methods.clearErrors();
  };

  return (
    <Layout title="Produk Baru">
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex justify-between gap-4">
            <h1 className="text-2xl font-bold text-blue-500">
              Produk Baru {methods.watch("branch")}
            </h1>
            <SettingsDatabase
              control={methods.control}
              name="branch"
              options={DATABASE_OPTIONS}
            />
          </div>
          <div className="flex justify-around gap-4">
            <PeriodeRange
              control={methods.control}
              startDateName="startDate"
              endDateName="endDate"
            />

            <CardFieldset className="space-y-2">
              <CardTitleLegend className="mx-6 px-2 text-md font-semibold">
                Divisi
              </CardTitleLegend>
              <CardContent className="space-y-2">
                <SelectDivisi control={methods.control} name="div" />
                <SelectDepartement
                  control={methods.control}
                  name="dept"
                  parentName="div"
                />
                <SelectKategori
                  control={methods.control}
                  name="katb"
                  parentName="dept"
                />
              </CardContent>
            </CardFieldset>

            <CardFieldset className="justify-center space-y-2">
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
