import { useState } from "react";
import FormInput from "../FormInput";
import { Search } from "lucide-react";
import InputProdukModal from "../modal/InputProdukModal";
import { useFormContext } from "react-hook-form";

const InputProdukPlu = () => {
    const [supplierModal, setSupplierModal] = useState(false);
    const handleSupplierModal = () => {
        setSupplierModal(!supplierModal);
    }

    const { setValue, getValues } = useFormContext();

    const formatPrdcdGrup = (value: string) => {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== "")
            .map((item) => {
                let formatted = item.padStart(7, "0");
                if (formatted[6] !== "0") {
                    formatted = formatted.slice(0, 6) + "0";
                }
                return formatted;
            })
            .join(",");
    };

    const handleBlur = () => {
        const currentValue = getValues("prdcd");

        const formatted = formatPrdcdGrup(currentValue || "");

        setValue("prdcd", formatted); // ✅ TANPA {}
    };

    return (
        <>
            <FormInput
                name="prdcd"
                placeholder="Input Plu"
                iconRight={<Search className="w-4 h-4" />}
                onBlur={handleBlur}
                onIconClick={handleSupplierModal}
            />

            <InputProdukModal show={supplierModal} onClose={handleSupplierModal} prdcd />
        </>
    )
}

export default InputProdukPlu