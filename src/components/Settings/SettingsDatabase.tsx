import { Check, Database, Settings } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import type { DatabaseOption } from "@/configs/database-options";
import { setBranchCookie } from "@/utils/branchCookie";

interface SettingsDatabaseProps {
  value: string;
  onChange: (branch: string) => void;
  options: readonly DatabaseOption[];
  menuLabel?: string;
  buttonLabel?: string;
  disabled?: boolean;
}

export default function SettingsDatabase({
  value,
  onChange,
  options,
  menuLabel = "Database",
  buttonLabel = "Pilih database",
  disabled = false,
}: SettingsDatabaseProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label={buttonLabel}
          title={buttonLabel}
          disabled={disabled}
          className="cursor-pointer">
          <Settings className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            disabled={disabled}
            className="cursor-pointer">
            <Database className="mr-2 h-4 w-4" />
            {menuLabel}
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent>
            {options.map((option) => {
              const isSelected = value === option.value;

              return (
                <DropdownMenuItem
                  key={option.value}
                  disabled={disabled}
                  onSelect={() => {
                    setBranchCookie(option.value);
                    onChange(option.value);
                  }}
                  className="flex cursor-pointer items-center justify-between">
                  <span>{option.label}</span>

                  {isSelected && <Check className="ml-2 h-4 w-4" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
