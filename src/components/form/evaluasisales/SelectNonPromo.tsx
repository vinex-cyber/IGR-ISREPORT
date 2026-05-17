// src/components/form/evaluasisales/SelectNonPromo.tsx

import { Control } from "react-hook-form";
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk";
import { DependentSelectWrapper } from "@/components/DependentSelectWrapper";

type SelectNonPromoProps = {
  control: Control<FilterDetailStrukInput>;
};

const SelectNonPromo = ({ control }: SelectNonPromoProps) => {
  return (
    <DependentSelectWrapper<
      {
        label: string;
        value: string;
      },
      FilterDetailStrukInput
    >
      control={control}
      name="pluLarangan"
      staticData={[
        {
          label: "Item Non Promo",
          value: "larangan",
        },
        {
          label: "Item Promo",
          value: "non-larangan",
        },
      ]}
      getOption={(item) => ({
        label: item.label,
        value: item.value,
      })}
      labelAll="All"
      placeholder="Item Promo/Non Promo"
    />
  );
};

export default SelectNonPromo;
