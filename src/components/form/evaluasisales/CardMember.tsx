// CardMember.tsx
import {
  CardContent,
  CardFieldset,
  CardTitleLegend,
} from "@/components/ui/card";
import FormInput from "@/components/FormInput";
import { Control } from "react-hook-form";
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk";
import SelectOutletMember from "../shared/SelectOutletMember";
import SelectMemberKhusus from "../shared/SelectMemberKhusus";
import SelectSubOutletMember from "../shared/SelectSubOutletMember";
import { SelectKategoriMember } from "./SelectKategoriMember";

type CardMemberProps = {
  control: Control<FilterDetailStrukInput>;
};

const CardMember = ({ control }: CardMemberProps) => {
  return (
    <CardFieldset className="relative border rounded-lg shadow">
      <CardTitleLegend className="text-md font-semibold mx-6 px-2">
        Member
      </CardTitleLegend>
      <CardContent className="space-y-2">
        <FormInput name="namaMember" placeholder="Nama Member" />
        <FormInput name="noMember" placeholder="Kode Member" />
        <FormInput
          name="kodeMonitoringMember"
          placeholder="Kode Monitoring Member"
        />
        {/* Member Khusus */}
        <SelectMemberKhusus control={control} name="memberKhusus" />
        {/* Outlet */}
        <SelectOutletMember control={control} name="outlet" />
        {/* Sub Outlet */}
        <SelectSubOutletMember
          control={control}
          name="subOutlet"
          parentName="outlet"
        />
        <SelectKategoriMember control={control} name="katMember" />
      </CardContent>
    </CardFieldset>
  );
};

export default CardMember;
