// src/components/input/InputKodeKasir.tsx

import { useState } from "react";
import {
  Controller,
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import InputKodeKasirModal, {
  type KasirSelection,
} from "@/components/modal/InputKodeKasirModal";

type KasirFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | string[] | undefined
>;

interface InputKodeKasirProps<TFieldValues extends FieldValues> {
  name: KasirFieldName<TFieldValues>;

  placeholder?: string;

  disabled?: boolean;

  /**
   * Menyimpan data sebagai string[]
   *
   * @default false
   */
  multiple?: boolean;

  /**
   * Jika multiple=true maka hasil
   * ditambahkan ke data sebelumnya.
   *
   * @default true
   */
  append?: boolean;

  /**
   * Separator ketika multiple=true
   *
   * @default ","
   */
  separator?: string;

  /**
   * Mengizinkan input manual.
   *
   * @default true
   */
  allowManualInput?: boolean;

  /**
   * Judul modal.
   */
  modalTitle?: string;
}

function normalizeToArray(value: unknown, separator: string): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(separator)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function removeDuplicateValues(values: string[]) {
  return [...new Set(values)];
}

export default function InputKodeKasir<TFieldValues extends FieldValues>({
  name,
  placeholder = "Kode Kasir",
  disabled = false,
  multiple = false,
  append = true,
  separator = ",",
  allowManualInput = true,
  modalTitle = "Pilih Kode Kasir",
}: InputKodeKasirProps<TFieldValues>) {
  const [show, setShow] = useState(false);

  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedValues = normalizeToArray(field.value, separator);

        const displayValue = multiple
          ? selectedValues.join(`${separator} `)
          : (selectedValues[0] ?? "");

        const handleManualChange = (value: string) => {
          if (!multiple) {
            field.onChange(value);
            return;
          }

          const values = normalizeToArray(value, separator);

          field.onChange(removeDuplicateValues(values));
        };

        const handleKasirSelect = (selection: KasirSelection) => {
          const kodeKasir = selection.kodeKasir.trim();

          if (!kodeKasir) {
            return;
          }

          if (!multiple) {
            field.onChange(kodeKasir);
            setShow(false);
            return;
          }

          const nextValues = append
            ? [...selectedValues, kodeKasir]
            : [kodeKasir];

          field.onChange(removeDuplicateValues(nextValues));

          setShow(false);
        };

        return (
          <>
            <div className="space-y-1">
              <div className="relative">
                <Input
                  ref={field.ref}
                  name={field.name}
                  value={displayValue}
                  placeholder={placeholder}
                  disabled={disabled}
                  readOnly={!allowManualInput}
                  className="pr-10"
                  onBlur={field.onBlur}
                  onChange={(event) => handleManualChange(event.target.value)}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={disabled}
                  onClick={() => setShow(true)}
                  aria-label="Cari Kasir"
                  className="absolute right-0 top-1/2 h-full -translate-y-1/2 cursor-pointer text-muted-foreground hover:bg-transparent hover:text-foreground">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {fieldState.error && (
                <p className="text-sm text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </div>

            <InputKodeKasirModal
              show={show}
              onClose={() => setShow(false)}
              title={modalTitle}
              onSelect={handleKasirSelect}
            />
          </>
        );
      }}
    />
  );
}
