// src/components/form/shared/CardKasir.tsx

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import {
  CardContent,
  CardFieldset,
  CardTitleLegend,
} from "@/components/ui/card";

import FormInput from "@/components/FormInput";
import SelectKassa from "@/components/form/shared/SelectKassa";
import SelectMethode from "@/components/form/shared/SelectMethode";

import { cn } from "@/lib/utils";
import InputKodeKasir from "@/components/input/InputKodeKair";

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

type StringOrArrayFieldName<TFieldValues extends FieldValues> =
  FieldPathByValue<TFieldValues, string | string[] | undefined>;

interface StringFieldConfig<TFieldValues extends FieldValues> {
  name: StringFieldName<TFieldValues>;
  placeholder?: string;
  disabled?: boolean;
}

interface KasirFieldConfig<TFieldValues extends FieldValues> {
  name: StringOrArrayFieldName<TFieldValues>;
  placeholder?: string;
  disabled?: boolean;

  /**
   * Gunakan true apabila field di schema bertipe string.
   */
  allowManualInput?: boolean;

  /**
   * Gunakan true apabila field di schema bertipe string.
   */
  separator?: string;

  /**
   * Gunakan true apabila field di schema bertipe string.
   */
  append?: boolean;

  /**
   * Gunakan true apabila field di schema bertipe string[].
   */
  multiple?: boolean;
}

export interface CardKasirFields<TFieldValues extends FieldValues> {
  kodeKasir?: KasirFieldConfig<TFieldValues> | false;

  station?: StringFieldConfig<TFieldValues> | false;

  noTrans?: StringFieldConfig<TFieldValues> | false;

  kassa?: StringFieldConfig<TFieldValues> | false;

  methode?: StringFieldConfig<TFieldValues> | false;
}

export interface CardKasirProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;

  fields: CardKasirFields<TFieldValues>;

  title?: string;

  className?: string;
}

const CardKasir = <TFieldValues extends FieldValues>({
  control,
  fields,
  title = "Kasir",
  className,
}: CardKasirProps<TFieldValues>) => {
  return (
    <CardFieldset
      className={cn("relative rounded-lg border shadow", className)}>
      <CardTitleLegend className="mx-6 px-2 text-md font-semibold">
        {title}
      </CardTitleLegend>

      <CardContent className="space-y-2">
        {fields.kodeKasir && (
          <InputKodeKasir<TFieldValues>
            name={fields.kodeKasir.name}
            placeholder={fields.kodeKasir.placeholder ?? "Kode Kasir"}
            disabled={fields.kodeKasir.disabled}
            multiple={fields.kodeKasir.multiple}
            allowManualInput={fields.kodeKasir.multiple}
            append={fields.kodeKasir.append}
            separator={fields.kodeKasir.separator ?? ","}
            modalTitle={fields.kodeKasir.placeholder ?? "Kode Kasir"}
          />
        )}

        {fields.station && (
          <FormInput<TFieldValues>
            name={fields.station.name}
            placeholder={fields.station.placeholder ?? "Station"}
            disabled={fields.station.disabled}
          />
        )}

        {fields.noTrans && (
          <FormInput<TFieldValues>
            name={fields.noTrans.name}
            placeholder={fields.noTrans.placeholder ?? "No Transaksi"}
            disabled={fields.noTrans.disabled}
          />
        )}

        {fields.kassa && (
          <SelectKassa<TFieldValues>
            control={control}
            name={fields.kassa.name}
            placeholder={fields.kassa.placeholder ?? "All Kassa"}
            disabled={fields.kassa.disabled}
          />
        )}

        {fields.methode && (
          <SelectMethode<TFieldValues>
            control={control}
            name={fields.methode.name}
            placeholder={fields.methode.placeholder ?? "All Methode"}
            disabled={fields.methode.disabled}
          />
        )}
      </CardContent>
    </CardFieldset>
  );
};

export default CardKasir;
