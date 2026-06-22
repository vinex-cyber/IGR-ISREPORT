// src/components/input/InputKodeCashback.tsx

import { useState } from "react";
import { Search } from "lucide-react";

import {
  useFormContext,
  type FieldPathByValue,
  type FieldPathValue,
  type FieldValues,
} from "react-hook-form";

import FormInput from "@/components/FormInput";
import InputCashbackModal from "@/components/modal/InputCashbackModal";

import type { DaftarCashbackRows } from "@/configs/input/daftar-cashbackConfig";

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

type CashbackFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | string[] | undefined
>;

interface InputKodeCashbackProps<TFieldValues extends FieldValues> {
  name: CashbackFieldName<TFieldValues>;
  branchName: StringFieldName<TFieldValues>;
  startDateName?: StringFieldName<TFieldValues>;
  endDateName?: StringFieldName<TFieldValues>;
  placeholder?: string;
}

function formatDate(value: string | Date | null | undefined): string {
  if (!value) {
    return "";
  }

  const stringValue = value.toString();

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

export default function InputKodeCashback<TFieldValues extends FieldValues>({
  name,
  branchName,
  startDateName,
  endDateName,
  placeholder = "Kode Cashback",
}: InputKodeCashbackProps<TFieldValues>) {
  const [show, setShow] = useState(false);

  const { watch, setValue } = useFormContext<TFieldValues>();

  const branchValue = watch(branchName);

  const branch = typeof branchValue === "string" ? branchValue : "";

  const handleOpen = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleSelect = (row: DaftarCashbackRows) => {
    setValue(
      name,
      row.cbh_kodepromosi as FieldPathValue<TFieldValues, typeof name>,
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      },
    );

    if (startDateName) {
      setValue(
        startDateName,
        formatDate(row.cbh_tglawal) as FieldPathValue<
          TFieldValues,
          typeof startDateName
        >,
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );
    }

    if (endDateName) {
      setValue(
        endDateName,
        formatDate(row.cbh_tglakhir) as FieldPathValue<
          TFieldValues,
          typeof endDateName
        >,
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );
    }

    handleClose();
  };

  return (
    <>
      <FormInput
        name={name}
        placeholder={placeholder}
        iconRight={<Search className="h-4 w-4" />}
        onIconClick={handleOpen}
      />

      <InputCashbackModal
        show={show}
        onClose={handleClose}
        branch={branch}
        onSelect={handleSelect}
      />
    </>
  );
}
