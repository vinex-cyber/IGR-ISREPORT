// src/components/form/shared/SelectOutletMember.tsx

import { useMemo } from "react";

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import SelectTypeWrapper from "@/components/SelectTypeWrapper";
import { useFetchData } from "@/hooks/data/useFetchData";

interface OutletMember {
  out_kodeoutlet: string;
  out_namaoutlet: string;
}

interface OutletOption {
  label: string;
  value: string;
}

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

interface SelectOutletMemberProps<TFieldValues extends FieldValues> {
  /**
   * Control dari React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Field form untuk menyimpan kode outlet.
   *
   * Field harus bertipe string atau string | undefined.
   */
  name: StringFieldName<TFieldValues>;

  /**
   * Teks pilihan semua outlet.
   *
   * @default "All Outlet"
   */
  placeholder?: string;

  /**
   * Endpoint daftar outlet.
   *
   * @default "/select-outlet-member"
   */
  endpoint?: string;

  /**
   * Menonaktifkan select.
   *
   * @default false
   */
  disabled?: boolean;
}

export default function SelectOutletMember<TFieldValues extends FieldValues>({
  control,
  name,
  placeholder = "All Outlet",
  endpoint = "/select-outlet-member",
  disabled = false,
}: SelectOutletMemberProps<TFieldValues>) {
  const { data, error, loading } = useFetchData<OutletMember[]>({
    endpoint,
  });

  const options = useMemo<OutletOption[]>(() => {
    const allOutletOption: OutletOption = {
      label: placeholder,
      value: "__ALL__",
    };

    if (!data || data.length === 0) {
      return [allOutletOption];
    }

    return [
      allOutletOption,
      ...data.map((outlet) => ({
        label: `${outlet.out_kodeoutlet} - ${outlet.out_namaoutlet}`,
        value: outlet.out_kodeoutlet,
      })),
    ];
  }, [data, placeholder]);

  return (
    <SelectTypeWrapper<TFieldValues>
      control={control}
      name={name}
      data={options}
      loading={loading}
      error={Boolean(error)}
      placeholder={placeholder}
      disabled={disabled}
      valueKeyTransform={(value) => (value === "__ALL__" ? "" : value)}
      enableSearch
    />
  );
}
