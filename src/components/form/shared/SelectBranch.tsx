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

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

interface SelectBranchProps<TFieldValues extends FieldValues> {
  /**
   * Control dari React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Nama field yang menyimpan branch.
   *
   * Contoh:
   * name="branch"
   */
  name: StringFieldName<TFieldValues>;

  /**
   * Label input.
   *
   * @default "Branch"
   */
  label?: string;

  /**
   * Placeholder input.
   *
   * @default "Pilih Branch"
   */
  placeholder?: string;

  /**
   * Lebar select.
   *
   * @default "w-[200px]"
   */
  className?: string;

  /**
   * Menonaktifkan select.
   *
   * @default false
   */
  disabled?: boolean;
}

export default function SelectBranch<TFieldValues extends FieldValues>({
  control,
  name,
  label = "Branch",
  placeholder = "Pilih Branch",
  className = "w-[200px]",
  disabled = false,
}: SelectBranchProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValue =
          typeof field.value === "string" ? field.value : "";

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>

            <Select
              value={selectedValue}
              onValueChange={field.onChange}
              disabled={disabled}>
              <FormControl>
                <SelectTrigger className={className}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                {DATABASE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
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
