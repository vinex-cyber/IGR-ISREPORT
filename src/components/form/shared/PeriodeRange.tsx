// src/components/form/shared/PeriodeRange.tsx

import {
  useController,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import {
  CardContent,
  CardFieldset,
  CardTitleLegend,
} from "@/components/ui/card";

import { DateRangePicker } from "@/components/ui/date-range-picker";

type DateFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

export interface PeriodeRangeProps<TFieldValues extends FieldValues> {
  /**
   * Control milik React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Field yang menyimpan tanggal awal
   * dalam format YYYY-MM-DD.
   *
   * @example
   * startDateName="startDate"
   */
  startDateName: DateFieldName<TFieldValues>;

  /**
   * Field yang menyimpan tanggal akhir
   * dalam format YYYY-MM-DD.
   *
   * @example
   * endDateName="endDate"
   */
  endDateName: DateFieldName<TFieldValues>;

  /**
   * Judul card periode.
   *
   * @default "Periode"
   */
  title?: string;
}

/**
 * Mengubah string YYYY-MM-DD menjadi Date lokal.
 * Tidak menggunakan UTC agar tanggal tidak bergeser.
 */
function parseLocalDate(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }

  const parts = value.split("-");

  if (parts.length !== 3) {
    return undefined;
  }

  const [year, month, day] = parts.map(Number);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return undefined;
  }

  const date = new Date(year, month - 1, day);

  const isValid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  return isValid ? date : undefined;
}

/**
 * Mengubah Date menjadi YYYY-MM-DD
 * berdasarkan waktu lokal.
 */
function formatLocalDate(date: Date | undefined): string {
  if (!date) {
    return "";
  }

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function PeriodeRange<TFieldValues extends FieldValues>({
  control,
  startDateName,
  endDateName,
  title = "Periode",
}: PeriodeRangeProps<TFieldValues>) {
  const { field: startField } = useController<
    TFieldValues,
    DateFieldName<TFieldValues>
  >({
    control,
    name: startDateName,
  });

  const { field: endField } = useController<
    TFieldValues,
    DateFieldName<TFieldValues>
  >({
    control,
    name: endDateName,
  });

  const startDate =
    typeof startField.value === "string"
      ? parseLocalDate(startField.value)
      : undefined;

  const endDate =
    typeof endField.value === "string"
      ? parseLocalDate(endField.value)
      : undefined;

  const handleRangeChange = (
    range:
      | {
          from?: Date;
          to?: Date;
        }
      | undefined,
  ) => {
    startField.onChange(formatLocalDate(range?.from));

    endField.onChange(formatLocalDate(range?.to));
  };

  return (
    <CardFieldset className="relative rounded-lg border shadow">
      <CardTitleLegend className="mx-6 px-2 text-md font-semibold">
        {title}
      </CardTitleLegend>

      <CardContent>
        <DateRangePicker
          value={{
            from: startDate,
            to: endDate,
          }}
          onChange={handleRangeChange}
        />
      </CardContent>
    </CardFieldset>
  );
}
