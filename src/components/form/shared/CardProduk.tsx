// components/form/shared/CardProduk.tsx

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import {
  CardContent,
  CardFieldset,
  CardTitleLegend,
} from "@/components/ui/card";

import FormInput from "@/components/FormInput";
import SelectDivisi from "@/components/form/shared/SelectDivisi";
import SelectDepartement from "@/components/form/shared/SelectDepartement";
import SelectKategori from "@/components/form/shared/Selectkategori";
import SelectTag from "@/components/form/shared/SelectTag";
import SelectNonPromo from "@/components/form/shared/SelectNonPromo";

import InputProdukPlu from "@/components/input/InputProdukPlu";
import InputNamaProduk from "@/components/input/InputNamaProduk";
import InputMonitoringPlu from "@/components/input/InputMonitoringPlu";

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

interface StringFieldConfig<TFieldValues extends FieldValues> {
  name: StringFieldName<TFieldValues>;
  disabled?: boolean;
  placeholder?: string;
}

interface DependentFieldConfig<
  TFieldValues extends FieldValues,
> extends StringFieldConfig<TFieldValues> {
  parentName: StringFieldName<TFieldValues>;
}

export interface CardProdukFields<TFieldValues extends FieldValues> {
  plu?: StringFieldConfig<TFieldValues> | false;

  namaProduk?: StringFieldConfig<TFieldValues> | false;

  barcode?: StringFieldConfig<TFieldValues> | false;

  monitoringPlu?: StringFieldConfig<TFieldValues> | false;

  divisi?: StringFieldConfig<TFieldValues> | false;

  departement?: DependentFieldConfig<TFieldValues> | false;

  kategori?: DependentFieldConfig<TFieldValues> | false;

  tag?: StringFieldConfig<TFieldValues> | false;

  nonPromo?: StringFieldConfig<TFieldValues> | false;
}

interface CardProdukProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  fields: CardProdukFields<TFieldValues>;
  title?: string;
  className?: string;
}

const CardProduk = <TFieldValues extends FieldValues>({
  control,
  fields,
  title = "Produk",
  className,
}: CardProdukProps<TFieldValues>) => {
  return (
    <CardFieldset
      className={`relative rounded-lg border shadow ${className ?? ""}`}>
      <CardTitleLegend className="mx-6 px-2 text-md font-semibold">
        {title}
      </CardTitleLegend>

      <CardContent className="space-y-2">
        {fields.plu && (
          <InputProdukPlu<TFieldValues>
            name={fields.plu.name}
            placeholder={fields.plu.placeholder ?? "Input PLU"}
            disabled={fields.plu.disabled}
          />
        )}

        {fields.namaProduk && (
          <InputNamaProduk<TFieldValues>
            name={fields.namaProduk.name}
            placeholder={fields.namaProduk.placeholder ?? "Nama Produk"}
            disabled={fields.namaProduk.disabled}
          />
        )}

        {fields.barcode && (
          <FormInput<TFieldValues>
            name={fields.barcode.name}
            placeholder={fields.barcode.placeholder ?? "Barcode"}
            disabled={fields.barcode.disabled}
          />
        )}

        {fields.monitoringPlu && (
          <InputMonitoringPlu<TFieldValues>
            name={fields.monitoringPlu.name}
            placeholder={
              fields.monitoringPlu.placeholder ?? "Kode Monitoring PLU"
            }
            disabled={fields.monitoringPlu.disabled}
          />
        )}

        {fields.divisi && (
          <SelectDivisi<TFieldValues>
            control={control}
            name={fields.divisi.name}
            disabled={fields.divisi.disabled}
          />
        )}

        {fields.departement && (
          <SelectDepartement<TFieldValues>
            control={control}
            name={fields.departement.name}
            parentName={fields.departement.parentName}
            disabled={fields.departement.disabled}
          />
        )}

        {fields.kategori && (
          <SelectKategori<TFieldValues>
            control={control}
            name={fields.kategori.name}
            parentName={fields.kategori.parentName}
            disabled={fields.kategori.disabled}
          />
        )}

        {fields.tag && (
          <SelectTag<TFieldValues>
            control={control}
            name={fields.tag.name}
            disabled={fields.tag.disabled}
          />
        )}

        {fields.nonPromo && (
          <SelectNonPromo<TFieldValues>
            control={control}
            name={fields.nonPromo.name}
            disabled={fields.nonPromo.disabled}
          />
        )}
      </CardContent>
    </CardFieldset>
  );
};

export default CardProduk;
