// src/components/modal/InputCashbackModal.tsx

import { GenericLookupModal } from "@/components/modal/GenericLookupModal";

import {
  daftarCashbackColumns,
  type DaftarCashbackRows,
} from "@/configs/input/daftar-cashbackConfig";

interface InputCashbackModalProps {
  show: boolean;
  onClose: () => void;
  onSelect: (row: DaftarCashbackRows) => void;
}

export default function InputCashbackModal({
  show,
  onClose,
  onSelect,
}: InputCashbackModalProps) {
  return (
    <GenericLookupModal<DaftarCashbackRows>
      show={show}
      onClose={onClose}
      endpoint={`/api/daftar-cashback`}
      columns={daftarCashbackColumns}
      title="Pilih Kode Cashback"
      onSelect={onSelect}
    />
  );
}
