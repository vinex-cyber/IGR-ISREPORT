
import { Search } from "lucide-react";
import { useState } from "react";
import FormInput from "../FormInput";
import InputGiftModal from "../modal/InputGiftModal";

/**
 * =========================================
 * 🧩 COMPONENT: Inputkodegift
 * =========================================
 * 
 * 📍 Path: src/components/input/Inputkodegift.tsx
 * 🧩 Type: Client Component (interactive)
 * 🏷️  CSS Class: inputkodegift
 * 
 * 📌 Tips:
 * - "use client" wajib untuk useState, useEffect, onClick, dll
 * - Gunakan clsx/tailwind-merge untuk conditional classes
 * - Extract logic kompleks ke custom hooks
 */

// 🔥 Props Interface

/**
 * Inputkodegift Component
 */
const InputKodeGift = () => {
  // 🔥 Contoh: state untuk interaktivitas
  // const [isActive, setIsActive] = React.useState(false);
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(!show);
  };

  return (
    <>
      <FormInput
        name="kodeGift"
        placeholder="Kode Gift"
        iconRight={<Search className="w-4 h-4" />}
        onIconClick={handleShow}
      />
      <InputGiftModal show={show} onClose={handleShow} kodeGift />
    </>
  );
};

export default InputKodeGift;
