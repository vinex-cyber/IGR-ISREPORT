// src/components/form/evaluasisales/SelectDivisi.tsx

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import { DependentSelectWrapper } from "@/components/DependentSelectWrapper";

interface Lokasi {
  st_lokasi: string;
  nama_lokasi: string;
}

interface SelectLokasiProps<TFieldValues extends FieldValues> {
  /**
   * Control dari React Hook Form.
   *
   * @example
   * control={methods.control}
   */
  control: Control<TFieldValues>;

  /**
   * Nama field yang akan menyimpan kode divisi.
   *
   * Field harus bertipe string atau string | undefined.
   *
   * @example
   * name="lokasi"
   */
  name: FieldPathByValue<TFieldValues, string | undefined>;

  /**
   * Teks ketika belum ada divisi yang dipilih.
   *
   * @default "Barang Baik"
   */
  placeholder?: string;
}

export default function SelectLokasi<TFieldValues extends FieldValues>({
  control,
  name,
  placeholder = "All Lokasi",
}: SelectLokasiProps<TFieldValues>) {
  return (
    <DependentSelectWrapper<Lokasi, TFieldValues>
      control={control}
      name={name}
      endpoint="/daftar-lokasi"
      labelAll={placeholder}
      placeholder={placeholder}
      getOption={(lokasi) => ({
        label: `${lokasi.nama_lokasi}`,
        value: lokasi.st_lokasi,
      })}
      enableSearch
    />
  );
}
