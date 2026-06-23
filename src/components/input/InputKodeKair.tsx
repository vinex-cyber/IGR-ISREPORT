// src/components/input/InputKodeKasir.tsx

import { useState } from "react";
import { Search } from "lucide-react";
import {
  Controller,
  useFormContext,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import InputKodeKasirModal from "../modal/InputKodeKasirModal";

type KasirFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | string[] | undefined
>;

interface InputKodeKasirProps<TFieldValues extends FieldValues> {
  name: KasirFieldName<TFieldValues>;
  placeholder?: string;
  disabled?: boolean;

  /**
   * true jika field form bertipe string[].
   *
   * Contoh:
   * kasir: z.array(z.string()).optional()
   */
  multiple?: boolean;
}

const InputKodeKasir = <TFieldValues extends FieldValues>({
  name,
  placeholder = "Kode Kasir",
  disabled = false,
  multiple = false,
}: InputKodeKasirProps<TFieldValues>) => {
  const [show, setShow] = useState(false);

  const { control } = useFormContext<TFieldValues>();

  const handleShow = () => {
    if (disabled) return;

    setShow((previous) => !previous);
  };

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const displayValue = Array.isArray(field.value)
            ? field.value.join(",")
            : String(field.value ?? "");

          return (
            <div className="relative">
              <Input
                ref={field.ref}
                name={field.name}
                value={displayValue}
                placeholder={placeholder}
                disabled={disabled}
                className="pr-10"
                onBlur={field.onBlur}
                onChange={(event) => {
                  const value = event.target.value;

                  if (multiple) {
                    const values = value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean);

                    field.onChange(values);
                    return;
                  }

                  field.onChange(value);
                }}
              />

              <button
                type="button"
                disabled={disabled}
                onClick={handleShow}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2",
                  "text-gray-400 hover:text-black",
                  disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                )}>
                <Search className="h-4 w-4" />
              </button>
            </div>
          );
        }}
      />

      {!disabled && (
        <InputKodeKasirModal show={show} onClose={handleShow} kasir />
      )}
    </>
  );
};

export default InputKodeKasir;
