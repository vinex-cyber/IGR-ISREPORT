// src/components/form/shared/CardMember.tsx

import { useState, type ChangeEvent } from "react";

import {
  Controller,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import { Search } from "lucide-react";

import {
  CardContent,
  CardFieldset,
  CardTitleLegend,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/FormInput";

import SelectOutletMember from "@/components/form/shared/SelectOutletMember";
import SelectMemberKhusus from "@/components/form/shared/SelectMemberKhusus";
import SelectSubOutletMember from "@/components/form/shared/SelectSubOutletMember";
import SelectKategoriMember from "@/components/form/shared/SelectKategoriMember";

import InputKodeMemberModal, {
  type MemberSelection,
} from "@/components/modal/InputKodeMember";

import { cn } from "@/lib/utils";

/**
 * Field yang hanya menerima:
 *
 * - string
 * - undefined
 */
type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

/**
 * Field yang menerima:
 *
 * - string
 * - string[]
 * - undefined
 *
 * Digunakan untuk field noMember.
 */
type StringOrArrayFieldName<TFieldValues extends FieldValues> =
  FieldPathByValue<TFieldValues, string | string[] | undefined>;

export interface StringFieldConfig<TFieldValues extends FieldValues> {
  name: StringFieldName<TFieldValues>;
  placeholder?: string;
  disabled?: boolean;
}

export interface StringOrArrayFieldConfig<TFieldValues extends FieldValues> {
  name: StringOrArrayFieldName<TFieldValues>;
  placeholder?: string;
  disabled?: boolean;

  /**
   * false:
   * nilai disimpan sebagai string.
   *
   * true:
   * nilai disimpan sebagai string[].
   *
   * @default false
   */
  multiple?: boolean;

  /**
   * Ketika multiple=true, member baru akan
   * ditambahkan ke pilihan sebelumnya.
   *
   * @default true
   */
  append?: boolean;

  /**
   * Pemisah untuk mode multiple.
   *
   * @default ","
   */
  separator?: string;

  /**
   * Mengizinkan input diketik secara manual.
   *
   * @default true
   */
  allowManualInput?: boolean;
}

export interface DependentFieldConfig<
  TFieldValues extends FieldValues,
> extends StringFieldConfig<TFieldValues> {
  /**
   * Field parent.
   *
   * Contoh:
   * subOutlet bergantung pada outlet.
   */
  parentName: StringFieldName<TFieldValues>;
}

export interface CardMemberFields<TFieldValues extends FieldValues> {
  /**
   * Field nama member.
   */
  namaMember?: StringFieldConfig<TFieldValues> | false;

  /**
   * Field nomor member.
   *
   * Mendukung string dan string[].
   */
  noMember?: StringOrArrayFieldConfig<TFieldValues> | false;

  /**
   * Field kode monitoring member.
   */
  monitoringMember?: StringFieldConfig<TFieldValues> | false;

  /**
   * Field member biru/merah.
   */
  memberKhusus?: StringFieldConfig<TFieldValues> | false;

  /**
   * Field outlet.
   */
  outlet?: StringFieldConfig<TFieldValues> | false;

  /**
   * Field sub-outlet.
   */
  subOutlet?: DependentFieldConfig<TFieldValues> | false;

  /**
   * Field kategori member.
   */
  kategoriMember?: StringFieldConfig<TFieldValues> | false;
}

export interface CardMemberProps<TFieldValues extends FieldValues> {
  /**
   * Control milik React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Branch database aktif.
   *
   * Digunakan oleh modal pencarian member.
   */
  branch: string;

  /**
   * Konfigurasi field yang akan ditampilkan.
   */
  fields: CardMemberFields<TFieldValues>;

  /**
   * Judul card.
   *
   * @default "Member"
   */
  title?: string;

  /**
   * Class tambahan untuk CardFieldset.
   */
  className?: string;

  /**
   * Class tambahan untuk CardContent.
   *
   * @default "space-y-2"
   */
  contentClassName?: string;
}

interface MemberCodeInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: StringOrArrayFieldName<TFieldValues>;
  branch: string;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  append?: boolean;
  separator?: string;
  allowManualInput?: boolean;
}

function normalizeMemberCodes(value: unknown, separator: string): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(separator)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function removeDuplicateMemberCodes(values: string[]): string[] {
  return Array.from(new Set(values));
}

/**
 * Input khusus nomor member.
 *
 * Mendukung:
 *
 * - input manual;
 * - modal pencarian member;
 * - nilai string;
 * - nilai string[];
 * - mode multiple.
 */
function MemberCodeInput<TFieldValues extends FieldValues>({
  control,
  name,
  branch,
  placeholder = "Kode Member",
  disabled = false,
  multiple = false,
  append = true,
  separator = ",",
  allowManualInput = true,
}: MemberCodeInputProps<TFieldValues>) {
  const [memberModalOpen, setMemberModalOpen] = useState(false);

  const openMemberModal = () => {
    if (!disabled) {
      setMemberModalOpen(true);
    }
  };

  const closeMemberModal = () => {
    setMemberModalOpen(false);
  };

  return (
    <Controller<TFieldValues, StringOrArrayFieldName<TFieldValues>>
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedMemberCodes = normalizeMemberCodes(
          field.value,
          separator,
        );

        const displayValue = multiple
          ? selectedMemberCodes.join(`${separator} `)
          : (selectedMemberCodes[0] ?? "");

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
          const inputValue = event.target.value;

          if (!multiple) {
            field.onChange(inputValue);
            return;
          }

          const memberCodes = normalizeMemberCodes(inputValue, separator);

          field.onChange(removeDuplicateMemberCodes(memberCodes));
        };

        const handleMemberSelect = (selection: MemberSelection) => {
          const memberCode = selection.kodeMember.trim();

          if (!memberCode) {
            return;
          }

          if (!multiple) {
            field.onChange(memberCode);
            closeMemberModal();
            return;
          }

          const nextMemberCodes = append
            ? [...selectedMemberCodes, memberCode]
            : [memberCode];

          field.onChange(removeDuplicateMemberCodes(nextMemberCodes));

          closeMemberModal();
        };

        return (
          <>
            <div className="space-y-1">
              <div className="relative">
                <Input
                  ref={field.ref}
                  name={field.name}
                  value={displayValue}
                  placeholder={placeholder}
                  disabled={disabled}
                  readOnly={!allowManualInput}
                  onBlur={field.onBlur}
                  onChange={handleChange}
                  className="pr-10"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={disabled}
                  onClick={openMemberModal}
                  aria-label="Cari member"
                  className={cn(
                    "absolute right-0 top-1/2",
                    "h-full -translate-y-1/2",
                    "cursor-pointer",
                    "text-muted-foreground",
                  )}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {fieldState.error && (
                <p className="text-sm text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </div>

            <InputKodeMemberModal
              show={memberModalOpen}
              onClose={closeMemberModal}
              branch={branch}
              onSelect={handleMemberSelect}
            />
          </>
        );
      }}
    />
  );
}

export default function CardMember<TFieldValues extends FieldValues>({
  control,
  branch,
  fields,
  title = "Member",
  className,
  contentClassName,
}: CardMemberProps<TFieldValues>) {
  return (
    <CardFieldset
      className={cn("relative rounded-lg border shadow", className)}>
      {title && (
        <CardTitleLegend className="mx-6 px-2 text-md font-semibold">
          {title}
        </CardTitleLegend>
      )}

      <CardContent className={cn("space-y-2", contentClassName)}>
        {fields.namaMember && (
          <FormInput<TFieldValues>
            name={fields.namaMember.name}
            placeholder={fields.namaMember.placeholder ?? "Nama Member"}
            disabled={fields.namaMember.disabled}
          />
        )}

        {fields.noMember && (
          <MemberCodeInput<TFieldValues>
            control={control}
            name={fields.noMember.name}
            branch={branch}
            placeholder={fields.noMember.placeholder ?? "Kode Member"}
            disabled={fields.noMember.disabled}
            multiple={fields.noMember.multiple ?? false}
            append={fields.noMember.append ?? true}
            separator={fields.noMember.separator ?? ","}
            allowManualInput={fields.noMember.allowManualInput ?? true}
          />
        )}

        {fields.monitoringMember && (
          <FormInput<TFieldValues>
            name={fields.monitoringMember.name}
            placeholder={
              fields.monitoringMember.placeholder ?? "Kode Monitoring Member"
            }
            disabled={fields.monitoringMember.disabled}
          />
        )}

        {fields.memberKhusus && (
          <SelectMemberKhusus<TFieldValues>
            control={control}
            name={fields.memberKhusus.name}
            placeholder={fields.memberKhusus.placeholder ?? "All Member"}
            disabled={fields.memberKhusus.disabled}
          />
        )}

        {fields.outlet && (
          <SelectOutletMember<TFieldValues>
            control={control}
            name={fields.outlet.name}
            placeholder={fields.outlet.placeholder ?? "All Outlet"}
            disabled={fields.outlet.disabled}
          />
        )}

        {fields.subOutlet && (
          <SelectSubOutletMember<TFieldValues>
            control={control}
            name={fields.subOutlet.name}
            parentName={fields.subOutlet.parentName}
            placeholder={fields.subOutlet.placeholder ?? "All Sub-Outlet"}
            disabled={fields.subOutlet.disabled}
          />
        )}

        {fields.kategoriMember && (
          <SelectKategoriMember<TFieldValues>
            control={control}
            name={fields.kategoriMember.name}
            placeholder={fields.kategoriMember.placeholder ?? "All Kategori"}
            disabled={fields.kategoriMember.disabled}
          />
        )}
      </CardContent>
    </CardFieldset>
  );
}
