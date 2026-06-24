// src/components/form/shared/Periode.tsx

import {
  Controller,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import { Calendar22 } from "@/components/DatePicker";

import {
  CardContent,
  CardFieldset,
  CardTitleLegend,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";

export type DateFieldPath<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

export interface PeriodeProps<TFieldValues extends FieldValues> {
  /**
   * Control milik React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Field yang menyimpan tanggal mulai.
   *
   * Field harus bertipe string atau string | undefined.
   *
   * @example
   * startDateName="startDate"
   */
  startDateName: DateFieldPath<TFieldValues>;

  /**
   * Field yang menyimpan tanggal akhir.
   *
   * Field harus bertipe string atau string | undefined.
   *
   * @example
   * endDateName="endDate"
   */
  endDateName: DateFieldPath<TFieldValues>;

  /**
   * Judul fieldset.
   *
   * Berikan string kosong untuk menyembunyikan judul.
   *
   * @default "Periode"
   */
  title?: string;

  /**
   * Label tanggal mulai.
   *
   * @default "Tanggal Mulai"
   */
  startDateLabel?: string;

  /**
   * Label tanggal akhir.
   *
   * @default "Tanggal Akhir"
   */
  endDateLabel?: string;

  /**
   * Class tambahan untuk CardFieldset.
   */
  className?: string;

  /**
   * Class tambahan untuk CardContent.
   *
   * Bisa digunakan untuk mengatur jumlah kolom.
   *
   * @default "grid gap-4 md:grid-cols-2"
   */
  contentClassName?: string;
}

export default function Periode<TFieldValues extends FieldValues>({
  control,
  startDateName,
  endDateName,
  title = "Periode",
  startDateLabel = "Tanggal Mulai",
  endDateLabel = "Tanggal Akhir",
  className,
  contentClassName,
}: PeriodeProps<TFieldValues>) {
  return (
    <CardFieldset
      className={cn("relative rounded-lg border shadow", className)}>
      {title && (
        <CardTitleLegend className="mx-6 px-2 text-md font-semibold">
          {title}
        </CardTitleLegend>
      )}

      <CardContent
        className={cn("grid gap-4 md:grid-cols-2", contentClassName)}>
        <Controller<TFieldValues, DateFieldPath<TFieldValues>>
          control={control}
          name={startDateName}
          render={({ field }) => {
            const currentValue =
              typeof field.value === "string" ? field.value : "";

            return (
              <Calendar22
                label={startDateLabel}
                value={currentValue}
                onChange={(value) => {
                  field.onChange(value);
                }}
              />
            );
          }}
        />

        <Controller<TFieldValues, DateFieldPath<TFieldValues>>
          control={control}
          name={endDateName}
          render={({ field }) => {
            const currentValue =
              typeof field.value === "string" ? field.value : "";

            return (
              <Calendar22
                label={endDateLabel}
                value={currentValue}
                onChange={(value) => {
                  field.onChange(value);
                }}
              />
            );
          }}
        />
      </CardContent>
    </CardFieldset>
  );
}
