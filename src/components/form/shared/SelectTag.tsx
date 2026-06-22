// src/components/form/shared/SelectTag.tsx

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import { DependentSelectWrapper } from "@/components/DependentSelectWrapper";

interface Tag {
  tag_kodetag: string;
  tag_keterangan: string;
}

interface SelectTagProps<TFieldValues extends FieldValues> {
  /**
   * Control dari React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Nama field yang menyimpan kode tag.
   *
   * Contoh:
   * name="tag"
   */
  name: FieldPathByValue<TFieldValues, string | undefined>;

  /**
   * Teks yang ditampilkan saat belum ada tag dipilih.
   *
   * @default "All Tag"
   */
  placeholder?: string;
}

interface SelectOption {
  label: string;
  value: string;
}

const getOption = (tag: Tag): SelectOption => ({
  label: `${tag.tag_kodetag} - ${tag.tag_keterangan}`,
  value: tag.tag_kodetag,
});

export default function SelectTag<TFieldValues extends FieldValues>({
  control,
  name,
  placeholder = "All Tag",
}: SelectTagProps<TFieldValues>) {
  return (
    <DependentSelectWrapper<Tag, TFieldValues>
      control={control}
      name={name}
      endpoint="/select-tag"
      labelAll={placeholder}
      placeholder={placeholder}
      getOption={getOption}
      enableSearch
      sortOptions
    />
  );
}
