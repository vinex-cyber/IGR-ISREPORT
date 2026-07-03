// src/components/modal/InputGiftModal.tsx

import { useEffect, useState } from "react";

import {
  daftarGiftColumns,
  type DaftarGiftRows,
} from "@/configs/input/daftar-giftConfig";

import { GenericLookupModal } from "@/components/modal/GenericLookupModal";
import { getBranchCookie } from "@/utils/branchCookie";

/**
 * Tipe nilai tanggal yang mungkin berasal
 * dari API atau database.
 */
export type GiftDateValue = string | Date | null | undefined;

/**
 * Bentuk data gift yang dikirim kepada
 * komponen InputKodeGift.
 */
export interface GiftSelection {
  code: string;
  startDate?: GiftDateValue;
  endDate?: GiftDateValue;
  row: DaftarGiftRows;
}

export interface InputGiftModalProps {
  show: boolean;
  onClose: () => void;
  onSelect: (gift: GiftSelection) => void;
  title?: string;
  endpoint?: string;
}

export default function InputGiftModal({
  show,
  onClose,
  onSelect,
  title,
  endpoint = "/api/daftar-gift",
}: InputGiftModalProps) {
  const [branch, setBranch] = useState("");

  useEffect(() => {
    setBranch(getBranchCookie());

    const timer = window.setInterval(() => {
      setBranch(getBranchCookie());
    }, 300);

    return () => clearInterval(timer);
  }, []);

  const modalTitle = title ?? `Pilih Kode Gift${branch ? ` - ${branch}` : ""}`;

  const handleSelect = (row: DaftarGiftRows) => {
    const code = String(row.gfh_kodepromosi ?? "").trim();

    if (!code) return;

    onSelect({
      code,
      startDate: row.gfh_tglawal,
      endDate: row.gfh_tglakhir,
      row,
    });
  };

  return (
    <GenericLookupModal<DaftarGiftRows>
      show={show}
      onClose={onClose}
      endpoint={endpoint}
      columns={daftarGiftColumns}
      title={modalTitle}
      onSelect={handleSelect}
    />
  );
}
