// src/components/form/informasi-promosi/FormInformasiPromosi.tsx
import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/router";

import InputProdukPlu from "@/components/input/InputProdukPlu";
import SettingsDatabase from "@/components/Settings/SettingsDatabase";
import { DATABASE_OPTIONS } from "@/configs/database-options";
import { InformasiPromosiFilters } from "@/schema/store/informasiPromosiSchema";
import { formatPlu } from "@/utils/formatPlu";

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
      router.push(`/form-so-harian/${formattedPlu}`);
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex items-center justify-between gap-4">
        <InputProdukPlu name="prdcd" className="bg-white" />
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
