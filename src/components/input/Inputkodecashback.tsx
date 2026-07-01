// src/components/input/InputKodeCashback.tsx

import { useState, type ChangeEvent } from "react";

import { Search } from "lucide-react";

import {
  Controller,
  useFormContext,
  type FieldPathByValue,
  type FieldPathValue,
  type FieldValues,
} from "react-hook-form";

import { Input } from "@/components/ui/input";
import InputCashbackModal from "@/components/modal/InputCashbackModal";

import type { DaftarCashbackRows } from "@/configs/input/daftar-cashbackConfig";

import { cn } from "@/lib/utils";

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

type CashbackFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | string[] | undefined
>;

type DateInput = string | Date | null | undefined;

export interface InputKodeCashbackProps<TFieldValues extends FieldValues> {
  /**
   * Field yang menyimpan kode cashback.
   *
   * Mendukung:
   * - string
   * - string[]
   * - undefined
   *
   * @example
   * name="cashback"
   */
  name: CashbackFieldName<TFieldValues>;

  /**
   * Field tanggal awal.
   *
   * Tanggal awal cashback yang dipilih
   * akan dimasukkan ke field ini.
   */
  startDateName?: StringFieldName<TFieldValues>;

  /**
   * Field tanggal akhir.
   */
  endDateName?: StringFieldName<TFieldValues>;

  /**
   * Placeholder input.
   *
   * @default "Kode Cashback"
   */
  placeholder?: string;

  /**
   * Menonaktifkan input dan tombol modal.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Mengaktifkan penyimpanan banyak kode cashback.
   *
   * false:
   * pilihan modal disimpan sebagai string.
   *
   * true:
   * pilihan modal disimpan sebagai string[].
   *
   * @default false
   */
  multiple?: boolean;

  /**
   * Menambahkan pilihan modal ke nilai sebelumnya.
   *
   * Hanya berlaku ketika multiple=true.
   *
   * @default true
   */
  appendOnSelect?: boolean;

  /**
   * Pemisah kode cashback.
   *
   * @default ","
   */
  separator?: string;

  /**
   * Mengubah periode berdasarkan cashback
   * yang dipilih dari modal.
   *
   * @default true
   */
  updatePeriodOnSelect?: boolean;

  /**
   * Mengizinkan input manual.
   *
   * false membuat input menjadi read-only,
   * tetapi tombol pencarian tetap dapat digunakan.
   *
   * @default true
   */
  allowManualInput?: boolean;

  /**
   * Class tambahan untuk pembungkus input.
   */
  className?: string;

  /**
   * Class tambahan untuk input.
   */
  inputClassName?: string;

  /**
   * Callback setelah nilai cashback berubah.
   */
  onValueChange?: (value: string | string[]) => void;

  /**
   * Callback setelah data cashback dipilih.
   */
  onCashbackSelect?: (row: DaftarCashbackRows) => void;
}

/**
 * Mengubah tanggal menjadi YYYY-MM-DD
 * berdasarkan waktu lokal.
 */
function createLocalDateString(
  year: number,
  month: number,
  day: number,
): string {
  const date = new Date(year, month - 1, day);

  const isValid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  if (!isValid) {
    return "";
  }

  const formattedMonth = String(month).padStart(2, "0");

  const formattedDay = String(day).padStart(2, "0");

  return `${year}-${formattedMonth}-${formattedDay}`;
}

/**
 * Mengubah format tanggal dari database
 * menjadi YYYY-MM-DD.
 *
 * Mendukung:
 * - YYYYMMDD
 * - YYYY-MM-DD
 * - YYYY-MM-DD HH:mm:ss
 * - ISO timestamp
 * - Date
 */
function formatDate(value: DateInput): string {
  if (!value) {
    return "";
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return "";
    }

    return createLocalDateString(
      value.getFullYear(),
      value.getMonth() + 1,
      value.getDate(),
    );
  }

  const stringValue = String(value).trim();

  const compactDateMatch = stringValue.match(/^(\d{4})(\d{2})(\d{2})$/);

  if (compactDateMatch) {
    return createLocalDateString(
      Number(compactDateMatch[1]),
      Number(compactDateMatch[2]),
      Number(compactDateMatch[3]),
    );
  }

  const normalDateMatch = stringValue.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (normalDateMatch) {
    return createLocalDateString(
      Number(normalDateMatch[1]),
      Number(normalDateMatch[2]),
      Number(normalDateMatch[3]),
    );
  }

  const parsedDate = new Date(stringValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return createLocalDateString(
    parsedDate.getFullYear(),
    parsedDate.getMonth() + 1,
    parsedDate.getDate(),
  );
}

/**
 * Mengubah nilai cashback yang belum diketahui
 * tipenya menjadi string[].
 *
 * Penggunaan unknown diperlukan karena TypeScript
 * tidak selalu dapat mempersempit FieldPathValue
 * pada komponen generic.
 */
function normalizeCashbackValues(value: unknown, separator: string): string[] {
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

/**
 * Mengubah nilai field menjadi teks
 * yang ditampilkan pada input.
 */
function getCashbackDisplayValue(value: unknown, separator: string): string {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .join(`${separator} `);
  }

  if (typeof value === "string") {
    return value;
  }

  return "";
}

export default function InputKodeCashback<TFieldValues extends FieldValues>({
  name,
  startDateName,
  endDateName,
  placeholder = "Kode Cashback",
  disabled = false,
  multiple = false,
  appendOnSelect = true,
  separator = ",",
  updatePeriodOnSelect = true,
  allowManualInput = true,
  className,
  inputClassName,
  onValueChange,
  onCashbackSelect,
}: InputKodeCashbackProps<TFieldValues>) {
  const [showModal, setShowModal] = useState(false);

  const { control, getValues, setValue } = useFormContext<TFieldValues>();

  const handleOpenModal = () => {
    if (disabled) {
      return;
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const updateDateField = (
    fieldName: StringFieldName<TFieldValues> | undefined,
    dateValue: DateInput,
  ) => {
    if (!fieldName) {
      return;
    }

    const formattedDate = formatDate(dateValue);

    setValue(
      fieldName,
      formattedDate as FieldPathValue<TFieldValues, typeof fieldName>,
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      },
    );
  };

  const handleSelect = (row: DaftarCashbackRows) => {
    const selectedCode = String(row.cbh_kodepromosi ?? "").trim();

    if (!selectedCode) {
      return;
    }

    /**
     * Ubah menjadi unknown agar TypeScript dapat
     * melakukan narrowing tanpa menghasilkan never.
     */
    const rawCurrentValue: unknown = getValues(name);

    let nextValue: string | string[];

    if (!multiple) {
      nextValue = selectedCode;
    } else {
      const currentValues = normalizeCashbackValues(rawCurrentValue, separator);

      nextValue = appendOnSelect
        ? Array.from(new Set([...currentValues, selectedCode]))
        : [selectedCode];
    }

    setValue(name, nextValue as FieldPathValue<TFieldValues, typeof name>, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    onValueChange?.(nextValue);

    if (updatePeriodOnSelect) {
      updateDateField(startDateName, row.cbh_tglawal);

      updateDateField(endDateName, row.cbh_tglakhir);
    }

    onCashbackSelect?.(row);

    handleCloseModal();
  };

  return (
    <>
      <Controller<TFieldValues, CashbackFieldName<TFieldValues>>
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const rawFieldValue: unknown = field.value;

          const displayValue = getCashbackDisplayValue(
            rawFieldValue,
            separator,
          );

          const handleManualChange = (event: ChangeEvent<HTMLInputElement>) => {
            const inputValue = event.target.value;

            /**
             * Input manual disimpan sebagai string.
             *
             * Ketika pengguna memilih dari modal
             * dengan multiple=true, nilainya dapat
             * berubah menjadi string[].
             */
            field.onChange(inputValue);

            onValueChange?.(inputValue);
          };

          return (
            <div className={cn("relative w-full", className)}>
              <Input
                ref={field.ref}
                name={field.name}
                value={displayValue}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={!allowManualInput}
                aria-invalid={Boolean(fieldState.error)}
                className={cn(
                  "pr-10",
                  fieldState.error &&
                    "border-destructive focus-visible:ring-destructive",
                  inputClassName,
                )}
                onBlur={field.onBlur}
                onChange={handleManualChange}
              />

              <button
                type="button"
                aria-label="Cari kode cashback"
                title="Cari kode cashback"
                disabled={disabled}
                onClick={handleOpenModal}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2",
                  "text-muted-foreground transition-colors",
                  disabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:text-foreground",
                )}>
                <Search className="h-4 w-4" />
              </button>
            </div>
          );
        }}
      />

      <InputCashbackModal
        show={showModal}
        onClose={handleCloseModal}
        onSelect={handleSelect}
      />
    </>
  );
}
