// src/components/form/shared/PeriodeRange.tsx

import {
  CardContent,
  CardFieldset,
  CardTitleLegend,
} from "@/components/ui/card";

import { DateRangePicker } from "@/components/ui/date-range-picker";

import {
  useController,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

type DateFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

interface PeriodeRangeProps<
  TFieldValues extends FieldValues,
  TContext,
  TTransformedValues,
> {
  control: Control<TFieldValues, TContext, TTransformedValues>;

  startDateName: DateFieldName<TFieldValues>;

  endDateName: DateFieldName<TFieldValues>;

  title?: string;
}

/**
 * Mengubah string YYYY-MM-DD menjadi Date lokal.
 * Tidak memakai UTC agar tanggal tidak bergeser.
 */
function parseLocalDate(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
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

export default function PeriodeRange<
  TFieldValues extends FieldValues,
  TContext,
  TTransformedValues,
>({
  control,
  startDateName,
  endDateName,
  title = "Periode",
}: PeriodeRangeProps<TFieldValues, TContext, TTransformedValues>) {
  const { field: startField } = useController<
    TFieldValues,
    DateFieldName<TFieldValues>,
    TTransformedValues
  >({
    control,
    name: startDateName,
  });

  const { field: endField } = useController<
    TFieldValues,
    DateFieldName<TFieldValues>,
    TTransformedValues
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
          onChange={(range) => {
            startField.onChange(formatLocalDate(range?.from));

            endField.onChange(formatLocalDate(range?.to));
          }}
        />
      </CardContent>
    </CardFieldset>
  );
}
