import { Controller, Control } from "react-hook-form";
import SelectType from "@/components/SelectType";
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk";

type SelectMethodeProps = {
  control: Control<FilterDetailStrukInput>;
  placeholder?: string;
};

const SelectMethode = ({
  control,
  placeholder = "All Methode",
}: SelectMethodeProps) => {
  const methodeOptions = [
    { label: "All Methode", value: "__all__" }, // ✅ Tambahkan opsi 'semua'
    { label: "Kum Mandiri", value: "kum" },
    { label: "Virtual", value: "virtual" },
  ];

  return (
    <Controller
      control={control}
      name="methodType"
      render={({ field }) => (
        <SelectType
          value={field.value || "__all__"} // ✅ tampilkan "__all__" jika kosong
          onChange={(val) => field.onChange(val === "__all__" ? "" : val)} // ✅ ubah "__all__" jadi ""
          options={methodeOptions}
          placeholder={placeholder}
        />
      )}
    />
  );
};

export default SelectMethode;
