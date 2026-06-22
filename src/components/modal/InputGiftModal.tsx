// src/components/modal/InputGiftModal.tsx

import {
  daftarGiftColumns,
  type DaftarGiftRows,
} from "@/configs/input/daftar-giftConfig";

import {
  useFormContext,
  type FieldPathByValue,
  type FieldPathValue,
  type FieldValues,
} from "react-hook-form";

import { GenericLookupModal } from "./GenericLookupModal";

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

interface InputGiftModalProps<TFieldValues extends FieldValues> {
  show: boolean;
  onClose: () => void;

  /**
   * Field untuk menyimpan kode gift.
   *
   * Contoh: "kodeGift"
   */
  name: StringFieldName<TFieldValues>;

  /**
   * Field database/branch.
   *
   * Contoh: "branch"
   */
  branchName: StringFieldName<TFieldValues>;

  /**
   * Field tanggal awal.
   * Opsional, boleh tidak diberikan.
   *
   * Contoh: "startDate"
   */
  startDateName?: StringFieldName<TFieldValues>;

  /**
   * Field tanggal akhir.
   * Opsional, boleh tidak diberikan.
   *
   * Contoh: "endDate"
   */
  endDateName?: StringFieldName<TFieldValues>;
}

function formatDate(value: string | Date | null | undefined): string {
  if (!value) {
    return "";
  }

  const stringValue = value.toString();

  // Format 20260401 menjadi 2026-04-01
  if (/^\d{8}$/.test(stringValue)) {
    return `${stringValue.slice(0, 4)}-${stringValue.slice(
      4,
      6,
    )}-${stringValue.slice(6, 8)}`;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function InputGiftModal<TFieldValues extends FieldValues>({
  show,
  onClose,
  name,
  branchName,
  startDateName,
  endDateName,
}: InputGiftModalProps<TFieldValues>) {
  const { setValue, watch } = useFormContext<TFieldValues>();

  const branchValue = watch(branchName);

  const branch = typeof branchValue === "string" ? branchValue : "";

  const setStringValue = <TName extends StringFieldName<TFieldValues>>(
    fieldName: TName,
    value: string,
  ) => {
    setValue(fieldName, value as FieldPathValue<TFieldValues, TName>, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleSelect = (row: DaftarGiftRows) => {
    setStringValue(name, row.gfh_kodepromosi);

    if (startDateName) {
      setStringValue(startDateName, formatDate(row.gfh_tglawal));
    }

    if (endDateName) {
      setStringValue(endDateName, formatDate(row.gfh_tglakhir));
    }

    onClose();
  };

  return (
    <GenericLookupModal<DaftarGiftRows>
      show={show}
      onClose={onClose}
      endpoint={`/api/daftar-gift?branch=${encodeURIComponent(branch)}`}
      columns={daftarGiftColumns}
      title="Pilih Kode Gift"
      onSelect={handleSelect}
    />
  );
}
