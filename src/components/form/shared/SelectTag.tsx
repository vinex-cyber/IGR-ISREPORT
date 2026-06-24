// src/components/form/shared/SelectTag.tsx

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import { DependentSelectWrapper } from "@/components/DependentSelectWrapper";

export interface Tag {
  tag_kodetag: string;
  tag_keterangan: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

export interface SelectTagProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: StringFieldName<TFieldValues>;
  labelAll?: string;
  placeholder?: string;
  endpoint?: string;
  staticData?: Tag[];
  disabled?: boolean;
  enableSearch?: boolean;
  sortOptions?: boolean;
}

const getTagOption = (tag: Tag): SelectOption => {
  const kodeTag = tag.tag_kodetag?.trim();
  const keterangan = tag.tag_keterangan?.trim();

  return {
    label:
      kodeTag && keterangan
        ? `${kodeTag} - ${keterangan}`
        : kodeTag || keterangan || "-",
    value: kodeTag,
  };
};

export default function SelectTag<TFieldValues extends FieldValues>({
  control,
  name,
  labelAll = "All Tag",
  placeholder,
  endpoint = "/select-tag",
  staticData,
  disabled = false,
  enableSearch = true,
  sortOptions = true,
}: SelectTagProps<TFieldValues>) {
  const resolvedEndpoint = staticData !== undefined ? undefined : endpoint;

  const resolvedPlaceholder = placeholder ?? labelAll;

  return (
    <DependentSelectWrapper<Tag, TFieldValues>
      control={control}
      name={name}
      endpoint={resolvedEndpoint}
      staticData={staticData}
      labelAll={labelAll}
      placeholder={resolvedPlaceholder}
      disabled={disabled}
      getOption={getTagOption}
      enableSearch={enableSearch}
      sortOptions={sortOptions}
    />
  );
}
