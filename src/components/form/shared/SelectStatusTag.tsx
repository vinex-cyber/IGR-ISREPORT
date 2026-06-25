// src/components/form/shared/SelectStatusTag.tsx

import { useMemo } from "react";

import {
  Controller,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import SelectType, { type SelectOption } from "@/components/SelectType";

export type StatusTag = "Active" | "Discontinue";

export interface StatusTagOption {
  label: string;
  value: StatusTag;
  disabled?: boolean;
}

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

export interface SelectStatusTagProps<TFieldValues extends FieldValues> {
  /**
   * Control milik React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Nama field yang menyimpan pilihan StatusTag.
   *
   * Field harus bertipe string atau string | undefined.
   *
   * @example
   * name="statusTag"
   */
  name: StringFieldName<TFieldValues>;

  /**
   * Pilihan aktiv dan discontinue.
   *
   * Secara default menggunakan STATUS_TAG_OPTIONS.
   */
  options?: readonly StatusTagOption[];

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
  onValueChange?: (value: StatusTag | "") => void;
}

export const DEFAULT_STATUS_TAG_OPTIONS: readonly StatusTagOption[] = [
  {
    label: "Aktive",
    value: "Active",
  },
  {
    label: "Discontinue",
    value: "Discontinue",
  },
];

export default function SelectStatusTag<TFieldValues extends FieldValues>({
  control,
  name,
  options = DEFAULT_STATUS_TAG_OPTIONS,
  labelAll = "All",
  placeholder,
  disabled = false,
  enableSearch = false,
  onValueChange,
}: SelectStatusTagProps<TFieldValues>) {
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
          const formValue: StatusTag | "" =
            selectedOption === "__all__" ? "" : (selectedOption as StatusTag);

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
