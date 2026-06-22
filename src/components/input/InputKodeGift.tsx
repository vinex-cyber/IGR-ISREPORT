// src/components/input/InputKodeGift.tsx

import { useState } from "react";
import { Search } from "lucide-react";

import type { FieldPathByValue, FieldValues } from "react-hook-form";

import FormInput from "../FormInput";
import InputGiftModal from "../modal/InputGiftModal";

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

interface InputKodeGiftProps<TFieldValues extends FieldValues> {
  /**
   * Field kode gift.
   *
   * Contoh: "kodeGift"
   */
  name: StringFieldName<TFieldValues>;

  /**
   * Field database.
   *
   * Contoh: "branch"
   */
  branchName: StringFieldName<TFieldValues>;

  /**
   * Field tanggal awal yang akan diisi
   * berdasarkan periode gift.
   */
  startDateName?: StringFieldName<TFieldValues>;

  /**
   * Field tanggal akhir yang akan diisi
   * berdasarkan periode gift.
   */
  endDateName?: StringFieldName<TFieldValues>;

  placeholder?: string;
}

export default function InputKodeGift<TFieldValues extends FieldValues>({
  name,
  branchName,
  startDateName,
  endDateName,
  placeholder = "Kode Gift",
}: InputKodeGiftProps<TFieldValues>) {
  const [show, setShow] = useState(false);

  const handleOpen = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <FormInput
        name={name}
        placeholder={placeholder}
        iconRight={<Search className="h-4 w-4" />}
        onIconClick={handleOpen}
      />

      <InputGiftModal<TFieldValues>
        show={show}
        onClose={handleClose}
        name={name}
        branchName={branchName}
        startDateName={startDateName}
        endDateName={endDateName}
      />
    </>
  );
}
