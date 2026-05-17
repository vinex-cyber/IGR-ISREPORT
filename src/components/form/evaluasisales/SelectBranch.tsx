import { Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FilterDetailStrukInput } from "@/schema/filterDetailStruk";

interface Props {
  control: Control<FilterDetailStrukInput>;
}

const SelectBranch = ({ control }: Props) => {
  return (
    <FormField
      control={control}
      name="branch"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Branch</FormLabel>

          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Pilih Branch" />
              </SelectTrigger>
            </FormControl>

            <SelectContent>
              <SelectItem value="IGRCPG">
                IGR - CPG
              </SelectItem>

              <SelectItem value="ICMCPG">
                ICM - CPG
              </SelectItem>

              <SelectItem value="SPICPG1I">
                SPIC - CPG1I
              </SelectItem>

              <SelectItem value="SPICPG4L">
                SPIC - CPG4L
              </SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

export default SelectBranch;