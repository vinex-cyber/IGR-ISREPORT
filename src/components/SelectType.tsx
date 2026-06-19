import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";

interface Option {
  label: string;
  value: string;
}

interface GroupedOption {
  groupLabel: string;
  options: Option[];
}

interface SelectTypeProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  options: (Option | GroupedOption)[];
  disabled?: boolean;
  enableSearch?: boolean;
}

/**
 * Komponen SelectType mendukung:
 * - mode flat (list biasa)
 * - mode grouped (pakai groupLabel)
 */
const SelectType: React.FC<SelectTypeProps> = ({
  label,
  placeholder = "Pilih Opsi",
  value,
  onChange,
  options = [],
  disabled = false,
  enableSearch = false,
}) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // 🔥 FILTER
  const filteredOptions: (Option | GroupedOption)[] = options
    .map((item) => {
      if ("groupLabel" in item) {
        const filtered = item.options.filter((opt) =>
          opt.label.toLowerCase().includes(debouncedSearch.toLowerCase()),
        );

        if (filtered.length === 0) return null;

        return {
          ...item,
          options: filtered,
        };
      }

      if (item.label.toLowerCase().includes(debouncedSearch.toLowerCase())) {
        return item;
      }

      return null;
    })
    .filter((item): item is Option | GroupedOption => item !== null);

  const valueChange = (value: string) => {
    setSearch("");
    onChange(value);
  };
  return (
    <div>
      {label && <label className="block mb-1 font-medium">{label}</label>}

      <Select value={value} onValueChange={valueChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className="w-full p-0">
          {/* 🔍 SEARCH (TIDAK IKUT SCROLL) */}
          {enableSearch && (
            <div className="p-2 border-b bg-background sticky top-0 z-10">
              <Input
                type="text"
                placeholder="Search..."
                className="w-full my-2 bg-background text-foreground border-border"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}

          {/* 🔥 LIST YANG SCROLL */}
          <div className="max-h-64 overflow-y-auto">
            {filteredOptions.map((item) => {
              if ("groupLabel" in item) {
                return (
                  <SelectGroup key={item.groupLabel}>
                    <SelectLabel className="text-xs font-bold text-gray-500 px-2 py-1">
                      {item.groupLabel}
                    </SelectLabel>

                    {(item.options ?? []).map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className="pl-6 text-sm">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                );
              }

              return (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  className="font-medium">
                  {item.label}
                </SelectItem>
              );
            })}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectType;
