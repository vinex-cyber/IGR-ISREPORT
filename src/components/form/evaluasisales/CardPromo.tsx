// CardPromo.tsx
import InputKodeCashbackModal from "@/components/input/Inputkodecashback";
import InputKodeGift from "@/components/input/InputKodeGift";
import {
  CardContent,
  CardFieldset,
  CardTitleLegend,
} from "@/components/ui/card";
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk";

const CardPromo = () => {
  return (
    <CardFieldset className="relative border rounded-lg shadow">
      <CardTitleLegend className="text-md font-semibold mx-6 px-2">
        Promo
      </CardTitleLegend>
      <CardContent className="space-y-2">
        <InputKodeGift<FilterDetailStrukInput>
          name="kodeGift"
          startDateName="startDate"
          endDateName="endDate"
          branchName="branch"
        />
        <InputKodeCashbackModal<FilterDetailStrukInput>
          name="cashback"
          branchName="branch"
          startDateName="startDate"
          endDateName="endDate"
        />
      </CardContent>
    </CardFieldset>
  );
};

export default CardPromo;
