// src/components/form/shared/SelectStatusQty.tsx

import {
  Controller,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import SelectType from "@/components/SelectType";

export interface StatusQtyOption {
  label: string;
  value: string;
}

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

export interface SelectStatusQtyProps<TFieldValues extends FieldValues> {
  /**
   * Control milik React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Nama field yang menyimpan jenis Status Qty.
   *
   * Field harus bertipe string atau string | undefined.
   *
   * @example
   * name="statusQty"
   */
  name: StringFieldName<TFieldValues>;

  /**
   * Daftar pilihan jenis Status Qty.
   *
   * Secara default menggunakan DEFAULT_STATUS_QTY_OPTIONS.
   */
  options?: StatusQtyOption[];

  /**
   * Label pilihan semua pilihan.
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
   * Menonaktifkan enebleSearch
   *
   * @default false
   *
   */
  enableSearch?: boolean;

  /**
   * Callback tambahan ketika nilai berubah.
   */
  onValueChange?: (value: string) => void;
}

export const DEFAULT_STATUS_QTY_OPTIONS: StatusQtyOption[] = [
  {
    label: "All",
    value: "__all__",
  },
  {
    label: "Qty Minus",
    value: "1",
  },
  {
    label: "Qty Kosong",
    value: "2",
  },
  {
    label: "Qty Ada",
    value: "3",
  },
  {
    label: "Qty Dibawah DSI 3 HARI",
    value: "4",
  },
  {
    label: "Qty Dibawah PKM",
    value: "5",
  },
];

export default function SelectStatusQty<TFieldValues extends FieldValues>({
  control,
  name,
  options = DEFAULT_STATUS_QTY_OPTIONS,
  labelAll = "All",
  placeholder,
  disabled = false,
  enableSearch = false,
  onValueChange,
}: SelectStatusQtyProps<TFieldValues>) {
  const resolvedPlaceholder = placeholder ?? labelAll;
  const resolvedEnableSearch = enableSearch || false;
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
            enableSearch={resolvedEnableSearch}
          />
        );
      }}
    />
  );
}
