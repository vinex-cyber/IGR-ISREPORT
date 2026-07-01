// src/components/modal/InputGiftModal.tsx

import {
  daftarGiftColumns,
  type DaftarGiftRows,
} from "@/configs/input/daftar-giftConfig";

import { GenericLookupModal } from "@/components/modal/GenericLookupModal";

/**
 * Tipe nilai tanggal yang mungkin berasal
 * dari API atau database.
 */
export type GiftDateValue = string | Date | null | undefined;

/**
 * Bentuk data gift yang dikirim kepada
 * komponen InputKodeGift.
 *
 * Modal tidak lagi mengubah nilai form secara langsung.
 */
export interface GiftSelection {
  /**
   * Kode promosi gift.
   */
  code: string;

  /**
   * Tanggal awal periode gift.
   */
  startDate?: GiftDateValue;

  /**
   * Tanggal akhir periode gift.
   */
  endDate?: GiftDateValue;

  /**
   * Data asli yang dipilih dari modal.
   *
   * Dapat digunakan apabila komponen induk
   * membutuhkan informasi lain dari row.
   */
  row: DaftarGiftRows;
}

export interface InputGiftModalProps {
  /**
   * Menampilkan atau menyembunyikan modal.
   */
  show: boolean;

  /**
   * Callback untuk menutup modal.
   */
  onClose: () => void;

  /**
   * Callback ketika row gift dipilih.
   */
  onSelect: (gift: GiftSelection) => void;

  /**
   * Judul modal.
   *
   * @default "Pilih Kode Gift"
   */
  title?: string;

  /**
   * Endpoint API daftar gift.
   *
   * Query parameter branch akan ditambahkan
   * secara otomatis.
   *
   * @default "/api/daftar-gift"
   */
  endpoint?: string;
}

export default function InputGiftModal({
  show,
  onClose,
  onSelect,
  title = "Pilih Kode Gift",
  endpoint = "/api/daftar-gift",
}: InputGiftModalProps) {
  const resolvedEndpoint = endpoint;

  const handleSelect = (row: DaftarGiftRows) => {
    const code = String(row.gfh_kodepromosi ?? "").trim();

    if (!code) {
      return;
    }

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
      endpoint={resolvedEndpoint}
      columns={daftarGiftColumns}
      title={title}
      onSelect={handleSelect}
    />
  );
}
