// src/components/form/evaluasisales/InputPluGrup.tsx
import { useFormContext } from "react-hook-form";
import FormInput from "@/components/FormInput";
import { formatPlu } from "@/utils/formatPlu";

const InputPluGrup = () => {
    const { setValue, getValues } = useFormContext();

    const handleBlur = () => {
        const currentValue = getValues("prdcd");

        const formatted = formatPlu(currentValue || "");

        setValue("prdcd", formatted); // ✅ TANPA {}
    };

    return (
        <FormInput
            name="prdcd"
            placeholder="PLU 0060410, 79630, 5550, 850"
            onBlur={handleBlur} // ✅ trigger format saat selesai input
        />
    );
};

export default InputPluGrup;