// src/components/form/shared/SelectKategoriMember.tsx

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import { DependentSelectWrapper } from "@/components/DependentSelectWrapper";

export interface KategoriMember {
  grp_idgroupkat: string;
  grp_group: string;
  grp_kategori: string;
  grp_subkategori: string;
}

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

interface SelectKategoriMemberProps<TFieldValues extends FieldValues> {
  /**
   * Control dari React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Nama field untuk menyimpan ID kategori member.
   *
   * Contoh:
   * name="katMember"
   */
  name: StringFieldName<TFieldValues>;

  /**
   * Placeholder select.
   *
   * @default "All Kategori"
   */
  placeholder?: string;

  /**
   * Endpoint pengambilan kategori member.
   *
   * @default "/select-kategori-member"
   */
  endpoint?: string;
}

const getGroupKey = (item: KategoriMember): string => {
  return `${item.grp_group} - ${item.grp_kategori}`;
};

const getOption = (item: KategoriMember) => ({
  label: item.grp_subkategori,
  value: item.grp_idgroupkat,
});

export function SelectKategoriMember<TFieldValues extends FieldValues>({
  control,
  name,
  placeholder = "All Kategori",
  endpoint = "/select-kategori-member",
}: SelectKategoriMemberProps<TFieldValues>) {
  return (
    <DependentSelectWrapper<KategoriMember, TFieldValues>
      control={control}
      name={name}
      endpoint={endpoint}
      labelAll={placeholder}
      placeholder={placeholder}
      getGroupKey={getGroupKey}
      getOption={getOption}
      enableSearch
      sortGroups
      sortOptions
    />
  );
}

export default SelectKategoriMember;
