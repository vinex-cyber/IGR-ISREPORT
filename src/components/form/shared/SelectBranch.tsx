// src/components/form/shared/SelectBranch.tsx

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DATABASE_OPTIONS } from "@/configs/database-options";

export interface BranchOption {
  label: string;
  value: string;
  disabled?: boolean;
}

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

export interface SelectBranchProps<TFieldValues extends FieldValues> {
  /**
   * Control milik React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Nama field yang menyimpan kode branch.
   *
   * Field harus bertipe string atau string | undefined.
   *
   * @example
   * name="branch"
   */
  name: StringFieldName<TFieldValues>;

  /**
   * Daftar pilihan branch.
   *
   * Secara default menggunakan DATABASE_OPTIONS.
   */
  options?: readonly BranchOption[];

  /**
   * Label input.
   *
   * @default "Branch"
   */
  label?: string;

  /**
   * Menampilkan atau menyembunyikan label.
   *
   * Berguna ketika komponen digunakan di dalam card
   * yang sudah memiliki label sendiri.
   *
   * @default true
   */
  showLabel?: boolean;

  /**
   * Placeholder ketika branch belum dipilih.
   *
   * @default "Pilih Branch"
   */
  placeholder?: string;

  /**
   * Class untuk FormItem.
   */
  formItemClassName?: string;

  /**
   * Class untuk SelectTrigger.
   *
   * @default "w-full"
   */
  className?: string;

  /**
   * Menonaktifkan select.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Callback tambahan ketika branch berubah.
   */
  onValueChange?: (value: string) => void;
}

export default function SelectBranch<TFieldValues extends FieldValues>({
  control,
  name,
  options = DATABASE_OPTIONS,
  label = "Branch",
  showLabel = true,
  placeholder = "Pilih Branch",
  formItemClassName,
  className = "w-full",
  disabled = false,
  onValueChange,
}: SelectBranchProps<TFieldValues>) {
  return (
    <FormField<TFieldValues, StringFieldName<TFieldValues>>
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValue =
          typeof field.value === "string" ? field.value : "";

        const handleValueChange = (value: string) => {
          field.onChange(value);
          onValueChange?.(value);
        };

        return (
          <FormItem className={formItemClassName}>
            {showLabel && label && <FormLabel>{label}</FormLabel>}

            <Select
              value={selectedValue}
              onValueChange={handleValueChange}
              disabled={disabled}>
              <FormControl>
                <SelectTrigger
                  className={className}
                  onBlur={field.onBlur}
                  aria-label={!showLabel ? label : undefined}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
