// src/components/Settings/SettingsDatabase.tsx

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import { FormField, FormItem } from "@/components/ui/form";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { Check, Database, Settings } from "lucide-react";

import type { DatabaseOption } from "@/configs/database-options";

/**
 * Hanya menerima nama field yang nilainya:
 * - string
 * - string | undefined
 */
type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

export interface SettingsDatabaseProps<TFieldValues extends FieldValues> {
  /**
   * Control milik React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Nama field yang menyimpan branch/database.
   *
   * Field harus bertipe string.
   *
   * @example
   * name="branch"
   */
  name: StringFieldName<TFieldValues>;

  /**
   * Daftar pilihan database.
   */
  options: readonly DatabaseOption[];

  /**
   * Judul submenu.
   *
   * @default "Database"
   */
  menuLabel?: string;

  /**
   * Label aksesibilitas tombol settings.
   *
   * @default "Pilih database"
   */
  buttonLabel?: string;

  /**
   * Menonaktifkan tombol dan pilihan database.
   *
   * @default false
   */
  disabled?: boolean;
}

export default function SettingsDatabase<TFieldValues extends FieldValues>({
  control,
  name,
  options,
  menuLabel = "Database",
  buttonLabel = "Pilih database",
  disabled = false,
}: SettingsDatabaseProps<TFieldValues>) {
  return (
    <FormField<TFieldValues, StringFieldName<TFieldValues>>
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValue =
          typeof field.value === "string" ? field.value : "";

        return (
          <FormItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  aria-label={buttonLabel}
                  title={buttonLabel}
                  disabled={disabled}
                  className="cursor-pointer">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger
                    disabled={disabled}
                    className="cursor-pointer">
                    <Database className="mr-2 h-4 w-4" />

                    {menuLabel}
                  </DropdownMenuSubTrigger>

                  <DropdownMenuSubContent>
                    {options.map((option) => {
                      const isSelected = selectedValue === option.value;

                      return (
                        <DropdownMenuItem
                          key={option.value}
                          disabled={disabled}
                          onSelect={() => {
                            field.onChange(option.value);
                          }}
                          className="flex cursor-pointer items-center justify-between">
                          <span>{option.label}</span>

                          {isSelected && <Check className="ml-2 h-4 w-4" />}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
          </FormItem>
        );
      }}
    />
  );
}
