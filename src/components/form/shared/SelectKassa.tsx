// src/components/form/shared/SelectKassa.tsx

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

interface SelectKassaProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;

  /**
   * Nama field form yang menyimpan pilihan jenis kassa.
   *
   * Contoh:
   * name="kasirType"
   */
  name: StringFieldName<TFieldValues>;

  placeholder?: string;
  disabled?: boolean;
}

const kassaOptions = [
  {
    label: "All Kassa",
    value: "__all__",
  },
  {
    label: "Non Kss",
    value: "non-kss",
  },
  {
    label: "Only Kss",
    value: "only-kss",
  },
];

const SelectKassa = <TFieldValues extends FieldValues>({
  control,
  name,
  placeholder = "All Kassa",
  disabled = false,
}: SelectKassaProps<TFieldValues>) => {
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
            options={kassaOptions}
            placeholder={placeholder}
            disabled={disabled}
          />
        );
      }}
    />
  );
};

export default SelectKassa;
