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

export interface SelectKategoriMemberProps<TFieldValues extends FieldValues> {
  /**
   * Control dari useForm React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Nama field form yang menyimpan grp_idgroupkat.
   *
   * Field harus bertipe string atau string | undefined.
   *
   * @example
   * name="katMember"
   */
  name: StringFieldName<TFieldValues>;

  /**
   * Label pilihan untuk menampilkan semua kategori.
   *
   * @default "All Kategori"
   */
  labelAll?: string;

  /**
   * Placeholder select.
   *
   * @default mengikuti labelAll
   */
  placeholder?: string;

  /**
   * Endpoint API tanpa awalan /api.
   *
   * @default "/select-kategori-member"
   */
  endpoint?: string;

  /**
   * Data kategori statis.
   *
   * Ketika staticData diisi dan endpoint dikosongkan,
   * komponen tidak melakukan fetch API.
   */
  staticData?: KategoriMember[];

  /**
   * Menonaktifkan select.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Mengaktifkan pencarian di dalam select.
   *
   * @default true
   */
  enableSearch?: boolean;

  /**
   * Mengurutkan group.
   *
   * @default true
   */
  sortGroups?: boolean;

  /**
   * Mengurutkan pilihan dalam setiap group.
   *
   * @default true
   */
  sortOptions?: boolean;
}

const getKategoriMemberGroup = (item: KategoriMember): string => {
  const group = item.grp_group?.trim();
  const kategori = item.grp_kategori?.trim();

  if (group && kategori) {
    return `${group} - ${kategori}`;
  }

  return group || kategori || "Lainnya";
};

const getKategoriMemberOption = (item: KategoriMember) => ({
  label: item.grp_subkategori?.trim() || item.grp_idgroupkat,
  value: item.grp_idgroupkat,
});

export function SelectKategoriMember<TFieldValues extends FieldValues>({
  control,
  name,
  labelAll = "All Kategori",
  placeholder,
  endpoint = "/select-kategori-member",
  staticData,
  disabled = false,
  enableSearch = true,
  sortGroups = true,
  sortOptions = true,
}: SelectKategoriMemberProps<TFieldValues>) {
  /*
   * Jika staticData diberikan, endpoint dikosongkan agar
   * DependentSelectWrapper menggunakan data statis.
   */
  const resolvedEndpoint = staticData !== undefined ? undefined : endpoint;

  const resolvedPlaceholder = placeholder ?? labelAll;

  return (
    <DependentSelectWrapper<KategoriMember, TFieldValues>
      control={control}
      name={name}
      endpoint={resolvedEndpoint}
      staticData={staticData}
      labelAll={labelAll}
      placeholder={resolvedPlaceholder}
      disabled={disabled}
      getGroupKey={getKategoriMemberGroup}
      getOption={getKategoriMemberOption}
      enableSearch={enableSearch}
      sortGroups={sortGroups}
      sortOptions={sortOptions}
    />
  );
}

export default SelectKategoriMember;
