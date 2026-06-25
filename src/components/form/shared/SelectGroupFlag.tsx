// src/components/form/shared/SelectGroupFlag.tsx

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import { DependentSelectWrapper } from "@/components/DependentSelectWrapper";

export interface Flag {
  flag: string;
}

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

export interface SelectGroupFlagProps<TFieldValues extends FieldValues> {
  /**
   * Control dari React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Nama field yang menyimpan kode Flag.
   *
   * Field wajib bertipe string atau string | undefined.
   */
  name: StringFieldName<TFieldValues>;

  /**
   * Label untuk pilihan semua flag.
   *
   * @default "All Flag"
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
   * @default "/select-group-flag"
   */
  endpoint?: string;

  /**
   * Data Flag yang disediakan secara statis.
   *
   * Jika diberikan, request endpoint tidak dijalankan.
   */
  staticData?: Flag[];

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

const getFlagOption = (flag: Flag) => ({
  label: `${flag.flag}`,
  value: flag.flag,
});

export default function SelectGroupFlag<TFieldValues extends FieldValues>({
  control,
  name,
  labelAll = "All Flag",
  placeholder,
  endpoint = "/select-group-flag",
  staticData,
  disabled = false,
  enableSearch = true,
  sortOptions = true,
}: SelectGroupFlagProps<TFieldValues>) {
  const resolvedEndpoint = staticData !== undefined ? undefined : endpoint;

  return (
    <DependentSelectWrapper<Flag, TFieldValues>
      control={control}
      name={name}
      endpoint={resolvedEndpoint}
      staticData={staticData}
      labelAll={labelAll}
      placeholder={placeholder ?? labelAll}
      disabled={disabled}
      getOption={getFlagOption}
      enableSearch={enableSearch}
      sortOptions={sortOptions}
    />
  );
}
