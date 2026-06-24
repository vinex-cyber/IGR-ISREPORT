// src/components/form/shared/SelectMethode.tsx

import { useMemo } from "react";

import {
  Controller,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import SelectType, { type SelectOption } from "@/components/SelectType";

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

export interface SelectMethodeProps<TFieldValues extends FieldValues> {
  /**
   * Control milik React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Nama field yang menyimpan jenis metode.
   *
   * Field harus bertipe string atau string | undefined.
   *
   * @example
   * name="methodType"
   */
  name: StringFieldName<TFieldValues>;

  /**
   * Daftar pilihan metode.
   *
   * Secara default menggunakan DEFAULT_METHODE_OPTIONS.
   */
  options?: SelectOption[];

  /**
   * Label pilihan semua metode.
   *
   * @default "All Methode"
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
   * Nilai yang diterima sudah berupa nilai form.
   * Pilihan semua metode akan menghasilkan string kosong.
   */
  onValueChange?: (value: string) => void;
}

export const DEFAULT_METHODE_OPTIONS: SelectOption[] = [
  {
    label: "All Methode",
    value: "__all__",
  },
  {
    label: "Kum Mandiri",
    value: "kum",
  },
  {
    label: "Virtual",
    value: "virtual",
  },
];

export default function SelectMethode<TFieldValues extends FieldValues>({
  control,
  name,
  options = DEFAULT_METHODE_OPTIONS,
  labelAll = "All Methode",
  placeholder,
  disabled = false,
  enableSearch = false,
  onValueChange,
}: SelectMethodeProps<TFieldValues>) {
  const resolvedPlaceholder = placeholder ?? labelAll;

  /*
   * Mengganti label option __all__ mengikuti prop labelAll.
   */
  const resolvedOptions = useMemo<SelectOption[]>(() => {
    const hasAllOption = options.some((option) => option.value === "__all__");

    const normalizedOptions = options.map((option) => {
      if (option.value !== "__all__") {
        return option;
      }

      return {
        ...option,
        label: labelAll,
      };
    });

    /*
     * Jika options custom tidak memiliki __all__,
     * tambahkan otomatis di posisi pertama.
     */
    if (!hasAllOption) {
      return [
        {
          label: labelAll,
          value: "__all__",
        },
        ...normalizedOptions,
      ];
    }

    return normalizedOptions;
  }, [options, labelAll]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedValue =
          typeof field.value === "string" && field.value !== ""
            ? field.value
            : "__all__";

        const handleValueChange = (selectedValue: string) => {
          const formValue = selectedValue === "__all__" ? "" : selectedValue;

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
