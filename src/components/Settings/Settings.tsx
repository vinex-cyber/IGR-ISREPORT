// components/Settings/SettingsDatabase.tsx

import type {
  Control,
  FieldPath,
  FieldPathValue,
  FieldValues,
} from "react-hook-form";

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

type StringFieldValue<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Extract<FieldPathValue<TFieldValues, TName>, string>;

export interface DatabaseOption<TValue extends string = string> {
  label: string;
  value: TValue;
}

interface SettingsDatabaseProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> {
  /**
   * Control dari React Hook Form.
   *
   * @example
   * control={form.control}
   */
  control: Control<TFieldValues>;

  /**
   * Nama field form yang menyimpan pilihan database.
   *
   * @example
   * name="branch"
   *
   * @example
   * name="database"
   */
  name: TName;

  /**
   * Daftar database yang ditampilkan.
   */
  options: readonly DatabaseOption<StringFieldValue<TFieldValues, TName>>[];

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
}

export default function SettingsDatabase<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  options,
  menuLabel = "Database",
  buttonLabel = "Pilih database",
}: SettingsDatabaseProps<TFieldValues, TName>) {
  return (
    <FormField<TFieldValues, TName>
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                aria-label={buttonLabel}
                className="cursor-pointer">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <Database className="mr-2 h-4 w-4" />

                  {menuLabel}
                </DropdownMenuSubTrigger>

                <DropdownMenuSubContent>
                  {options.map((option) => {
                    const isSelected = String(field.value) === option.value;

                    return (
                      <DropdownMenuItem
                        key={option.value}
                        onSelect={() => field.onChange(option.value)}
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
      )}
    />
  );
}
