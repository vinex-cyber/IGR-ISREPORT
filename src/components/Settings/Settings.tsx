import { Control } from "react-hook-form";
import { FormField, FormItem } from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, Database, Settings } from "lucide-react";
import { FilterDetailStrukInput } from "@/schema/filterDetailStruk";

interface Props {
  control: Control<FilterDetailStrukInput>;
}

const DATABASE_OPTIONS = [
  { label: "IGR - CPG", value: "IGRCPG" },
  { label: "ICM - CPG", value: "ICMCPG" },
  { label: "SPI - CPG1I", value: "SPICPG1I" },
  { label: "SPI - CPG4L", value: "SPICPG4L" },
] as const;

export default function SettingsEvaluasiSales({ control }: Props) {
  return (
    <FormField
      control={control}
      name="branch"
      render={({ field }) => (
        <FormItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className=" hover:cursor-pointer">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="hover:cursor-pointer">
                  <Database className="mr-2 h-4 w-4" />
                  Database
                </DropdownMenuSubTrigger>

                <DropdownMenuSubContent>
                  {DATABASE_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => field.onChange(option.value)}
                      className="flex justify-between items-center hover:cursor-pointer">
                      {option.label}
                      {field.value === option.value && (
                        <Check className="ml-2 h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </FormItem>
      )}
    />
  );
}
