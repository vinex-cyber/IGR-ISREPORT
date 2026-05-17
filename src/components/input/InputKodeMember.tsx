
import { Search } from "lucide-react";
import { useState } from "react";
import FormInput from "../FormInput";
import InputKodeMemberModal from "../modal/InputKodeMember";

/**
 * =========================================
 * 🧩 COMPONENT: InputKodeMember
 * =========================================
 * 
 * 📍 Path: src/components/input/InputKodeMember.tsx
 * 🧩 Type: Client Component (interactive)
 * 🏷️  CSS Class: InputKodeMember
 * 
 * 📌 Tips:
 * - "use client" wajib untuk useState, useEffect, onClick, dll
 * - Gunakan clsx/tailwind-merge untuk conditional classes
 * - Extract logic kompleks ke custom hooks
 */

// 🔥 Props Interface

/**
 * InputKodeMember Component
 */
const InputKodeMember = () => {
    // 🔥 Contoh: state untuk interaktivitas
    // const [isActive, setIsActive] = React.useState(false);
    const [show, setShow] = useState(false);

    const handleShow = () => {
        setShow(!show);
    };

    return (
        <>
            <FormInput
                name="noMember"
                placeholder="Kode Member"
                iconRight={<Search className="w-4 h-4" />}
                onIconClick={handleShow}
            />
            <InputKodeMemberModal show={show} onClose={handleShow} noMember />
        </>
    );
};

export default InputKodeMember;
