// src/components/form/shared/SelectNonPromo.tsx

import { useMemo } from "react";

import {
  Controller,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import SelectType, { type SelectOption } from "@/components/SelectType";

export type NonPromoValue = "larangan" | "non-larangan";

export interface NonPromoOption {
  label: string;
  value: NonPromoValue;
  disabled?: boolean;
}

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

export interface SelectNonPromoProps<TFieldValues extends FieldValues> {
  /**
   * Control milik React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Nama field yang menyimpan pilihan promo/non-promo.
   *
   * Field harus bertipe string atau string | undefined.
   *
   * @example
   * name="pluLarangan"
   */
  name: StringFieldName<TFieldValues>;

  /**
   * Pilihan promo dan non-promo.
   *
   * Secara default menggunakan DEFAULT_NON_PROMO_OPTIONS.
   */
  options?: readonly NonPromoOption[];

  /**
   * Label pilihan semua item.
   *
   * @default "All"
   */
  labelAll?: string;

  /**
   * Placeholder select.
   *
   * Jika tidak diberikan, nilainya mengikuti labelAll.
   */
  placeholder?: string;

  /**
   * Menonaktifkan select.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Mengaktifkan pencarian.
   *
   * @default false
   */
  enableSearch?: boolean;

  /**
   * Callback tambahan ketika nilai berubah.
   *
   * Ketika pilihan All dipilih, nilainya berupa string kosong.
   */
  onValueChange?: (value: NonPromoValue | "") => void;
}

export const DEFAULT_NON_PROMO_OPTIONS: readonly NonPromoOption[] = [
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
  options = DEFAULT_NON_PROMO_OPTIONS,
  labelAll = "All",
  placeholder,
  disabled = false,
  enableSearch = false,
  onValueChange,
}: SelectNonPromoProps<TFieldValues>) {
  const resolvedPlaceholder = placeholder ?? labelAll;

  const resolvedOptions = useMemo<SelectOption[]>(
    () => [
      {
        label: labelAll,
        value: "__all__",
      },
      ...options.map((option) => ({
        label: option.label,
        value: option.value,
        disabled: option.disabled,
      })),
    ],
    [labelAll, options],
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedValue =
          typeof field.value === "string" && field.value !== ""
            ? field.value
            : "__all__";

        const handleValueChange = (selectedOption: string) => {
          const formValue: NonPromoValue | "" =
            selectedOption === "__all__"
              ? ""
              : (selectedOption as NonPromoValue);

          field.onChange(formValue);
          onValueChange?.(formValue);
        };

        return (
          <SelectType
            value={selectedValue}
            onChange={handleValueChange}
            options={resolvedOptions}
            placeholder={resolvedPlaceholder}
            disabled={disabled}
            enableSearch={enableSearch}
            error={Boolean(fieldState.error)}
          />
        );
      }}
    />
  );
}
