// src/components/form/shared/CardPromo.tsx

import type { FieldPathByValue, FieldValues } from "react-hook-form";

import InputKodeCashback from "@/components/input/Inputkodecashback";
import InputKodeGift from "@/components/input/InputKodeGift";

import {
  CardContent,
  CardFieldset,
  CardTitleLegend,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";

/**
 * Field yang nilainya berupa string.
 *
 * Digunakan untuk:
 * - branch
 * - startDate
 * - endDate
 */
type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

/**
 * Field gift dapat berupa:
 * - string
 * - string[]
 * - undefined
 */
type GiftFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | string[] | undefined
>;

/**
 * Field cashback dapat berupa:
 * - string
 * - string[]
 * - undefined
 */
type CashbackFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | string[] | undefined
>;

export interface GiftFieldConfig<TFieldValues extends FieldValues> {
  /**
   * Field penyimpanan kode gift.
   */
  name: GiftFieldName<TFieldValues>;

  placeholder?: string;
  disabled?: boolean;

  /**
   * Menyimpan banyak gift sebagai string[].
   *
   * @default false
   */
  multiple?: boolean;

  /**
   * Menambahkan pilihan baru ke nilai sebelumnya.
   *
   * @default true
   */
  appendOnSelect?: boolean;

  /**
   * Pemisah ketika beberapa kode ditampilkan.
   *
   * @default ","
   */
  separator?: string;

  /**
   * Mengizinkan input manual.
   *
   * @default true
   */
  allowManualInput?: boolean;

  /**
   * Mengubah periode berdasarkan gift terpilih.
   *
   * @default true
   */
  updatePeriodOnSelect?: boolean;

  /**
   * Field khusus untuk gift.
   *
   * Jika tidak diberikan, memakai field
   * milik CardPromo.
   */
  branchName?: StringFieldName<TFieldValues>;
  startDateName?: StringFieldName<TFieldValues>;
  endDateName?: StringFieldName<TFieldValues>;
}

export interface CashbackFieldConfig<TFieldValues extends FieldValues> {
  /**
   * Field penyimpanan kode cashback.
   */
  name: CashbackFieldName<TFieldValues>;

  placeholder?: string;
  disabled?: boolean;

  multiple?: boolean;
  appendOnSelect?: boolean;
  separator?: string;
  allowManualInput?: boolean;
  updatePeriodOnSelect?: boolean;

  branchName?: StringFieldName<TFieldValues>;
  startDateName?: StringFieldName<TFieldValues>;
  endDateName?: StringFieldName<TFieldValues>;
}

export interface CardPromoFields<TFieldValues extends FieldValues> {
  gift?: GiftFieldConfig<TFieldValues> | false;

  cashback?: CashbackFieldConfig<TFieldValues> | false;
}

export interface CardPromoProps<TFieldValues extends FieldValues> {
  fields: CardPromoFields<TFieldValues>;

  branchName: StringFieldName<TFieldValues>;

  startDateName?: StringFieldName<TFieldValues>;

  endDateName?: StringFieldName<TFieldValues>;

  title?: string;

  className?: string;

  contentClassName?: string;
}

export default function CardPromo<TFieldValues extends FieldValues>({
  fields,
  branchName,
  startDateName,
  endDateName,
  title = "Promo",
  className,
  contentClassName,
}: CardPromoProps<TFieldValues>) {
  const giftBranchName =
    fields.gift && fields.gift.branchName ? fields.gift.branchName : branchName;

  const giftStartDateName =
    fields.gift && fields.gift.startDateName
      ? fields.gift.startDateName
      : startDateName;

  const giftEndDateName =
    fields.gift && fields.gift.endDateName
      ? fields.gift.endDateName
      : endDateName;

  const cashbackBranchName =
    fields.cashback && fields.cashback.branchName
      ? fields.cashback.branchName
      : branchName;

  const cashbackStartDateName =
    fields.cashback && fields.cashback.startDateName
      ? fields.cashback.startDateName
      : startDateName;

  const cashbackEndDateName =
    fields.cashback && fields.cashback.endDateName
      ? fields.cashback.endDateName
      : endDateName;

  return (
    <CardFieldset
      className={cn("relative rounded-lg border shadow", className)}>
      {title && (
        <CardTitleLegend className="mx-6 px-2 text-md font-semibold">
          {title}
        </CardTitleLegend>
      )}

      <CardContent className={cn("space-y-2", contentClassName)}>
        {fields.gift && (
          <InputKodeGift<TFieldValues>
            name={fields.gift.name}
            branchName={giftBranchName}
            startDateName={giftStartDateName}
            endDateName={giftEndDateName}
            placeholder={fields.gift.placeholder}
            disabled={fields.gift.disabled}
            multiple={fields.gift.multiple}
            appendOnSelect={fields.gift.appendOnSelect}
            separator={fields.gift.separator}
            allowManualInput={fields.gift.allowManualInput}
            updatePeriodOnSelect={fields.gift.updatePeriodOnSelect}
          />
        )}

        {fields.cashback && (
          <InputKodeCashback<TFieldValues>
            name={fields.cashback.name}
            branchName={cashbackBranchName}
            startDateName={cashbackStartDateName}
            endDateName={cashbackEndDateName}
            placeholder={fields.cashback.placeholder}
            disabled={fields.cashback.disabled}
            multiple={fields.cashback.multiple}
            appendOnSelect={fields.cashback.appendOnSelect}
            separator={fields.cashback.separator}
            allowManualInput={fields.cashback.allowManualInput}
            updatePeriodOnSelect={fields.cashback.updatePeriodOnSelect}
          />
        )}
      </CardContent>
    </CardFieldset>
  );
}
