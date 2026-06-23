// src/components/form/shared/SelectKategori.tsx

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import { DependentSelectWrapper } from "@/components/DependentSelectWrapper";

interface Kategori {
  div_kodedivisi: string;
  div_namadivisi: string;
  dep_kodedepartement: string;
  dep_namadepartement: string;
  kat_kodekategori: string;
  kat_namakategori: string;
}

interface SelectKategoriProps<TFieldValues extends FieldValues> {
  /**
   * Control dari React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Field yang menyimpan nilai kategori.
   *
   * Contoh: "kat"
   */
  name: FieldPathByValue<TFieldValues, string | undefined>;

  /**
   * Field departement yang menjadi parent kategori.
   *
   * Contoh: "dept"
   */
  parentName: FieldPathByValue<TFieldValues, string | undefined>;

  placeholder?: string;
  disabled?: boolean;
}

const getGroupKey = (kategori: Kategori): string => {
  return `${kategori.dep_kodedepartement} - ${kategori.dep_namadepartement}`;
};

const getOption = (kategori: Kategori) => ({
  label: `${kategori.kat_kodekategori} - ${kategori.kat_namakategori}`,
  value: `${kategori.dep_kodedepartement}${kategori.kat_kodekategori}`,
});

export default function SelectKategori<TFieldValues extends FieldValues>({
  control,
  name,
  parentName,
  placeholder = "All Kategori",
  disabled = false,
}: SelectKategoriProps<TFieldValues>) {
  return (
    <DependentSelectWrapper<Kategori, TFieldValues>
      disabled={disabled}
      control={control}
      name={name}
      parentName={parentName}
      endpoint="/select-kategori"
      labelAll={placeholder}
      placeholder={placeholder}
      getGroupKey={getGroupKey}
      getOption={getOption}
      filterFn={(kategori, departement) => {
        const currentDepartement = `${kategori.div_kodedivisi}${kategori.dep_kodedepartement}`;

        return currentDepartement === departement;
      }}
      enableSearch
      sortGroups
      sortOptions
    />
  );
}
