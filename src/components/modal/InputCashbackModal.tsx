import { useFormContext } from "react-hook-form";
import { GenericLookupModal } from "./GenericLookupModal";

import {
  daftarCashbackColumns,
  DaftarCashbackRows,
} from "@/configs/input/daftar-cashbackConfig";

interface Props {
  show: boolean;
  onClose: () => void;
  cashback?: boolean;
}

export default function InputCashbackModal({
  show,
  onClose,
  cashback,
}: Props) {
  const { setValue, watch } = useFormContext();

  // 🔥 ambil branch dari form
  const branch = watch("branch");

  const formatDate = (
    value: string | Date | null | undefined
  ): string => {
    if (!value) return "";

    const str = value.toString();

    if (/^\d{8}$/.test(str)) {
      return `${str.slice(0, 4)}-${str.slice(
        4,
        6
      )}-${str.slice(6, 8)}`;
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) return "";

    const y = date.getFullYear();

    const m = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const d = String(
      date.getDate()
    ).padStart(2, "0");

    return `${y}-${m}-${d}`;
  };

  const onSelect = (
    row: DaftarCashbackRows
  ) => {
    if (cashback) {
      setValue(
        "cashback",
        row.cbh_kodepromosi
      );

      setValue(
        "startDate",
        formatDate(row.cbh_tglawal)
      );

      setValue(
        "endDate",
        formatDate(row.cbh_tglakhir)
      );
    }
  };

  return (
    <GenericLookupModal<DaftarCashbackRows>
      show={show}
      onClose={onClose}
      endpoint={`/api/daftar-cashback?branch=${branch}`}
      columns={daftarCashbackColumns}
      title="Pilih Kode Cashback"
      onSelect={onSelect}
    />
  );
}