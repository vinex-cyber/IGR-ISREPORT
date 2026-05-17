// src/components/modal/InputGiftModal.tsx

import { daftarGiftColumns, DaftarGiftRows } from "@/configs/input/daftar-giftConfig";
import { useFormContext } from "react-hook-form";
import { GenericLookupModal } from "./GenericLookupModal";

interface Props {
  show: boolean;
  onClose: () => void;
  kodeGift?: boolean;
}

export default function InputGiftModal({ show, onClose, kodeGift }: Props) {
  const { setValue, watch } = useFormContext();
  // 🔥 ambil branch dari form
  const branch = watch("branch");

  // 🔥 formatter tetap dipakai
  const formatDate = (value: string | Date | null | undefined): string => {
    if (!value) return "";

    const str = value.toString();

    // format 20260401 → 2026-04-01
    if (/^\d{8}$/.test(str)) {
      return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`;
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) return "";

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
  };

  const onSelect = (row: DaftarGiftRows) => {
    if (kodeGift) {
      setValue("kodeGift", row.gfh_kodepromosi);
      setValue("startDate", formatDate(row.gfh_tglawal));
      setValue("endDate", formatDate(row.gfh_tglakhir));
    }
  };

  return (
    <GenericLookupModal<DaftarGiftRows>
      show={show}
      onClose={onClose}
      endpoint={`/api/daftar-gift?branch=${branch}`}
      columns={daftarGiftColumns}
      title="Pilih Kode Gift"
      onSelect={onSelect}
    />
  );
}


// import { daftarGiftColumns, DaftarGiftRows } from "@/configs/input/daftar-giftConfig";
// import React from "react";
// import { useFormContext } from "react-hook-form";
// import { GenericLookupModal } from "./GenericLookupModal";

// /**
//  * =========================================
//  * 🧩 COMPONENT: Inputgiftmodal
//  * =========================================
//  * 
//  * 📍 Path: src/components/modal/Inputgiftmodal.tsx
//  * 🧩 Type: Client Component (interactive)
//  * 🏷️  CSS Class: inputgiftmodal
//  * 
//  * 📌 Tips:
//  * - "use client" wajib untuk useState, useEffect, onClick, dll
//  * - Gunakan clsx/tailwind-merge untuk conditional classes
//  * - Extract logic kompleks ke custom hooks
//  */

// // 🔥 Props Interface
// interface Props {
//   show: boolean;
//   onClose: () => void;
//   kodeGift?: boolean;
// }

// export default function InputGiftModal({ show, onClose, kodeGift }: Props) {
//   const { setValue } = useFormContext();

//   const filterFn = (item: DaftarGiftRows, keyword: string) => {
//     const kodeGift = item.gfh_kodepromosi?.toLowerCase() || "";
//     const namaGift = item.gfh_namapromosi?.toLowerCase() || "";
//     return kodeGift.includes(keyword) || namaGift.includes(keyword);
//   }

//   const formatDate = (value: string | Date | null | undefined) => {
//     if (!value) return "";

//     const str = value.toString();

//     // kalau format 20260401 → ubah ke 2026-04-01
//     if (/^\d{8}$/.test(str)) {
//       return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`;
//     }

//     const date = new Date(value);
//     if (isNaN(date.getTime())) return "";

//     const y = date.getFullYear();
//     const m = String(date.getMonth() + 1).padStart(2, "0");
//     const d = String(date.getDate()).padStart(2, "0");

//     return `${y}-${m}-${d}`;
//   };

//   const onSelect = (row: DaftarGiftRows) => {

//     if (kodeGift) {
//       setValue("kodeGift", row.gfh_kodepromosi);
//       setValue("startDate", formatDate(row.gfh_tglawal));
//       setValue("endDate", formatDate(row.gfh_tglakhir));
//     }
//   };

//   return (
//     <GenericLookupModal<DaftarGiftRows>
//       show={show}
//       onClose={onClose}
//       endpoint="/daftar-gift"
//       columns={daftarGiftColumns}
//       title="Pilih Kode Gift"


//       onSelect={onSelect}

//       filterFn={filterFn}
//     />
//   );
// }