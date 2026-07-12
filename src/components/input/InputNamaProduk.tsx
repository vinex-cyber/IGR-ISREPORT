import { useState } from "react";
import type { FieldPathByValue, FieldValues } from "react-hook-form";
import { Search } from "lucide-react";

import FormInput from "../FormInput";
import InputProdukModal from "../modal/InputProdukModal";

/**
 * =========================================
 * 🧩 COMPONENT: InputNamaProduk
 * =========================================
 *
 * 📍 Path: src/components/input/InputNamaProduk.tsx
 * 🧩 Type: Client Component (interactive)
 * 🏷️  CSS Class: input-nama-produk
 *
 * 📌 Tips:
 * - "use client" wajib untuk useState, useEffect, onClick, dll
 * - Gunakan clsx/tailwind-merge untuk conditional classes
 * - Extract logic kompleks ke custom hooks
 */

// src/components/input/InputNamaProduk.tsx

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

interface InputNamaProdukProps<TFieldValues extends FieldValues> {
  name: StringFieldName<TFieldValues>;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const InputNamaProduk = <TFieldValues extends FieldValues>({
  name,
  placeholder = "Nama Produk",
  disabled = false,
  className,
}: InputNamaProdukProps<TFieldValues>) => {
  const [produkModal, setProdukModal] = useState(false);

  const handleProdukModal = () => {
    if (disabled) return;

    setProdukModal((previous) => !previous);
  };

  return (
    <>
      <FormInput<TFieldValues>
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        iconRight={<Search className="h-4 w-4" />}
        onIconClick={handleProdukModal}
        className={className}
      />

      {!disabled && (
        <InputProdukModal
          show={produkModal}
          onClose={handleProdukModal}
          namaBarang
        />
      )}
    </>
  );
};

export default InputNamaProduk;
