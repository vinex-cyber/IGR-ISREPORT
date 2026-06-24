// src/components/form/shared/SelectReport.tsx

import {
  Controller,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import SelectType, { type SelectOption } from "@/components/SelectType";

import {
  CardContent,
  CardFieldset,
  CardTitleLegend,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

export interface SelectReportProps<TFieldValues extends FieldValues> {
  /**
   * Control milik React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Nama field yang menyimpan jenis laporan.
   *
   * Field harus bertipe string atau string | undefined.
   *
   * @example
   * name="selectedReport"
   */
  name: StringFieldName<TFieldValues>;

  /**
   * Daftar pilihan jenis laporan.
   *
   * Data dikirim dari komponen induk sehingga
   * SelectReport dapat digunakan pada form lain.
   */
  options: SelectOption[];

  /**
   * Judul card.
   *
   * @default "Jenis Laporan"
   */
  title?: string;

  /**
   * Placeholder select.
   *
   * @default "Pilih Jenis Laporan"
   */
  placeholder?: string;

  /**
   * Menonaktifkan select.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Mengaktifkan pencarian.
   *
   * @default false
   */
  enableSearch?: boolean;

  /**
   * Menampilkan pembungkus CardFieldset.
   *
   * true:
   * komponen ditampilkan sebagai card.
   *
   * false:
   * hanya menampilkan select.
   *
   * @default true
   */
  showCard?: boolean;

  /**
   * Class tambahan untuk CardFieldset.
   */
  className?: string;

  /**
   * Class tambahan untuk CardContent.
   */
  contentClassName?: string;

  /**
   * Class tambahan untuk SelectType.
   */
  selectClassName?: string;

  /**
   * Callback tambahan ketika jenis laporan berubah.
   */
  onValueChange?: (value: string) => void;
}

export default function SelectReport<TFieldValues extends FieldValues>({
  control,
  name,
  options,
  title = "Jenis Laporan",
  placeholder = "Pilih Jenis Laporan",
  disabled = false,
  enableSearch = false,
  showCard = true,
  className,
  contentClassName,
  selectClassName,
  onValueChange,
}: SelectReportProps<TFieldValues>) {
  const selectField = (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedValue =
          typeof field.value === "string" ? field.value : "";

        const handleValueChange = (value: string) => {
          field.onChange(value);
          onValueChange?.(value);
        };

        return (
          <SelectType
            value={selectedValue}
            onChange={handleValueChange}
            options={options}
            placeholder={placeholder}
            disabled={disabled}
            enableSearch={enableSearch}
            error={Boolean(fieldState.error)}
            className={selectClassName}
          />
        );
      }}
    />
  );

  if (!showCard) {
    return selectField;
  }

  return (
    <CardFieldset
      className={cn("relative rounded-lg border shadow", className)}>
      {title && (
        <CardTitleLegend className="mx-6 px-2 text-md font-semibold">
          {title}
        </CardTitleLegend>
      )}

      <CardContent className={cn("space-y-2", contentClassName)}>
        {selectField}
      </CardContent>
    </CardFieldset>
  );
}
