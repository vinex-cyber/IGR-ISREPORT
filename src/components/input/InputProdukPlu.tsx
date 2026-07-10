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
}

const InputProdukPlu = <TFieldValues extends FieldValues>({
  name,
  placeholder = "Input PLU",
  disabled = false,
  className,
}: InputProdukPluProps<TFieldValues>) => {
  const [pluModal, setPluModal] = useState(false);

  const { setValue, getValues } = useFormContext<TFieldValues>();

  const handlePluModal = () => {
    if (disabled) return;

    setPluModal((previous) => !previous);
  };

  const handleBlur = () => {
    const currentValue = getValues(name);

    const formatted = formatPlu(String(currentValue ?? ""));

    setValue(name, formatted as FieldPathValue<TFieldValues, typeof name>, {
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
        iconRight={<Search className="h-4 w-4" />}
        onBlur={handleBlur}
        onIconClick={handlePluModal}
        className={className}
      />

      {!disabled && (
        <InputProdukModal show={pluModal} onClose={handlePluModal} prdcd />
      )}
    </>
  );
};

export default InputProdukPlu;
