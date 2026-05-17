
import { daftarMonitoringpluColumns, DaftarMonitoringpluRows } from "@/configs/input/daftar-monitoringpluConfig";
import { useFormContext } from "react-hook-form";
import { GenericLookupModal } from "./GenericLookupModal";

/**
 * =========================================
 * 🧩 COMPONENT: Inputmonitoringplu
 * =========================================
 * 
 * 📍 Path: src/components/modal/Inputmonitoringplu.tsx
 * 🧩 Type: Client Component (interactive)
 * 🏷️  CSS Class: inputmonitoringplu
 * 
 * 📌 Tips:
 * - "use client" wajib untuk useState, useEffect, onClick, dll
 * - Gunakan clsx/tailwind-merge untuk conditional classes
 * - Extract logic kompleks ke custom hooks
 */

// 🔥 Props Interface

interface Props {
  show: boolean;
  onClose: () => void;
  kodeMonitoringPlu?: boolean
}

export default function InputMonitoringPluModal({ show, onClose, kodeMonitoringPlu }: Props) {
  const { setValue, watch } = useFormContext();
  // 🔥 ambil branch dari form
  const branch = watch("branch");

  const filterFn = (item: DaftarMonitoringpluRows, keyword: string) => {
    const kodemonitoring = item.kodemonitoring?.toLowerCase() || "";

    return kodemonitoring.includes(keyword)
  }

  const onSelect = (row: DaftarMonitoringpluRows) => {
    if (kodeMonitoringPlu) {
      setValue("kodeMonitoringPlu", row.kodemonitoring);
    }
  }
  return (
    <GenericLookupModal<DaftarMonitoringpluRows>
      show={show}
      onClose={onClose}
      endpoint={`/api/daftar-monitoringplu?branch=${branch}`}
      columns={daftarMonitoringpluColumns}
      title="Pilih Monitoring PLU"

      onSelect={onSelect}

      filterFn={filterFn}
    />
  );
}