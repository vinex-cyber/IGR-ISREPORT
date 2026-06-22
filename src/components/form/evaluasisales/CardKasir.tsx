// CardMember.tsx
import {
  CardContent,
  CardFieldset,
  CardTitleLegend,
} from "@/components/ui/card";
import FormInput from "@/components/FormInput";
import { Control } from "react-hook-form";
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk";
import SelectKassa from "./SelectKassa";
import SelectMethode from "./SelectMethode";
import InputKodeKasir from "@/components/input/InputKodeKair";

type CardKasirProps = {
  control: Control<FilterDetailStrukInput>;
};

const CardKasir = ({ control }: CardKasirProps) => {
  return (
    <CardFieldset className="relative border rounded-lg shadow">
      <CardTitleLegend className="text-md font-semibold mx-6 px-2">
        Kasir
      </CardTitleLegend>
      <CardContent className="space-y-2">
        <InputKodeKasir />
        <FormInput name="station" placeholder="Station" />
        <FormInput name="noTrans" placeholder="No Trans" />
        <SelectKassa control={control} />
        <SelectMethode control={control} />
      </CardContent>
    </CardFieldset>
  );
};

export default CardKasir;
