// src/components/form/shared/SelectNonPromo.tsx

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import { DependentSelectWrapper } from "@/components/DependentSelectWrapper";

type NonPromoValue = "larangan" | "non-larangan";

interface NonPromoOption {
  label: string;
  value: NonPromoValue;
}

interface SelectNonPromoProps<TFieldValues extends FieldValues> {
  /**
   * Control dari React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Nama field untuk menyimpan pilihan promo atau non-promo.
   *
   * Contoh:
   * name="pluLarangan"
   */
  name: FieldPathByValue<TFieldValues, string | undefined>;

  /**
   * Teks pilihan semua data.
   *
   * @default "All"
   */
  labelAll?: string;

  /**
   * Placeholder select.
   *
   * @default "Item Promo/Non Promo"
   */
  placeholder?: string;
  disabled?: boolean;
}

const NON_PROMO_OPTIONS: NonPromoOption[] = [
  {
    label: "Item Non Promo",
    value: "larangan",
  },
  {
    label: "Item Promo",
    value: "non-larangan",
  },
];

export default function SelectNonPromo<TFieldValues extends FieldValues>({
  control,
  name,
  labelAll = "All",
  placeholder = "Item Promo/Non Promo",
  disabled = false,
}: SelectNonPromoProps<TFieldValues>) {
  return (
    <DependentSelectWrapper<NonPromoOption, TFieldValues>
      disabled={disabled}
      control={control}
      name={name}
      staticData={NON_PROMO_OPTIONS}
      getOption={(item) => ({
        label: item.label,
        value: item.value,
      })}
      labelAll={labelAll}
      placeholder={placeholder}
    />
  );
}
