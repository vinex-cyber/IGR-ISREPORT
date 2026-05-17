// CardProduk.tsx
import { CardContent, CardFieldset, CardTitleLegend } from "@/components/ui/card";
import FormInput from "@/components/FormInput";
import { Control } from "react-hook-form";
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk";
import SelectDivisi from "./SelectDivisi";
import SelectDepartement from "@/components/form/evaluasisales/SelectDepartement";
import Selectkategori from "./Selectkategori";
import SelectTag from "./SelectTag";
import InputProdukPlu from "@/components/input/InputProdukPlu";
import InputNamaProduk from "@/components/input/InputNamaProduk";
import InputMonitoringPlu from "@/components/input/InputMonitoringPlu";

type CardProdukProps = {
    control: Control<FilterDetailStrukInput>;
};

const CardProduk = ({ control }: CardProdukProps) => {

    return (
        <CardFieldset className="relative border rounded-lg shadow">
            <CardTitleLegend className="text-md font-semibold mx-6 px-2">
                Produk
            </CardTitleLegend>
            <CardContent className="space-y-2">
                <InputProdukPlu />
                <InputNamaProduk />
                <FormInput name="barcode" placeholder="Barcode" />
                <InputMonitoringPlu />
                <SelectDivisi control={control} />
                <SelectDepartement control={control} />
                <Selectkategori control={control} />
                <SelectTag control={control} />
            </CardContent>
        </CardFieldset>
    );
};

export default CardProduk;
