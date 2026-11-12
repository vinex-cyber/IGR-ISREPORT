// src/components/input/InputProdukPlu.tsx

import { useState } from "react";
import {
  useFormContext,
  type FieldPathByValue,
  type FieldPathValue,
  type FieldValues,
} from "react-hook-form";
import { Search } from "lucide-react";

import FormInput from "../FormInput";
import InputProdukModal from "../modal/InputProdukModal";
import type { DaftarProdukRows } from "@/configs/input/daftar-produkConfig";
import { formatPlu } from "@/utils/formatPlu";

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

interface InputProdukPluProps<TFieldValues extends FieldValues> {
  name: StringFieldName<TFieldValues>;
  className?: string;
  placeholder?: string;
  disabled?: boolean;

  /** Boleh memilih lebih dari satu PLU (dipisah `separator`). */
  multiple?: boolean;

  /** Tambahkan PLU baru ke nilai sebelumnya (hanya saat `multiple`). */
  appendOnSelect?: boolean;

  /** Pemisah antar PLU. @default "," */
  separator?: string;

  /** Izinkan ketik manual. @default true */
  allowManualInput?: boolean;
}

const InputProdukPlu = <TFieldValues extends FieldValues>({
  name,
  placeholder = "Input PLU",
  disabled = false,
  multiple = false,
  appendOnSelect = true,
  separator = ",",
  allowManualInput = true,
  className,
}: InputProdukPluProps<TFieldValues>) => {
  const [pluModal, setPluModal] = useState(false);

  const { setValue, getValues } = useFormContext<TFieldValues>();

  const handlePluModal = () => {
    if (disabled) return;

    setPluModal((previous) => !previous);
  };

  const toSeparator = (commas: string) =>
    separator === "," ? commas : commas.split(",").join(separator);

  const handleBlur = () => {
    const currentValue = String(getValues(name) ?? "");

    const withoutSeparator =
      separator === "," ? currentValue : currentValue.split(separator).join(",");

    const formatted = toSeparator(formatPlu(withoutSeparator));

    setValue(name, formatted as FieldPathValue<TFieldValues, typeof name>, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleSelectRow = (row: DaftarProdukRows) => {
    const selected = formatPlu(String(row.prd_prdcd ?? "").trim());

    if (!selected) return;

    if (!multiple) {
      setValue(name, selected as FieldPathValue<TFieldValues, typeof name>, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      return;
    }

    const current = String(getValues(name) ?? "")
      .split(separator)
      .map((item) => item.trim())
      .filter(Boolean);

    const next = appendOnSelect
      ? Array.from(new Set([...current, selected]))
      : [selected];

    setValue(name, next.join(separator) as FieldPathValue<TFieldValues, typeof name>, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <>
      <FormInput
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={!allowManualInput}
        iconRight={<Search className="h-4 w-4" />}
        onBlur={handleBlur}
        onIconClick={handlePluModal}
        className={className}
      />

      {!disabled && (
        <InputProdukModal
          show={pluModal}
          onClose={handlePluModal}
          onSelectRow={handleSelectRow}
        />
      )}
    </>
  );
};

export default InputProdukPlu;
