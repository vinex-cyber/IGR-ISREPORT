// src/components/form/evaluasisales/SelectDivisi.tsx

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import { DependentSelectWrapper } from "@/components/DependentSelectWrapper";

interface Divisi {
  div_kodedivisi: string;
  div_namadivisi: string;
}

interface SelectDivisiProps<TFieldValues extends FieldValues> {
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
   * name="div"
   */
  name: FieldPathByValue<TFieldValues, string | undefined>;

  /**
   * Teks ketika belum ada divisi yang dipilih.
   *
   * @default "All Divisi"
   */
  placeholder?: string;
}

export default function SelectDivisi<TFieldValues extends FieldValues>({
  control,
  name,
  placeholder = "All Divisi",
}: SelectDivisiProps<TFieldValues>) {
  return (
    <DependentSelectWrapper<Divisi, TFieldValues>
      control={control}
      name={name}
      endpoint="/select-divisi"
      labelAll={placeholder}
      placeholder={placeholder}
      getOption={(divisi) => ({
        label: `${divisi.div_kodedivisi} - ${divisi.div_namadivisi}`,
        value: divisi.div_kodedivisi,
      })}
      enableSearch
    />
  );
}
