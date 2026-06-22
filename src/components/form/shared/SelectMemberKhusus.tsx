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

interface SelectMemberKhususProps<
  TFieldValues extends FieldValues,
  TName extends StringFieldName<TFieldValues>,
> {
  /**
   * Control dari React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Nama field yang menyimpan pilihan member.
   *
   * Contoh:
   * name="memberKhusus"
   */
  name: TName;

  /**
   * Placeholder select.
   *
   * @default "All Member"
   */
  placeholder?: string;
}

export default function SelectMemberKhusus<
  TFieldValues extends FieldValues,
  TName extends StringFieldName<TFieldValues>,
>({
  control,
  name,
  placeholder = "All Member",
}: SelectMemberKhususProps<TFieldValues, TName>) {
  return (
    <Controller<TFieldValues, TName>
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
          />
        );
      }}
    />
  );
}
