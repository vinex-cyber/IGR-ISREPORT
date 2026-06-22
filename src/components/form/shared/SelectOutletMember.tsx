// src/components/form/shared/SelectOutletMember.tsx

import { useMemo } from "react";

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import SelectTypeWrapper from "@/components/SelectTypeWrapper";
import { useFetchData } from "@/hooks/useFetchData";

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

interface SelectOutletMemberProps<
  TFieldValues extends FieldValues,
  TName extends StringFieldName<TFieldValues>,
> {
  /**
   * Control dari React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Nama field untuk menyimpan kode outlet.
   *
   * Contoh:
   * name="outlet"
   */
  name: TName;

  /**
   * Placeholder select.
   *
   * @default "All Outlet"
   */
  placeholder?: string;

  /**
   * Endpoint untuk mengambil daftar outlet.
   *
   * @default "/select-outlet-member"
   */
  endpoint?: string;
}

const ALL_OUTLET_OPTION: OutletOption = {
  label: "All Outlet",
  value: "__ALL__",
};

export default function SelectOutletMember<
  TFieldValues extends FieldValues,
  TName extends StringFieldName<TFieldValues>,
>({
  control,
  name,
  placeholder = "All Outlet",
  endpoint = "/select-outlet-member",
}: SelectOutletMemberProps<TFieldValues, TName>) {
  const { data, error, loading } = useFetchData<OutletMember[]>({
    endpoint,
  });

  const options = useMemo<OutletOption[]>(() => {
    if (!data || data.length === 0) {
      return [ALL_OUTLET_OPTION];
    }

    return [
      ALL_OUTLET_OPTION,
      ...data.map((outlet) => ({
        label: `${outlet.out_kodeoutlet} - ${outlet.out_namaoutlet}`,
        value: outlet.out_kodeoutlet,
      })),
    ];
  }, [data]);

  return (
    <SelectTypeWrapper<TFieldValues>
      control={control}
      name={name}
      data={options}
      loading={loading}
      error={Boolean(error)}
      placeholder={placeholder}
      valueKeyTransform={(value: string) => (value === "__ALL__" ? "" : value)}
    />
  );
}
