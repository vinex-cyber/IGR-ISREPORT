// src/components/input/InputKodeGift.tsx

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
import InputGiftModal from "@/components/modal/InputGiftModal";

import { cn } from "@/lib/utils";

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

type GiftFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | string[] | undefined
>;

type DateInput = string | Date | null | undefined;

/**
 * Bentuk data yang dikirim oleh InputGiftModal
 * ketika pengguna memilih gift.
 */
export interface GiftSelection {
  code: string;
  startDate?: DateInput;
  endDate?: DateInput;
}

export interface InputKodeGiftProps<TFieldValues extends FieldValues> {
  /**
   * Field kode gift.
   *
   * Mendukung string maupun string[].
   */
  name: GiftFieldName<TFieldValues>;

  /**
   * Field branch/database.
   */
  branchName: StringFieldName<TFieldValues>;

  /**
   * Field tanggal awal.
   */
  startDateName?: StringFieldName<TFieldValues>;

  /**
   * Field tanggal akhir.
   */
  endDateName?: StringFieldName<TFieldValues>;

  /**
   * Placeholder input.
   *
   * @default "Kode Gift"
   */
  placeholder?: string;

  /**
   * Menonaktifkan input dan tombol pencarian.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Menyimpan banyak kode gift sebagai string[].
   *
   * @default false
   */
  multiple?: boolean;

  /**
   * Menambahkan gift baru ke nilai sebelumnya.
   *
   * Hanya digunakan ketika multiple=true.
   *
   * @default true
   */
  appendOnSelect?: boolean;

  /**
   * Pemisah kode gift.
   *
   * @default ","
   */
  separator?: string;

  /**
   * Memperbarui periode berdasarkan gift terpilih.
   *
   * @default true
   */
  updatePeriodOnSelect?: boolean;

  /**
   * Mengizinkan input manual.
   *
   * @default true
   */
  allowManualInput?: boolean;

  /**
   * Class pembungkus input.
   */
  className?: string;

  /**
   * Class tambahan untuk input.
   */
  inputClassName?: string;

  /**
   * Callback setelah nilai gift berubah.
   */
  onValueChange?: (value: string | string[]) => void;

  /**
   * Callback setelah gift dipilih dari modal.
   */
  onGiftSelect?: (gift: GiftSelection) => void;
}

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
 * Mengubah tanggal menjadi YYYY-MM-DD
 * tanpa menggeser tanggal karena UTC.
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
 * Mengubah nilai generic menjadi string[].
 *
 * unknown digunakan agar TypeScript tidak
 * menghasilkan tipe never saat memakai trim/split.
 */
function normalizeGiftValues(value: unknown, separator: string): string[] {
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

function getGiftDisplayValue(value: unknown, separator: string): string {
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

export default function InputKodeGift<TFieldValues extends FieldValues>({
  name,
  branchName,
  startDateName,
  endDateName,
  placeholder = "Kode Gift",
  disabled = false,
  multiple = false,
  appendOnSelect = true,
  separator = ",",
  updatePeriodOnSelect = true,
  allowManualInput = true,
  className,
  inputClassName,
  onValueChange,
  onGiftSelect,
}: InputKodeGiftProps<TFieldValues>) {
  const [showModal, setShowModal] = useState(false);

  const { control, watch, getValues, setValue } =
    useFormContext<TFieldValues>();

  const rawBranchValue = watch(branchName);

  const branch = typeof rawBranchValue === "string" ? rawBranchValue : "";

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

    setValue(
      fieldName,
      formatDate(dateValue) as FieldPathValue<TFieldValues, typeof fieldName>,
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      },
    );
  };

  const handleSelect = (gift: GiftSelection) => {
    const selectedCode = gift.code.trim();

    if (!selectedCode) {
      return;
    }

    const rawCurrentValue: unknown = getValues(name);

    let nextValue: string | string[];

    if (!multiple) {
      nextValue = selectedCode;
    } else {
      const currentValues = normalizeGiftValues(rawCurrentValue, separator);

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
      updateDateField(startDateName, gift.startDate);

      updateDateField(endDateName, gift.endDate);
    }

    onGiftSelect?.(gift);

    handleCloseModal();
  };

  return (
    <>
      <Controller<TFieldValues, GiftFieldName<TFieldValues>>
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const rawFieldValue: unknown = field.value;

          const displayValue = getGiftDisplayValue(rawFieldValue, separator);

          const handleManualChange = (event: ChangeEvent<HTMLInputElement>) => {
            const inputValue = event.target.value;

            const nextValue: string | string[] = multiple
              ? normalizeGiftValues(inputValue, separator)
              : inputValue;

            field.onChange(nextValue);
            onValueChange?.(nextValue);
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
                aria-label="Cari kode gift"
                title="Cari kode gift"
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

      <InputGiftModal
        show={showModal}
        branch={branch}
        onClose={handleCloseModal}
        onSelect={handleSelect}
      />
    </>
  );
}
