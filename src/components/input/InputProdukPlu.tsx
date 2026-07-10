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

  const formatPrdcdGrup = (value: string) => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "")
      .map((item) => {
        let formatted = item.padStart(7, "0");

        if (formatted[6] !== "0") {
          formatted = `${formatted.slice(0, 6)}0`;
        }

        return formatted;
      })
      .join(",");
  };

  const handleBlur = () => {
    const currentValue = getValues(name);

    const formatted = formatPrdcdGrup(String(currentValue ?? ""));

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
