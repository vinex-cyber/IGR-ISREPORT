// src/components/form/shared/SelectMethode.tsx

import {
  Controller,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import SelectType from "@/components/SelectType";

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

interface SelectMethodeProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;

  /**
   * Nama field yang menyimpan jenis metode.
   *
   * Contoh:
   * name="methodType"
   */
  name: StringFieldName<TFieldValues>;

  placeholder?: string;
  disabled?: boolean;
}

const methodeOptions = [
  {
    label: "All Methode",
    value: "__all__",
  },
  {
    label: "Kum Mandiri",
    value: "kum",
  },
  {
    label: "Virtual",
    value: "virtual",
  },
];

const SelectMethode = <TFieldValues extends FieldValues>({
  control,
  name,
  placeholder = "All Methode",
  disabled = false,
}: SelectMethodeProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValue =
          typeof field.value === "string" && field.value
            ? field.value
            : "__all__";

        return (
          <SelectType
            value={selectedValue}
            onChange={(value) => {
              field.onChange(value === "__all__" ? "" : value);
            }}
            options={methodeOptions}
            placeholder={placeholder}
            disabled={disabled}
          />
        );
      }}
    />
  );
};

export default SelectMethode;
