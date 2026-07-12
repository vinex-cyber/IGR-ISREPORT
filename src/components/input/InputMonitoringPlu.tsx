import { useState } from "react";
import type { FieldPathByValue, FieldValues } from "react-hook-form";
import { Search } from "lucide-react";

import FormInput from "../FormInput";
import InputMonitoringPluModal from "../modal/InputMonitoringPluModal";

/**
 * =========================================
 * 🧩 COMPONENT: Inputmonitoringplu
 * =========================================
 *
 * 📍 Path: src/components/input/Inputmonitoringplu.tsx
 * 🧩 Type: Client Component (interactive)
 * 🏷️  CSS Class: inputmonitoringplu
 *
 * 📌 Tips:
 * - "use client" wajib untuk useState, useEffect, onClick, dll
 * - Gunakan clsx/tailwind-merge untuk conditional classes
 * - Extract logic kompleks ke custom hooks
 */

// 🔥 Props Interface
// src/components/input/InputMonitoringPlu.tsx

type StringFieldName<TFieldValues extends FieldValues> = FieldPathByValue<
  TFieldValues,
  string | undefined
>;

interface InputMonitoringPluProps<TFieldValues extends FieldValues> {
  name: StringFieldName<TFieldValues>;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const InputMonitoringPlu = <TFieldValues extends FieldValues>({
  name,
  placeholder = "Kode Monitoring PLU",
  disabled = false,
  className,
}: InputMonitoringPluProps<TFieldValues>) => {
  const [show, setShow] = useState(false);

  const handleShow = () => {
    if (disabled) return;

    setShow((previous) => !previous);
  };

  return (
    <>
      <FormInput<TFieldValues>
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        iconRight={<Search className="h-4 w-4" />}
        onIconClick={handleShow}
        className={className}
      />

      {!disabled && (
        <InputMonitoringPluModal
          show={show}
          onClose={handleShow}
          kodeMonitoringPlu
        />
      )}
    </>
  );
};

export default InputMonitoringPlu;
