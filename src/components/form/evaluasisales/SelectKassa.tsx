import { Controller, Control } from "react-hook-form";
import SelectType from "@/components/SelectType";
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk";

type SelectKassaProps = {
  control: Control<FilterDetailStrukInput>;
  placeholder?: string;
};

const SelectKassa = ({
  control,
  placeholder = "All Kassa",
}: SelectKassaProps) => {
  const memberOptions = [
    { label: "All Kassa", value: "__all__" }, // ✅ Tambahkan opsi 'semua'
    { label: "Non Kss", value: "non-kss" },
    { label: "Only Kss", value: "only-kss" },
  ];

  return (
    <Controller
      control={control}
      name="kasirType"
      render={({ field }) => (
        <SelectType
          value={field.value || "__all__"} // ✅ tampilkan "__all__" jika kosong
          onChange={(val) => field.onChange(val === "__all__" ? "" : val)} // ✅ ubah "__all__" jadi ""
          options={memberOptions}
          placeholder={placeholder}
        />
      )}
    />
  );
};

export default SelectKassa;
