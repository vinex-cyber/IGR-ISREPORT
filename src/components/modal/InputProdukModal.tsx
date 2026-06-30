import {
  daftarProdukColumns,
  DaftarProdukRows,
} from "@/configs/input/daftar-produkConfig";
import { GenericLookupModal } from "./GenericLookupModal";
import { useFormContext } from "react-hook-form";

interface Props {
  show: boolean;
  onClose: () => void;
  prdcd?: boolean;
  namaBarang?: boolean;
}

export default function InputProdukModal({
  show,
  onClose,
  prdcd,
  namaBarang,
}: Props) {
  const { setValue } = useFormContext();
  // 🔥 ambil branch dari form

  const onSelect = (row: DaftarProdukRows) => {
    if (prdcd) {
      setValue("prdcd", row.prd_prdcd);
    }
    if (namaBarang) {
      setValue("namaBarang", row.prd_deskripsipanjang);
    }
  };

  return (
    <GenericLookupModal<DaftarProdukRows>
      show={show}
      onClose={onClose}
      endpoint={`/api/daftar-produk`} //
      columns={daftarProdukColumns}
      title="Pilih Produk"
      onSelect={onSelect}
    />
  );
}
