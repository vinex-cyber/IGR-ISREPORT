// src/components/modal/InputKodeKasirModal.tsx

import { useFormContext } from "react-hook-form";

import {
  daftarKodeKasirColumns,
  DaftarKodeKasirRows,
} from "@/configs/input/daftar-kodekasirConfig";

import { GenericLookupModal } from "./GenericLookupModal";

export interface KasirSelection {
  kodeKasir: string;
  namaKasir: string;
}

interface Props {
  show: boolean;
  onClose: () => void;

  /**
   * Branch database.
   *
   * Jika tidak dikirim akan mengambil
   * branch dari React Hook Form.
   */
  branch?: string;

  /**
   * Judul modal.
   */
  title?: string;

  /**
   * Callback ketika kasir dipilih.
   *
   * Jika dikirim maka modal tidak akan
   * melakukan setValue().
   */
  onSelect?: (selection: KasirSelection) => void;

  /**
   * Backward compatibility.
   */
  kasir?: boolean;
}

export default function InputKodeKasirModal({
  show,
  onClose,
  branch,
  title = "Pilih Kode Kasir",
  onSelect,
  kasir,
}: Props) {
  const { setValue, watch } = useFormContext();

  const selectedBranch = branch ?? watch("branch");

  const handleSelect = (row: DaftarKodeKasirRows) => {
    const selection: KasirSelection = {
      kodeKasir: row.userid,
      namaKasir: row.username,
    };

    // Generic
    if (onSelect) {
      onSelect(selection);
      return;
    }

    // Backward compatibility
    if (kasir) {
      setValue("kasir", row.userid);
    }
  };

  const filterFn = (item: DaftarKodeKasirRows, keyword: string) => {
    const value = keyword.toLowerCase();

    return (
      item.userid?.toLowerCase().includes(value) ||
      (item.username ?? "").toLowerCase().includes(value)
    );
  };

  return (
    <GenericLookupModal<DaftarKodeKasirRows>
      show={show}
      onClose={onClose}
      endpoint={`/api/daftar-kodekasir?branch=${selectedBranch}`}
      columns={daftarKodeKasirColumns}
      title={title}
      onSelect={handleSelect}
      filterFn={filterFn}
      mode="client"
    />
  );
}
