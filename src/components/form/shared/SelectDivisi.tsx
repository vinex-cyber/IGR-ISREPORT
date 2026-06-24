// src/components/form/shared/SelectDivisi.tsx

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import { DependentSelectWrapper } from "@/components/DependentSelectWrapper";

export interface Divisi {
  div_kodedivisi: string;
  div_namadivisi: string;
}

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

export interface SelectDivisiProps<TFieldValues extends FieldValues> {
  /**
   * Control dari React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Nama field yang menyimpan kode divisi.
   *
   * Field wajib bertipe string atau string | undefined.
   */
  name: StringFieldName<TFieldValues>;

  /**
   * Label untuk pilihan semua divisi.
   *
   * @default "All Divisi"
   */
  labelAll?: string;

  /**
   * Placeholder yang tampil pada select.
   *
   * @default mengikuti labelAll
   */
  placeholder?: string;

  /**
   * Endpoint API daftar divisi.
   *
   * @default "/select-divisi"
   */
  endpoint?: string;

  /**
   * Data divisi statis.
   *
   * Jika diberikan, request endpoint tidak dijalankan.
   */
  staticData?: Divisi[];

  /**
   * Menonaktifkan select.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Mengaktifkan pencarian.
   *
   * @default true
   */
  enableSearch?: boolean;

  /**
   * Mengurutkan pilihan.
   *@example
   * [
   *   { label: "A", value: "A" },
   *   { label: "B", value: "B" },
   ]
   * @default true
   */
  sortOptions?: boolean;
}

const getDivisiOption = (divisi: Divisi) => ({
  label: `${divisi.div_kodedivisi} - ${divisi.div_namadivisi}`,
  value: divisi.div_kodedivisi,
});

export default function SelectDivisi<TFieldValues extends FieldValues>({
  control,
  name,
  labelAll = "All Divisi",
  placeholder,
  endpoint = "/select-divisi",
  staticData,
  disabled = false,
  enableSearch = true,
  sortOptions = true,
}: SelectDivisiProps<TFieldValues>) {
  const resolvedEndpoint = staticData !== undefined ? undefined : endpoint;

  return (
    <DependentSelectWrapper<Divisi, TFieldValues>
      control={control}
      name={name}
      endpoint={resolvedEndpoint}
      staticData={staticData}
      labelAll={labelAll}
      placeholder={placeholder ?? labelAll}
      disabled={disabled}
      getOption={getDivisiOption}
      enableSearch={enableSearch}
      sortOptions={sortOptions}
    />
  );
}
