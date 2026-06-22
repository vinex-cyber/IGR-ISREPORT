// src/components/modal/InputKodeKasirModal.tsx

import {
  daftarKodeKasirColumns,
  DaftarKodeKasirRows,
} from "@/configs/input/daftar-kodekasirConfig";
import { useFormContext } from "react-hook-form";
import { GenericLookupModal } from "./GenericLookupModal";

interface Props {
  show: boolean;
  onClose: () => void;
  kasir?: boolean;
}

export default function InputKodeKasirModal({ show, onClose, kasir }: Props) {
  const { setValue, watch } = useFormContext();
  // 🔥 ambil branch dari form
  const branch = watch("branch");

  const onSelect = (row: DaftarKodeKasirRows) => {
    if (kasir) {
      setValue("kasir", row.userid);
    }
  };

  const filterFn = (item: DaftarKodeKasirRows, keyword: string) => {
    return (
      item.userid?.toLowerCase().includes(keyword.toLowerCase()) ||
      (item.username || "").toLowerCase().includes(keyword.toLowerCase())
    );
  };

  return (
    <GenericLookupModal<DaftarKodeKasirRows>
      show={show}
      onClose={onClose}
      endpoint={`/api/daftar-kodekasir?branch=${branch}`}
      columns={daftarKodeKasirColumns}
      title="Pilih Kode Kasir"
      onSelect={onSelect}
      mode="client"
      filterFn={filterFn}
    />
  );
}
