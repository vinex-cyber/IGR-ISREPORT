// src/components/form/shared/SelectDepartement.tsx

import { useCallback } from "react";

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import { DependentSelectWrapper } from "@/components/DependentSelectWrapper";

export interface Departement {
  div_kodedivisi: string;
  div_namadivisi: string;
  dep_kodedepartement: string;
  dep_namadepartement: string;
}

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

type DepartementValueMode = "department" | "division-department";

export interface SelectDepartementProps<TFieldValues extends FieldValues> {
  /**
   * Control dari React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Field yang menyimpan nilai departemen.
   *
   * @example
   * name="dept"
   */
  name: StringFieldName<TFieldValues>;

  /**
   * Field divisi yang menjadi parent.
   *
   * @example
   * parentName="div"
   */
  parentName: StringFieldName<TFieldValues>;

  /**
   * Label pilihan semua departemen.
   *
   * @default "All Departement"
   */
  labelAll?: string;

  /**
   * Placeholder select.
   *
   * Jika tidak diberikan, akan mengikuti labelAll.
   */
  placeholder?: string;

  /**
   * Endpoint pengambilan daftar departemen.
   *
   * @default "/select-departement"
   */
  endpoint?: string;

  /**
   * Data departemen statis.
   *
   * Jika staticData diberikan, endpoint tidak digunakan.
   */
  staticData?: Departement[];

  /**
   * Menonaktifkan select.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Menonaktifkan select ketika parent/divisi belum dipilih.
   *
   * @default true
   */
  disableWhenParentEmpty?: boolean;

  /**
   * Mengaktifkan pencarian.
   *
   * @default true
   */
  enableSearch?: boolean;

  /**
   * Mengurutkan group.
   *
   * @default true
   */
  sortGroups?: boolean;

  /**
   * Mengurutkan option.
   *
   * @default true
   */
  sortOptions?: boolean;

  /**
   * Menentukan nilai yang disimpan ke form.
   *
   * department:
   *   menyimpan kode departemen saja, contoh "12"
   *
   * division-department:
   *   menyimpan gabungan divisi dan departemen, contoh "112"
   *
   * @default "division-department"
   */
  valueMode?: DepartementValueMode;
}

const getDepartementGroup = (departement: Departement): string => {
  const kodeDivisi = departement.div_kodedivisi?.trim();

  const namaDivisi = departement.div_namadivisi?.trim();

  if (kodeDivisi && namaDivisi) {
    return `${kodeDivisi} - ${namaDivisi}`;
  }

  return kodeDivisi || namaDivisi || "Lainnya";
};

const filterDepartementByDivisi = (
  departement: Departement,
  parentValue: unknown,
): boolean => {
  if (typeof parentValue !== "string") {
    return false;
  }

  return departement.div_kodedivisi === parentValue;
};

export default function SelectDepartement<TFieldValues extends FieldValues>({
  control,
  name,
  parentName,
  labelAll = "All Departement",
  placeholder,
  endpoint = "/select-departement",
  staticData,
  disabled = false,
  disableWhenParentEmpty = true,
  enableSearch = true,
  sortGroups = true,
  sortOptions = true,
  valueMode = "division-department",
}: SelectDepartementProps<TFieldValues>) {
  const resolvedEndpoint = staticData !== undefined ? undefined : endpoint;

  const resolvedPlaceholder = placeholder ?? labelAll;

  const getDepartementOption = useCallback(
    (departement: Departement) => {
      const value =
        valueMode === "department"
          ? departement.dep_kodedepartement
          : `${departement.div_kodedivisi}${departement.dep_kodedepartement}`;

      return {
        label: `${departement.dep_kodedepartement} - ${departement.dep_namadepartement}`,
        value,
      };
    },
    [valueMode],
  );

  return (
    <DependentSelectWrapper<Departement, TFieldValues>
      control={control}
      name={name}
      parentName={parentName}
      endpoint={resolvedEndpoint}
      staticData={staticData}
      labelAll={labelAll}
      placeholder={resolvedPlaceholder}
      disabled={disabled}
      disableWhenParentEmpty={disableWhenParentEmpty}
      getOption={getDepartementOption}
      getGroupKey={getDepartementGroup}
      filterFn={filterDepartementByDivisi}
      enableSearch={enableSearch}
      sortGroups={sortGroups}
      sortOptions={sortOptions}
    />
  );
}
