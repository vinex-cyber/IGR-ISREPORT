// src/components/form/informasi-promosi/FormInformasiPromosi.tsx
import { useForm, useWatch, FormProvider } from "react-hook-form";
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

    methods.reset({ prdcd: "" });
  };

  const onReset = () => {
    methods.reset({ prdcd: "" });
  };

  const prdcd = useWatch({ control: methods.control, name: "prdcd" });
  const isDisabled = !prdcd;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <InputProdukPlu
            name="prdcd"
            className="bg-white dark:bg-gray-800 dark:text-gray-200"
          />
          <div>
            <Button
              type="submit"
              hidden={isDisabled}
              className="ml-2 hover:cursor-pointer bg-blue-500 text-white hover:bg-blue-600 dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/80">
              Submit
            </Button>
            <Button
              type="button"
              hidden={isDisabled}
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
