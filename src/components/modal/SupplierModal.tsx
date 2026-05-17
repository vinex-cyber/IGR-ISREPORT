import { GenericLookupModal } from "./GenericLookupModal";
import { supplierColumns, SupplierRows } from "@/configs/supplierConfig";
import { useFormContext } from "react-hook-form";

interface Props {
    show: boolean;
    onClose: () => void;
    kodeSupplier?: boolean;
    namaSupplier?: boolean;
}

export default function SupplierModal({ show, onClose, kodeSupplier, namaSupplier }: Props) {
    const { setValue, watch } = useFormContext();
    // 🔥 ambil branch dari form
    const branch = watch("branch");

    const filterFn = (item: SupplierRows, keyword: string) => {
        const kode = item.hgb_kodesupplier?.toLowerCase() || "";
        const nama = item.sup_namasupplier?.toLowerCase() || "";

        return kode.includes(keyword) || nama.includes(keyword);
    }

    const onSelect = (row: SupplierRows) => {
        if (kodeSupplier) {
            setValue("kodeSupplier", row.hgb_kodesupplier);
        }
        if (namaSupplier) {
            setValue("namaSupplier", row.sup_namasupplier);
        }
    }
    return (
        <GenericLookupModal<SupplierRows>
            show={show}
            onClose={onClose}
            endpoint={`/api/daftar-supplier?branch=${branch}`}
            columns={supplierColumns}
            title="Pilih Supplier"

            onSelect={onSelect}
            filterFn={filterFn}
            mode="client"
        />
    );
}