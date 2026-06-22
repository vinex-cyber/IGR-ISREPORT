// CardProduk.tsx
import {
  CardContent,
  CardFieldset,
  CardTitleLegend,
} from "@/components/ui/card";
import FormInput from "@/components/FormInput";
import { Control } from "react-hook-form";
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk";
import SelectDivisi from "@/components/form/shared/SelectDivisi";
import SelectDepartement from "@/components/form/shared/SelectDepartement";
import Selectkategori from "../shared/Selectkategori";
import SelectTag from "../shared/SelectTag";
import InputProdukPlu from "@/components/input/InputProdukPlu";
import InputNamaProduk from "@/components/input/InputNamaProduk";
import InputMonitoringPlu from "@/components/input/InputMonitoringPlu";
import SelectNonPromo from "../shared/SelectNonPromo";

type CardProdukProps = {
  control: Control<FilterDetailStrukInput>;
};

const CardProduk = ({ control }: CardProdukProps) => {
  return (
    <CardFieldset className="relative border rounded-lg shadow">
      <CardTitleLegend className="text-md font-semibold mx-6 px-2">
        Produk
      </CardTitleLegend>
      <CardContent className="space-y-2">
        <InputProdukPlu />
        <InputNamaProduk />
        <FormInput name="barcode" placeholder="Barcode" />
        <InputMonitoringPlu />
        <SelectDivisi control={control} name="div" />
        <SelectDepartement control={control} name="dept" parentName="div" />
        <Selectkategori control={control} name="kat" parentName="dept" />
        <SelectTag control={control} name="tag" />
        <SelectNonPromo control={control} name="pluLarangan" />
      </CardContent>
    </CardFieldset>
  );
};

export default CardProduk;
