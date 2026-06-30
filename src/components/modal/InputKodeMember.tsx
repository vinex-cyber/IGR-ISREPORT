// src/components/modal/InputKodeMember.tsx

import {
  daftarMemberColumns,
  type DaftarMemberRows,
} from "@/configs/input/daftar-memberConfig";

import { GenericLookupModal } from "@/components/modal/GenericLookupModal";

export interface MemberSelection {
  kodeIgr: string;
  kodeMember: string;
  namaMember: string;
  jenisMember: string;
  row: DaftarMemberRows;
}

export interface InputKodeMemberModalProps {
  show: boolean;
  onClose: () => void;

  /**
   * Mengirim data member yang dipilih
   * kepada komponen pemanggil.
   */
  onSelect: (selection: MemberSelection) => void;

  title?: string;
  endpoint?: string;
}

export default function InputKodeMemberModal({
  show,
  onClose,
  onSelect,
  title = "Pilih Member",
  endpoint = "/api/daftar-member",
}: InputKodeMemberModalProps) {
  const resolvedEndpoint = endpoint;

  const handleSelect = (row: DaftarMemberRows) => {
    const selection: MemberSelection = {
      kodeIgr: row.cus_kodeigr?.trim() ?? "",
      kodeMember: row.cus_kodemember?.trim() ?? "",
      namaMember: row.cus_namamember?.trim() ?? "",
      jenisMember: row.jenis_member?.trim() ?? "",
      row,
    };

    onSelect(selection);
    onClose();
  };

  return (
    <GenericLookupModal<DaftarMemberRows>
      show={show}
      onClose={onClose}
      endpoint={resolvedEndpoint}
      columns={daftarMemberColumns}
      title={title}
      onSelect={handleSelect}
      mode="server"
    />
  );
}
