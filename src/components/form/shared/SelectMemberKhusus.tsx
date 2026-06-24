// src/components/form/shared/SelectMemberKhusus.tsx

import {
  Controller,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import SelectType from "@/components/SelectType";

interface MemberOption {
  label: string;
  value: string;
}

const MEMBER_OPTIONS: MemberOption[] = [
  {
    label: "All Member",
    value: "__all__",
  },
  {
    label: "Member Biru",
    value: "N",
  },
  {
    label: "Member Merah",
    value: "Y",
  },
];

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

interface SelectMemberKhususProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;

  name: StringFieldName<TFieldValues>;

  placeholder?: string;

  disabled?: boolean;
}

export default function SelectMemberKhusus<TFieldValues extends FieldValues>({
  control,
  name,
  placeholder = "All Member",
  disabled = false,
}: SelectMemberKhususProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValue =
          typeof field.value === "string" && field.value !== ""
            ? field.value
            : "__all__";

        return (
          <SelectType
            value={selectedValue}
            onChange={(value: string) => {
              field.onChange(value === "__all__" ? "" : value);
            }}
            options={MEMBER_OPTIONS}
            placeholder={placeholder}
            disabled={disabled}
          />
        );
      }}
    />
  );
}
