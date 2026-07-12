// src/components/DependentSelectWrapper.tsx

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import { useFetchData } from "@/hooks/data/useFetchData";
import { useDependentSelect } from "@/hooks/useDependentSelect";
import SelectTypeWrapper from "@/components/SelectTypeWrapper";

type StringFieldName<FormType extends FieldValues> = FieldPathByValue<
  FormType,
  string | undefined
>;

interface DependentSelectWrapperProps<T, FormType extends FieldValues> {
  control: Control<FormType>;

  /**
   * Field yang menyimpan nilai select.
   */
  name: StringFieldName<FormType>;

  /**
   * Field parent untuk select bertingkat.
   *
   * Contoh:
   * - Departement bergantung pada Divisi
   * - Kategori bergantung pada Departement
   */
  parentName?: StringFieldName<FormType>;

  /**
   * Endpoint API tanpa awalan /api.
   */
  endpoint?: string;

  /**
   * Data lokal sebagai pengganti endpoint.
   */
  staticData?: T[];

  /**
   * Label pilihan semua data.
   */
  labelAll?: string;

  /**
   * Placeholder ketika select aktif.
   */
  placeholder?: string;

  /**
   * Placeholder ketika parent belum dipilih.
   */
  parentEmptyPlaceholder?: string;

  getOption: (item: T) => {
    label: string;
    value: string;
  };

  getGroupKey?: (item: T) => string;

  filterFn?: (item: T, parentValue: unknown) => boolean;

  sortGroups?: boolean;
  sortOptions?: boolean;

  enableSearch?: boolean;

  /**
   * Menonaktifkan select secara manual.
   */
  disabled?: boolean;

  /**
   * Menonaktifkan select ketika parent belum dipilih.
   *
   * @default true
   */
  disableWhenParentEmpty?: boolean;
}

export function DependentSelectWrapper<T, FormType extends FieldValues>({
  control,
  name,
  parentName,
  endpoint,
  staticData,

  labelAll = "All",
  placeholder,
  parentEmptyPlaceholder = "Pilih data sebelumnya",

  getOption,
  getGroupKey,
  filterFn,

  sortGroups = true,
  sortOptions = true,

  enableSearch = false,

  disabled = false,
  disableWhenParentEmpty = true,
}: DependentSelectWrapperProps<T, FormType>) {
  const {
    data: queryData,
    error,
    loading,
  } = useFetchData<T[]>({
    endpoint: endpoint ?? "",
    enabled: Boolean(endpoint) && !disabled,
  });

  /*
   * Jika endpoint tersedia, gunakan hasil API.
   * Jika tidak, gunakan staticData.
   */
  const data = endpoint ? (queryData ?? []) : (staticData ?? []);

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

  /*
   * Parent dianggap kosong apabila:
   * - undefined
   * - null
   * - string kosong
   */
  const isParentEmpty =
    Boolean(parentName) &&
    (parentValue === undefined || parentValue === null || parentValue === "");

  /*
   * Select dinonaktifkan jika:
   * 1. disabled manual bernilai true; atau
   * 2. mempunyai parent dan parent masih kosong.
   */
  const isDisabled = disabled || (disableWhenParentEmpty && isParentEmpty);

  const resolvedPlaceholder =
    disableWhenParentEmpty && isParentEmpty
      ? parentEmptyPlaceholder
      : (placeholder ?? labelAll);

  return (
    <SelectTypeWrapper<FormType>
      control={control}
      name={name}
      data={options}
      loading={loading}
      error={Boolean(error)}
      disabled={isDisabled}
      placeholder={resolvedPlaceholder}
      valueKeyTransform={(value) =>
        value === "__ALL__" || value === "__all__" ? "" : value
      }
      enableSearch={enableSearch}
    />
  );
}
