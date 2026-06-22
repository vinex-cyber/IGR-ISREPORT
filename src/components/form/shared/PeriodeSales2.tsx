// src/components/form/shared/Periode.tsx

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";

import { Calendar22 } from "@/components/DatePicker";
import {
  CardContent,
  CardFieldset,
  CardTitleLegend,
} from "@/components/ui/card";

type DateFieldPath<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

interface PeriodeProps<TFieldValues extends FieldValues> {
  /**
   * Control dari React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Nama field tanggal mulai.
   *
   * Contoh: "startDate"
   */
  startDateName: DateFieldPath<TFieldValues>;

  /**
   * Nama field tanggal akhir.
   *
   * Contoh: "endDate"
   */
  endDateName: DateFieldPath<TFieldValues>;

  /**
   * Judul fieldset.
   *
   * @default "Periode"
   */
  title?: string;

  /**
   * Label input tanggal mulai.
   *
   * @default "Tanggal Mulai"
   */
  startDateLabel?: string;

  /**
   * Label input tanggal akhir.
   *
   * @default "Tanggal Akhir"
   */
  endDateLabel?: string;
}

export default function Periode<TFieldValues extends FieldValues>({
  control,
  startDateName,
  endDateName,
  title = "Periode",
  startDateLabel = "Tanggal Mulai",
  endDateLabel = "Tanggal Akhir",
}: PeriodeProps<TFieldValues>) {
  return (
    <CardFieldset className="relative rounded-lg border shadow">
      <CardTitleLegend className="mx-6 px-2 text-md font-semibold">
        {title}
      </CardTitleLegend>

      <CardContent>
        <Controller
          control={control}
          name={startDateName}
          render={({ field }) => (
            <Calendar22
              label={startDateLabel}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name={endDateName}
          render={({ field }) => (
            <Calendar22
              label={endDateLabel}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </CardContent>
    </CardFieldset>
  );
}
