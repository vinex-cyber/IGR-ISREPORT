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
  control: Control<TFieldValues>;

  /**
   * Field untuk menyimpan sub-outlet.
   *
   * Contoh: "subOutlet"
   */
  name: StringFieldName<TFieldValues>;

  /**
   * Field outlet sebagai parent.
   *
   * Contoh: "outlet"
   */
  parentName: StringFieldName<TFieldValues>;

  placeholder?: string;

  endpoint?: string;
}

const DEFAULT_GROUP: SelectOptionGroup = {
  groupLabel: "Umum",
  options: [
    {
      label: "All Sub-Outlet",
      value: "__all__",
    },
  ],
};

export default function SelectSubOutletMember<
  TFieldValues extends FieldValues,
>({
  control,
  name,
  parentName,
  placeholder = "All Sub-Outlet",
  endpoint = "/select-suboutlet-member",
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
    enabled: true,
  });

  const groupedOptions = useMemo<SelectOptionGroup[]>(() => {
    if (!data || data.length === 0) {
      return [DEFAULT_GROUP];
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

    const groups = Object.entries(groupedData).map(
      ([kodeOutlet, subOutlets]) => ({
        groupLabel: `${kodeOutlet} - ${subOutlets[0]?.out_namaoutlet ?? ""}`,
        options: subOutlets.map((subOutlet) => ({
          label: `${subOutlet.sub_kodesuboutlet} - ${subOutlet.sub_namasuboutlet}`,
          value: subOutlet.sub_kodesuboutlet,
        })),
      }),
    );

    return [DEFAULT_GROUP, ...groups];
  }, [data]);

  return (
    <SelectTypeWrapper<TFieldValues>
      control={control}
      name={name}
      data={groupedOptions}
      loading={loading}
      error={Boolean(error)}
      placeholder={placeholder}
      valueKeyTransform={(value) => (value === "__all__" ? "" : value)}
    />
  );
}
