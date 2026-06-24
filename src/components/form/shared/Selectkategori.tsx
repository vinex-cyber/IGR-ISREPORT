// src/components/form/shared/SelectKategori.tsx

import { useCallback } from "react";

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import { DependentSelectWrapper } from "@/components/DependentSelectWrapper";

export interface Kategori {
  div_kodedivisi: string;
  div_namadivisi: string;
  dep_kodedepartement: string;
  dep_namadepartement: string;
  kat_kodekategori: string;
  kat_namakategori: string;
}

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

/**
 * Format nilai field departemen yang menjadi parent.
 *
 * department:
 * - parent menyimpan kode departemen saja
 * - contoh: "12"
 *
 * division-department:
 * - parent menyimpan gabungan divisi dan departemen
 * - contoh: divisi "1" + departemen "12" = "112"
 */
export type KategoriParentValueMode = "department" | "division-department";

/**
 * Format nilai kategori yang akan disimpan ke form.
 *
 * category:
 * - contoh: "34"
 *
 * department-category:
 * - contoh: departemen "12" + kategori "34" = "1234"
 *
 * division-department-category:
 * - contoh: divisi "1" + departemen "12" + kategori "34" = "11234"
 */
export type KategoriValueMode =
  | "category"
  | "department-category"
  | "division-department-category";

export interface SelectKategoriProps<TFieldValues extends FieldValues> {
  /**
   * Control dari React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Field yang menyimpan nilai kategori.
   *
   * @example
   * name="kat"
   */
  name: StringFieldName<TFieldValues>;

  /**
   * Field departemen yang menjadi parent.
   *
   * @example
   * parentName="dept"
   */
  parentName: StringFieldName<TFieldValues>;

  /**
   * Label pilihan semua kategori.
   *
   * @default "All Kategori"
   */
  labelAll?: string;

  /**
   * Placeholder ketika select aktif.
   *
   * Default mengikuti labelAll.
   */
  placeholder?: string;

  /**
   * Placeholder ketika departemen belum dipilih.
   *
   * @default "Pilih departemen terlebih dahulu"
   */
  parentEmptyPlaceholder?: string;

  /**
   * Endpoint API kategori.
   *
   * @default "/select-kategori"
   */
  endpoint?: string;

  /**
   * Data statis sebagai pengganti endpoint.
   *
   * Ketika staticData diberikan, request API tidak dijalankan.
   */
  staticData?: Kategori[];

  /**
   * Menonaktifkan select secara manual.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Menonaktifkan select ketika departemen belum dipilih.
   *
   * @default true
   */
  disableWhenParentEmpty?: boolean;

  /**
   * Format nilai field departemen sebagai parent.
   *
   * @default "division-department"
   */
  parentValueMode?: KategoriParentValueMode;

  /**
   * Format nilai kategori yang disimpan ke form.
   *
   * @default "department-category"
   */
  valueMode?: KategoriValueMode;

  /**
   * Mengaktifkan pencarian.
   *
   * @default true
   */
  enableSearch?: boolean;

  /**
   * Mengurutkan kelompok.
   *
   * @default true
   */
  sortGroups?: boolean;

  /**
   * Mengurutkan pilihan.
   *
   * @default true
   */
  sortOptions?: boolean;
}

const getKategoriGroup = (kategori: Kategori): string => {
  const kodeDepartement = kategori.dep_kodedepartement?.trim();

  const namaDepartement = kategori.dep_namadepartement?.trim();

  if (kodeDepartement && namaDepartement) {
    return `${kodeDepartement} - ${namaDepartement}`;
  }

  return kodeDepartement || namaDepartement || "Departement Lainnya";
};

export default function SelectKategori<TFieldValues extends FieldValues>({
  control,
  name,
  parentName,

  labelAll = "All Kategori",
  placeholder,
  parentEmptyPlaceholder = "Pilih departemen terlebih dahulu",

  endpoint = "/select-kategori",
  staticData,

  disabled = false,
  disableWhenParentEmpty = true,

  parentValueMode = "division-department",
  valueMode = "department-category",

  enableSearch = true,
  sortGroups = true,
  sortOptions = true,
}: SelectKategoriProps<TFieldValues>) {
  const resolvedEndpoint = staticData !== undefined ? undefined : endpoint;

  const resolvedPlaceholder = placeholder ?? labelAll;

  const getKategoriOption = useCallback(
    (kategori: Kategori) => {
      let value: string;

      switch (valueMode) {
        case "category":
          value = kategori.kat_kodekategori;
          break;

        case "division-department-category":
          value =
            `${kategori.div_kodedivisi}` +
            `${kategori.dep_kodedepartement}` +
            `${kategori.kat_kodekategori}`;
          break;

        case "department-category":
        default:
          value =
            `${kategori.dep_kodedepartement}` + `${kategori.kat_kodekategori}`;
          break;
      }

      return {
        label:
          `${kategori.kat_kodekategori} - ` + `${kategori.kat_namakategori}`,
        value,
      };
    },
    [valueMode],
  );

  const filterKategori = useCallback(
    (kategori: Kategori, parentValue: unknown): boolean => {
      if (typeof parentValue !== "string") {
        return false;
      }

      const normalizedParent = parentValue.trim();

      if (!normalizedParent) {
        return false;
      }

      const expectedParentValue =
        parentValueMode === "department"
          ? kategori.dep_kodedepartement
          : `${kategori.div_kodedivisi}${kategori.dep_kodedepartement}`;

      return expectedParentValue === normalizedParent;
    },
    [parentValueMode],
  );

  return (
    <DependentSelectWrapper<Kategori, TFieldValues>
      control={control}
      name={name}
      parentName={parentName}
      endpoint={resolvedEndpoint}
      staticData={staticData}
      labelAll={labelAll}
      placeholder={resolvedPlaceholder}
      parentEmptyPlaceholder={parentEmptyPlaceholder}
      disabled={disabled}
      disableWhenParentEmpty={disableWhenParentEmpty}
      getGroupKey={getKategoriGroup}
      getOption={getKategoriOption}
      filterFn={filterKategori}
      enableSearch={enableSearch}
      sortGroups={sortGroups}
      sortOptions={sortOptions}
    />
  );
}
