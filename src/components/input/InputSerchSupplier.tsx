import { useState } from "react";
import FormInput from "../FormInput";
import { Search } from "lucide-react";
import SupplierModal from "../modal/SupplierModal";

const InputSerchSupplier = () => {
    const [supplierModal, setSupplierModal] = useState(false);
    const handleSupplierModal = () => {
        setSupplierModal(!supplierModal);
    }

    return (
        <>
            <FormInput
                name="kodeSupplier"
                placeholder="Kode Supplier"
                iconRight={<Search className="w-4 h-4" />}
                onIconClick={handleSupplierModal}
            />

            <SupplierModal show={supplierModal} onClose={handleSupplierModal} kodeSupplier />
        </>
    )
}

export default InputSerchSupplier