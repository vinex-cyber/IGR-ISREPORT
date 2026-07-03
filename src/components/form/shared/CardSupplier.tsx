// src/components/form/shared/CardSupplier.tsx

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import {
  CardContent,
  CardFieldset,
  CardTitleLegend,
} from "@/components/ui/card";

import InputSerchSupplier from "@/components/input/InputSerchSupplier";
import InputNamaSupplier from "@/components/input/InputNamaSupplier";

/**
 * Field kode supplier dapat menyimpan:
 *
 * - string
 * - string[]
 * - undefined
 */
type SupplierCodeFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | string[] | undefined
>;

/**
 * Field nama supplier hanya menyimpan string.
 */
type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

interface SupplierCodeFieldConfig<TFieldValues extends FieldValues> {
  name: SupplierCodeFieldName<TFieldValues>;
  placeholder?: string;

  /**
   * Apakah dapat memilih lebih dari satu supplier.
   *
   * @default true
   */
  multiple?: boolean;

  /**
   * Kode supplier baru ditambahkan
   * ke pilihan sebelumnya.
   *
   * Hanya berlaku apabila multiple=true.
   *
   * @default true
   */
  append?: boolean;

  /**
   * Pemisah kode supplier.
   *
   * @default ","
   */
  separator?: string;

  /**
   * Input dapat diketik secara manual.
   *
   * @default true
   */
  allowManualInput?: boolean;

  /**
   * Menonaktifkan input.
   *
   * @default false
   */
  disabled?: boolean;
}

interface SupplierNameFieldConfig<TFieldValues extends FieldValues> {
  name: StringFieldName<TFieldValues>;
  placeholder?: string;
  disabled?: boolean;
}

export interface CardSupplierFields<TFieldValues extends FieldValues> {
  /**
   * Field kode supplier.
   *
   * Tidak ditampilkan apabila tidak dikirim.
   */
  kodeSupplier?: SupplierCodeFieldConfig<TFieldValues>;

  /**
   * Field nama supplier.
   *
   * Tidak ditampilkan apabila tidak dikirim.
   */
  namaSupplier?: SupplierNameFieldConfig<TFieldValues>;
}

export interface CardSupplierProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;

  fields: CardSupplierFields<TFieldValues>;

  /**
   * Judul card.
   *
   * @default "Supplier"
   */
  title?: string;

  className?: string;
  contentClassName?: string;
}

export default function CardSupplier<TFieldValues extends FieldValues>({
  control,
  fields,
  title = "Supplier",
  className = "",
  contentClassName = "",
}: CardSupplierProps<TFieldValues>) {
  return (
    <CardFieldset className={`relative rounded-lg border shadow ${className}`}>
      <CardTitleLegend className="mx-6 px-2 text-md font-semibold">
        {title}
      </CardTitleLegend>

      <CardContent className={`space-y-2 ${contentClassName}`}>
        {fields.kodeSupplier && (
          <InputSerchSupplier<TFieldValues>
            control={control}
            name={fields.kodeSupplier.name}
            placeholder={fields.kodeSupplier.placeholder ?? "Kode Supplier"}
            multiple={fields.kodeSupplier.multiple ?? true}
            append={fields.kodeSupplier.append ?? true}
            separator={fields.kodeSupplier.separator ?? ","}
            allowManualInput={fields.kodeSupplier.allowManualInput ?? true}
            disabled={fields.kodeSupplier.disabled ?? false}
          />
        )}
        {fields.namaSupplier && (
          <InputNamaSupplier<TFieldValues>
            control={control}
            name={fields.namaSupplier.name}
            placeholder={fields.namaSupplier.placeholder ?? "Nama Supplier"}
            disabled={fields.namaSupplier.disabled ?? false}
          />
        )}
      </CardContent>
    </CardFieldset>
  );
}
