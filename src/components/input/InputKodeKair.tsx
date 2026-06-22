import { Search } from "lucide-react";
import { useState } from "react";
import FormInput from "../FormInput";
import InputKodeKasirModal from "../modal/InputKodeKasirModal";

/**
 * =========================================
 * 🧩 COMPONENT: Inputkodekasir
 * =========================================
 *
 * 📍 Path: src/components/input/Inputkodekasir.tsx
 * 🧩 Type: Client Component (interactive)
 * 🏷️  CSS Class: inputkodekasir
 *
 * 📌 Tips:
 * - "use client" wajib untuk useState, useEffect, onClick, dll
 * - Gunakan clsx/tailwind-merge untuk conditional classes
 * - Extract logic kompleks ke custom hooks
 */

// 🔥 Props Interface

/**
 * Inputkodekasir Component
 */
const InputKodeKasir = () => {
  // 🔥 Contoh: state untuk interaktivitas
  // const [isActive, setIsActive] = React.useState(false);
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(!show);
  };

  return (
    <>
      <FormInput
        name="kasir"
        placeholder="Kode Kasir"
        iconRight={<Search className="w-4 h-4" />}
        onIconClick={handleShow}
      />
      <InputKodeKasirModal show={show} onClose={handleShow} kasir />
    </>
  );
};

export default InputKodeKasir;
