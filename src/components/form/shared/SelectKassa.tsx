// src/components/form/shared/SelectKassa.tsx

import {
  Controller,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import SelectType from "@/components/SelectType";

export interface KassaOption {
  label: string;
  value: string;
}

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

export interface SelectKassaProps<TFieldValues extends FieldValues> {
  /**
   * Control milik React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Nama field yang menyimpan jenis kassa.
   *
   * Field harus bertipe string atau string | undefined.
   *
   * @example
   * name="kasirType"
   */
  name: StringFieldName<TFieldValues>;

  /**
   * Daftar pilihan jenis kassa.
   *
   * Secara default menggunakan DEFAULT_KASSA_OPTIONS.
   */
  options?: KassaOption[];

  /**
   * Label pilihan semua kassa.
   *
   * @default "All Kassa"
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
   * Callback tambahan ketika nilai berubah.
   */
  onValueChange?: (value: string) => void;
}

export const DEFAULT_KASSA_OPTIONS: KassaOption[] = [
  {
    label: "All Kassa",
    value: "__all__",
  },
  {
    label: "Non KSS",
    value: "non-kss",
  },
  {
    label: "Only KSS",
    value: "only-kss",
  },
];

export default function SelectKassa<TFieldValues extends FieldValues>({
  control,
  name,
  options = DEFAULT_KASSA_OPTIONS,
  labelAll = "All Kassa",
  placeholder,
  disabled = false,
  onValueChange,
}: SelectKassaProps<TFieldValues>) {
  const resolvedPlaceholder = placeholder ?? labelAll;

  const resolvedOptions = options.map((option) => {
    if (option.value !== "__all__") {
      return option;
    }

    return {
      ...option,
      label: labelAll,
    };
  });

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedValue =
          typeof field.value === "string" && field.value !== ""
            ? field.value
            : "__all__";

        const handleValueChange = (value: string) => {
          const formValue = value === "__all__" ? "" : value;

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
            error={Boolean(fieldState.error)}
          />
        );
      }}
    />
  );
}
