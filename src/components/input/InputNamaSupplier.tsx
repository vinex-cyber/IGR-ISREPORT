// src/components/input/InputNamaSupplier.tsx

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
import { cn } from "@/lib/utils";

/**
 * Field nama supplier harus bertipe:
 *
 * - string
 * - undefined
 */
type SupplierNameFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

export interface InputNamaSupplierProps<TFieldValues extends FieldValues> {
  /**
   * Control dari React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Nama field untuk menyimpan nama supplier.
   *
   * @example
   * name="namaSupplier"
   */
  name: SupplierNameFieldName<TFieldValues>;

  /**
   * Placeholder input.
   *
   * @default "Nama Supplier"
   */
  placeholder?: string;

  /**
   * Mengizinkan input diketik secara manual.
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
  textSize?: string;
}

export default function InputNamaSupplier<TFieldValues extends FieldValues>({
  control,
  name,
  placeholder = "Nama Supplier",
  allowManualInput = true,
  disabled = false,
  className = "",
  textSize = "text-sm",
}: InputNamaSupplierProps<TFieldValues>) {
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
        const displayValue = typeof field.value === "string" ? field.value : "";

        const handleSupplierSelect = (selection: SupplierSelection) => {
          const supplierName = selection.name.trim();

          if (!supplierName) {
            return;
          }

          field.onChange(supplierName);

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
                  onChange={(event) => field.onChange(event.target.value)}
                  className={cn("pr-10", className, textSize)}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={disabled}
                  onClick={openSupplierModal}
                  aria-label="Cari nama supplier"
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
              onSelect={handleSupplierSelect}
            />
          </>
        );
      }}
    />
  );
}
