// CardPromo.tsx
import InputKodeCashback from "@/components/input/Inputkodecashback";
import InputKodeGift from "@/components/input/InputKodeGift";
import { CardContent, CardFieldset, CardTitleLegend } from "@/components/ui/card";

const CardPromo = () => {

    return (
        <CardFieldset className="relative border rounded-lg shadow">
            <CardTitleLegend className="text-md font-semibold mx-6 px-2">
                Promo
            </CardTitleLegend>
            <CardContent className="space-y-2">
                <InputKodeGift />
                <InputKodeCashback />
            </CardContent>
        </CardFieldset>
    );
}

export default CardPromo