// src/components/form/shared/SelectDepartement.tsx

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import { DependentSelectWrapper } from "@/components/DependentSelectWrapper";

interface Departement {
  div_kodedivisi: string;
  div_namadivisi: string;
  dep_kodedepartement: string;
  dep_namadepartement: string;
}

interface SelectDepartementProps<TFieldValues extends FieldValues> {
  /**
   * Control milik React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Field yang menyimpan nilai departement.
   *
   * Contoh:
   * name="dept"
   */
  name: FieldPathByValue<TFieldValues, string | undefined>;

  /**
   * Field divisi yang menjadi parent.
   *
   * Contoh:
   * parentName="div"
   */
  parentName: FieldPathByValue<TFieldValues, string | undefined>;

  placeholder?: string;
  disabled?: boolean;
}

const getGroupKey = (departement: Departement): string => {
  return `${departement.div_kodedivisi} - ${departement.div_namadivisi}`;
};

const getOption = (departement: Departement) => ({
  label: `${departement.dep_kodedepartement} - ${departement.dep_namadepartement}`,
  value: `${departement.div_kodedivisi}${departement.dep_kodedepartement}`,
});

export default function SelectDepartement<TFieldValues extends FieldValues>({
  control,
  name,
  parentName,
  placeholder = "All Departement",
  disabled = false,
}: SelectDepartementProps<TFieldValues>) {
  return (
    <DependentSelectWrapper<Departement, TFieldValues>
      disabled={disabled}
      control={control}
      name={name}
      parentName={parentName}
      endpoint="/select-departement"
      labelAll={placeholder}
      placeholder={placeholder}
      getOption={getOption}
      getGroupKey={getGroupKey}
      filterFn={(departement, divisi) => departement.div_kodedivisi === divisi}
      enableSearch
      sortGroups
      sortOptions
    />
  );
}
