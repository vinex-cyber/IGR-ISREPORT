// src/components/form/informasi-promosi/FormInformasiPromosi.tsx
import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/router";

import InputProdukPlu from "@/components/input/InputProdukPlu";
import SettingsDatabase from "@/components/Settings/SettingsDatabase";
import { DATABASE_OPTIONS } from "@/configs/database-options";
import { InformasiPromosiFilters } from "@/schema/store/informasiPromosiSchema";
import { formatPlu } from "@/utils/formatPlu";
import { Button } from "@/components/ui/button";

interface FormInformasiPromosiProps {
  branch: string;
  onBranchChange: (branch: string) => void;
}

const FormInformasiPromosi = ({
  branch,
  onBranchChange,
}: FormInformasiPromosiProps) => {
  const router = useRouter();

  const methods = useForm<InformasiPromosiFilters>({
    defaultValues: { prdcd: "" },
  });

  const onSubmit = (formData: InformasiPromosiFilters) => {
    try {
      const formattedPlu = formatPlu(formData.prdcd || "", { validate: true });
      router.push(`/informasi-promosi/${formattedPlu}`);
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  const onReset = () => {
    methods.reset({ prdcd: "" });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <InputProdukPlu name="prdcd" className="bg-white" />
          <div>
            <Button
              type="submit"
              className="ml-2 hover:cursor-pointer bg-blue-500 text-white hover:bg-blue-600 dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/80">
              Submit
            </Button>
            <Button
              type="button"
              onClick={onReset}
              className="ml-2 hover:cursor-pointer bg-red-500 text-white hover:bg-red-600 dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/80">
              Reset
            </Button>
          </div>
        </div>
        <SettingsDatabase
          value={branch}
          onChange={onBranchChange}
          options={DATABASE_OPTIONS}
        />
      </form>
    </FormProvider>
  );
};

export default FormInformasiPromosi;
