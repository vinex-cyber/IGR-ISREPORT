
import { Search } from "lucide-react";
import FormInput from "../FormInput";
import { useState } from "react";
import InputCashbackModal from "../modal/InputCashbackModal";
/**
 * =========================================
 * 🧩 COMPONENT: Inputkodecashback
 * =========================================
 * 
 * 📍 Path: src/components/input/Inputkodecashback.tsx
 * 🧩 Type: Client Component (interactive)
 * 🏷️  CSS Class: inputkodecashback
 * 
 * 📌 Tips:
 * - "use client" wajib untuk useState, useEffect, onClick, dll
 * - Gunakan clsx/tailwind-merge untuk conditional classes
 * - Extract logic kompleks ke custom hooks
 */


// 🔥 Props Interface

/**
 * Inputkodecashback Component
 */
const InputKodeCashback = () => {
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(!show);
  };

  return (
    <>
      <FormInput
        name="cashback"
        placeholder="Kode Cashback"
        iconRight={<Search className="w-4 h-4" />}
        onIconClick={handleShow}
      />
      <InputCashbackModal show={show} onClose={handleShow} cashback />
    </>
  );
};

export default InputKodeCashback;
