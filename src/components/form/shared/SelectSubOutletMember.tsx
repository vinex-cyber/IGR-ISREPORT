// src/components/form/shared/SelectSubOutletMember.tsx

import { useMemo } from "react";

import {
  useWatch,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import SelectTypeWrapper from "@/components/SelectTypeWrapper";
import { useFetchData } from "@/hooks/useFetchData";

interface SubOutletMember {
  sub_kodeoutlet: string;
  out_namaoutlet: string;
  sub_kodesuboutlet: string;
  sub_namasuboutlet: string;
}

interface SelectOption {
  label: string;
  value: string;
}

interface SelectOptionGroup {
  groupLabel: string;
  options: SelectOption[];
}

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

interface SelectSubOutletMemberProps<TFieldValues extends FieldValues> {
  /**
   * Control dari React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Field untuk menyimpan kode sub-outlet.
   *
   * Contoh:
   * name="subOutlet"
   */
  name: StringFieldName<TFieldValues>;

  /**
   * Field outlet yang menjadi parent.
   *
   * Contoh:
   * parentName="outlet"
   */
  parentName: StringFieldName<TFieldValues>;

  /**
   * Teks pilihan semua sub-outlet.
   *
   * @default "All Sub-Outlet"
   */
  placeholder?: string;

  /**
   * Endpoint daftar sub-outlet.
   *
   * @default "/select-suboutlet-member"
   */
  endpoint?: string;

  /**
   * Menonaktifkan select.
   *
   * @default false
   */
  disabled?: boolean;
}

export default function SelectSubOutletMember<
  TFieldValues extends FieldValues,
>({
  control,
  name,
  parentName,
  placeholder = "All Sub-Outlet",
  endpoint = "/select-suboutlet-member",
  disabled = false,
}: SelectSubOutletMemberProps<TFieldValues>) {
  const watchedOutlet = useWatch({
    control,
    name: parentName,
  });

  const selectedOutlet = typeof watchedOutlet === "string" ? watchedOutlet : "";

  const { data, error, loading } = useFetchData<SubOutletMember[]>({
    endpoint,

    queryParams: selectedOutlet
      ? {
          kodeoutlet: selectedOutlet,
        }
      : undefined,

    enabled: Boolean(endpoint) && !disabled,
  });

  const groupedOptions = useMemo<SelectOptionGroup[]>(() => {
    const defaultGroup: SelectOptionGroup = {
      groupLabel: "Umum",
      options: [
        {
          label: placeholder,
          value: "__all__",
        },
      ],
    };

    if (!data || data.length === 0) {
      return [defaultGroup];
    }

    const groupedData = data.reduce<Record<string, SubOutletMember[]>>(
      (result, item) => {
        if (!result[item.sub_kodeoutlet]) {
          result[item.sub_kodeoutlet] = [];
        }

        result[item.sub_kodeoutlet].push(item);

        return result;
      },
      {},
    );

    const groups: SelectOptionGroup[] = Object.entries(groupedData).map(
      ([kodeOutlet, subOutlets]) => ({
        groupLabel: `${kodeOutlet} - ${subOutlets[0]?.out_namaoutlet ?? ""}`,

        options: subOutlets.map((subOutlet) => ({
          label: `${subOutlet.sub_kodesuboutlet} - ${subOutlet.sub_namasuboutlet}`,
          value: subOutlet.sub_kodesuboutlet,
        })),
      }),
    );

    return [defaultGroup, ...groups];
  }, [data, placeholder]);

  return (
    <SelectTypeWrapper<TFieldValues>
      control={control}
      name={name}
      data={groupedOptions}
      loading={loading}
      error={Boolean(error)}
      placeholder={placeholder}
      disabled={disabled}
      valueKeyTransform={(value) => (value === "__all__" ? "" : value)}
      enableSearch
    />
  );
}
