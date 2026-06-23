// src/components/DependentSelectWrapper.tsx

import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { useQueryData } from "@/hooks/useQueryData";
import { useDependentSelect } from "@/hooks/useDependentSelect";
import SelectTypeWrapper from "@/components/SelectTypeWrapper";

interface DependentSelectWrapperProps<T, FormType extends FieldValues> {
  control: Control<FormType>;

  name: FieldPath<FormType>;
  parentName?: FieldPath<FormType>;

  endpoint?: string;
  staticData?: T[];

  labelAll?: string;
  placeholder?: string;

  getOption: (item: T) => {
    label: string;
    value: string;
  };

  getGroupKey?: (item: T) => string;

  filterFn?: (item: T, parentValue: unknown) => boolean;

  sortGroups?: boolean;
  sortOptions?: boolean;

  enableSearch?: boolean;

  // Tambahkan ini
  disabled?: boolean;
}

export function DependentSelectWrapper<T, FormType extends FieldValues>({
  control,
  name,
  parentName,
  endpoint,
  staticData,

  labelAll = "All",
  placeholder,

  getOption,
  getGroupKey,
  filterFn,

  sortGroups = true,
  sortOptions = true,

  enableSearch = false,

  // Tambahkan ini
  disabled = false,
}: DependentSelectWrapperProps<T, FormType>) {
  const {
    data: queryData,
    error,
    isLoading,
  } = useQueryData<T[]>({
    endpoint: endpoint ?? "",
    enabled: Boolean(endpoint) && !disabled,
  });

  const data = endpoint ? queryData : (staticData ?? []);

  const { options, parentValue } = useDependentSelect<T, FormType>({
    control,
    name,
    parentName,
    data,

    filterFn,
    getOption,
    getGroupKey,

    includeAllOption: true,
    allLabel: labelAll,

    sortGroups,
    sortOptions,
  });

  return (
    <SelectTypeWrapper<FormType>
      control={control}
      name={name}
      data={options}
      loading={isLoading}
      error={Boolean(error)}
      disabled={disabled}
      placeholder={
        parentName
          ? parentValue
            ? (placeholder ?? "Pilih data")
            : labelAll
          : (placeholder ?? labelAll)
      }
      valueKeyTransform={(value) => (value === "__ALL__" ? "" : value)}
      enableSearch={enableSearch}
    />
  );
}
