// src/components/modal/SupplierModal.tsx

import { GenericLookupModal } from "@/components/modal/GenericLookupModal";

import { supplierColumns, type SupplierRows } from "@/configs/supplierConfig";

export interface SupplierSelection {
  code: string;
  name: string;
  row: SupplierRows;
}

export interface SupplierModalProps {
  show: boolean;
  onClose: () => void;

  /**
   * Mengirim supplier yang dipilih
   * kepada komponen pemanggil.
   */
  onSelect: (selection: SupplierSelection) => void;

  title?: string;
  endpoint?: string;
}

export default function SupplierModal({
  show,
  onClose,
  onSelect,
  title = "Pilih Supplier",
  endpoint = "/api/daftar-supplier",
}: SupplierModalProps) {
  const resolvedEndpoint = `${endpoint}`;

  const filterFn = (item: SupplierRows, keyword: string): boolean => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    const kode = item.hgb_kodesupplier?.trim().toLowerCase() ?? "";

    const nama = item.sup_namasupplier?.trim().toLowerCase() ?? "";

    return kode.includes(normalizedKeyword) || nama.includes(normalizedKeyword);
  };

  const handleSelect = (row: SupplierRows) => {
    const code = row.hgb_kodesupplier?.trim() ?? "";

    const name = row.sup_namasupplier?.trim() ?? "";

    onSelect({
      code,
      name,
      row,
    });

    onClose();
  };

  return (
    <GenericLookupModal<SupplierRows>
      show={show}
      onClose={onClose}
      endpoint={resolvedEndpoint}
      columns={supplierColumns}
      title={title}
      onSelect={handleSelect}
      filterFn={filterFn}
      mode="client"
    />
  );
}
