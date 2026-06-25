// src/components/input/InputSerchSupplier.tsx

import { useState } from "react";
import {
  Controller,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import SupplierModal, {
  type SupplierSelection,
} from "@/components/modal/SupplierModal";

/**
 * Field kode supplier boleh bertipe:
 *
 * - string
 * - string[]
 * - undefined
 */
type SupplierFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | string[] | undefined
>;

export interface InputSerchSupplierProps<TFieldValues extends FieldValues> {
  /**
   * Control React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Nama field kode supplier.
   *
   * @example
   * name="kodeSupplier"
   */
  name: SupplierFieldName<TFieldValues>;

  /**
   * Branch database yang sedang aktif.
   *
   * @example
   * branch="IGRCPG"
   */
  branch: string;

  /**
   * Placeholder input.
   *
   * @default "Kode Supplier"
   */
  placeholder?: string;

  /**
   * Mengizinkan lebih dari satu kode supplier.
   *
   * @default false
   */
  multiple?: boolean;

  /**
   * Kode baru ditambahkan ke pilihan sebelumnya.
   *
   * Hanya berlaku jika multiple=true.
   *
   * @default true
   */
  append?: boolean;

  /**
   * Pemisah kode supplier pada input.
   *
   * @default ","
   */
  separator?: string;

  /**
   * Mengizinkan pengguna mengetik secara manual.
   *
   * @default true
   */
  allowManualInput?: boolean;

  /**
   * Menonaktifkan input dan tombol pencarian.
   *
   * @default false
   */
  disabled?: boolean;

  className?: string;
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

function removeDuplicateValues(values: string[]): string[] {
  return Array.from(new Set(values));
}

export default function InputSerchSupplier<TFieldValues extends FieldValues>({
  control,
  name,
  branch,
  placeholder = "Kode Supplier",
  multiple = false,
  append = true,
  separator = ",",
  allowManualInput = true,
  disabled = false,
  className = "",
}: InputSerchSupplierProps<TFieldValues>) {
  const [supplierModal, setSupplierModal] = useState(false);

  const openSupplierModal = () => {
    if (!disabled) {
      setSupplierModal(true);
    }
  };

  const closeSupplierModal = () => {
    setSupplierModal(false);
  };

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

          const nextValues = normalizeToArray(value, separator);

          field.onChange(removeDuplicateValues(nextValues));
        };

        const handleSupplierSelect = (selection: SupplierSelection) => {
          const normalizedCode = selection.code.trim();

          if (!normalizedCode) {
            return;
          }

          if (!multiple) {
            field.onChange(normalizedCode);
            closeSupplierModal();
            return;
          }

          const nextValues = append
            ? [...selectedValues, normalizedCode]
            : [normalizedCode];

          field.onChange(removeDuplicateValues(nextValues));

          closeSupplierModal();
        };

        return (
          <>
            <div className={`space-y-1 ${className}`}>
              <div className="relative">
                <Input
                  ref={field.ref}
                  name={field.name}
                  value={displayValue}
                  placeholder={placeholder}
                  disabled={disabled}
                  readOnly={!allowManualInput}
                  onBlur={field.onBlur}
                  onChange={(event) => handleManualChange(event.target.value)}
                  className="pr-10"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={disabled}
                  onClick={openSupplierModal}
                  aria-label="Cari supplier"
                  className="absolute right-0 top-1/2 h-full -translate-y-1/2 cursor-pointer">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {fieldState.error && (
                <p className="text-sm text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </div>

            <SupplierModal
              show={supplierModal}
              onClose={closeSupplierModal}
              branch={branch}
              onSelect={handleSupplierSelect}
            />
          </>
        );
      }}
    />
  );
}
