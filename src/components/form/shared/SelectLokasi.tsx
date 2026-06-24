// src/components/form/shared/SelectLokasi.tsx

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import { DependentSelectWrapper } from "@/components/DependentSelectWrapper";

export interface Lokasi {
  st_lokasi: string;
  nama_lokasi: string;
}

export interface LokasiOption {
  label: string;
  value: string;
}

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

export interface SelectLokasiProps<TFieldValues extends FieldValues> {
  /**
   * Control milik React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Nama field yang menyimpan kode lokasi.
   *
   * Field harus bertipe string atau string | undefined.
   *
   * @example
   * name="lokasi"
   */
  name: StringFieldName<TFieldValues>;

  /**
   * Label pilihan semua lokasi.
   *
   * @default "All Lokasi"
   */
  labelAll?: string;

  /**
   * Placeholder select.
   *
   * Jika tidak diberikan, nilainya mengikuti labelAll.
   */
  placeholder?: string;

  /**
   * Endpoint API daftar lokasi.
   *
   * @default "/daftar-lokasi"
   */
  endpoint?: string;

  /**
   * Data statis sebagai pengganti endpoint API.
   *
   * Jika staticData diberikan, request API tidak dijalankan.
   */
  staticData?: Lokasi[];

  /**
   * Menonaktifkan select.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Mengaktifkan fitur pencarian.
   *
   * @default true
   */
  enableSearch?: boolean;

  /**
   * Mengurutkan pilihan lokasi.
   *
   * @default true
   */
  sortOptions?: boolean;
}

const getLokasiOption = (lokasi: Lokasi): LokasiOption => {
  const kodeLokasi = lokasi.st_lokasi?.trim();
  const namaLokasi = lokasi.nama_lokasi?.trim();

  return {
    label: namaLokasi || kodeLokasi || "Lokasi tidak diketahui",
    value: kodeLokasi,
  };
};

export default function SelectLokasi<TFieldValues extends FieldValues>({
  control,
  name,
  labelAll = "All Lokasi",
  placeholder,
  endpoint = "/daftar-lokasi",
  staticData,
  disabled = false,
  enableSearch = true,
  sortOptions = true,
}: SelectLokasiProps<TFieldValues>) {
  const resolvedEndpoint = staticData !== undefined ? undefined : endpoint;

  const resolvedPlaceholder = placeholder ?? labelAll;

  return (
    <DependentSelectWrapper<Lokasi, TFieldValues>
      control={control}
      name={name}
      endpoint={resolvedEndpoint}
      staticData={staticData}
      labelAll={labelAll}
      placeholder={resolvedPlaceholder}
      disabled={disabled}
      getOption={getLokasiOption}
      enableSearch={enableSearch}
      sortOptions={sortOptions}
    />
  );
}
