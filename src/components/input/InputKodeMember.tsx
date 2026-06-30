// src/components/input/InputKodeMember.tsx

import { useState } from "react";
import {
  Controller,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import InputKodeMemberModal, {
  type MemberSelection,
} from "@/components/modal/InputKodeMember";

import { cn } from "@/lib/utils";

/**
 * Field kode member dapat menyimpan:
 *
 * - string
 * - string[]
 * - undefined
 */
type MemberCodeFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | string[] | undefined
>;

export interface InputKodeMemberProps<TFieldValues extends FieldValues> {
  /**
   * Control React Hook Form.
   */
  control: Control<TFieldValues>;

  /**
   * Nama field yang digunakan untuk menyimpan kode member.
   *
   * Contoh:
   * name="noMember"
   */
  name: MemberCodeFieldName<TFieldValues>;

  /**
   * Placeholder input.
   *
   * @default "Kode Member"
   */
  placeholder?: string;

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
   * Ketika multiple=true, kode yang dipilih
   * ditambahkan ke pilihan sebelumnya.
   *
   * Ketika false, pilihan sebelumnya diganti.
   *
   * @default true
   */
  append?: boolean;

  /**
   * Pemisah kode member.
   *
   * @default ","
   */
  separator?: string;

  /**
   * Mengizinkan input diketik manual.
   *
   * @default true
   */
  allowManualInput?: boolean;

  /**
   * Menonaktifkan input dan tombol pencarian.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Judul modal pencarian member.
   *
   * @default "Pilih Member"
   */
  modalTitle?: string;

  /**
   * Dijalankan setelah member dipilih.
   *
   * Bisa digunakan untuk mengisi field lain,
   * seperti nama member atau jenis member.
   */
  onMemberSelected?: (selection: MemberSelection) => void;

  /**
   * Class tambahan pada pembungkus input.
   */
  className?: string;

  /**
   * Class tambahan pada elemen input.
   */
  inputClassName?: string;

  /**
   * Class tambahan pada ikon pencarian.
   *
   * Contoh:
   * iconClassName="text-blue-500"
   */
  iconClassName?: string;
}

/**
 * Mengubah nilai string atau string[]
 * menjadi array string yang bersih.
 */
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

/**
 * Menghapus kode member yang sama.
 */
function removeDuplicateMemberCodes(values: string[]): string[] {
  return Array.from(new Set(values));
}

export default function InputKodeMember<TFieldValues extends FieldValues>({
  control,
  name,
  placeholder = "Kode Member",
  multiple = false,
  append = true,
  separator = ",",
  allowManualInput = true,
  disabled = false,
  modalTitle = "Pilih Member",
  onMemberSelected,
  className,
  inputClassName,
  iconClassName,
}: InputKodeMemberProps<TFieldValues>) {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    if (!disabled) {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <Controller
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

        const handleManualChange = (value: string) => {
          if (!multiple) {
            field.onChange(value);
            return;
          }

          const nextMemberCodes = normalizeMemberCodes(value, separator);

          field.onChange(removeDuplicateMemberCodes(nextMemberCodes));
        };

        const handleMemberSelect = (selection: MemberSelection) => {
          const memberCode = selection.kodeMember.trim();

          if (!memberCode) {
            return;
          }

          if (!multiple) {
            field.onChange(memberCode);
          } else {
            const nextMemberCodes = append
              ? [...selectedMemberCodes, memberCode]
              : [memberCode];

            field.onChange(removeDuplicateMemberCodes(nextMemberCodes));
          }

          onMemberSelected?.(selection);

          closeModal();
        };

        return (
          <>
            <div className={cn("space-y-1", className)}>
              <div className="relative">
                <Input
                  ref={field.ref}
                  name={field.name}
                  value={displayValue}
                  placeholder={placeholder}
                  disabled={disabled}
                  readOnly={!allowManualInput}
                  onBlur={field.onBlur}
                  onChange={(event) => handleManualChange(event.target.value)}
                  className={cn("pr-10", inputClassName)}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={disabled}
                  onClick={openModal}
                  aria-label="Cari member"
                  className={cn(
                    "absolute right-0 top-1/2 h-full -translate-y-1/2",
                    "cursor-pointer",
                    "text-muted-foreground",
                    "hover:bg-transparent hover:text-foreground",
                    "disabled:cursor-not-allowed",
                  )}>
                  <Search
                    className={cn(
                      "h-4 w-4",
                      "text-muted-foreground",
                      iconClassName,
                    )}
                  />
                </Button>
              </div>

              {fieldState.error && (
                <p className="text-sm text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </div>

            <InputKodeMemberModal
              show={showModal}
              onClose={closeModal}
              title={modalTitle}
              onSelect={handleMemberSelect}
            />
          </>
        );
      }}
    />
  );
}
