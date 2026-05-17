
import { useState } from "react";
import FormInput from "../FormInput";
import { Search } from "lucide-react";
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

const InputMonitoringPlu = () => {
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(!show);
  };

  return (
    <>
      <FormInput
        name="kodeMonitoringPlu"
        placeholder="Kode Monitoring PLU"
        iconRight={<Search className="w-4 h-4" />}
        onIconClick={handleShow}
      />
      <InputMonitoringPluModal show={show} onClose={handleShow} kodeMonitoringPlu />
    </>
  );
}

export default InputMonitoringPlu