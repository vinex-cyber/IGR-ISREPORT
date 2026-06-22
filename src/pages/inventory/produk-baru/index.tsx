import PeriodeSales from "@/components/form/shared/PeriodeSales2";
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
          <SettingsDatabase
            control={methods.control}
            name="branch"
            options={DATABASE_OPTIONS}
          />

          <PeriodeSales
            control={methods.control}
            startDateName="startDate"
            endDateName="endDate"
          />

          <SelectDivisi control={methods.control} name="div" />

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>

            <Button type="submit">Tampilkan</Button>
          </div>
        </form>
      </Form>
    </Layout>
  );
}
