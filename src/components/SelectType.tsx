// src/components/SelectType.tsx

import { useEffect, useMemo, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface GroupedSelectOption {
  groupLabel: string;
  options: SelectOption[];
}

export interface SelectTypeProps {
  /**
   * Label yang ditampilkan di atas select.
   */
  label?: string;

  /**
   * Placeholder ketika belum ada nilai.
   *
   * @default "Pilih Opsi"
   */
  placeholder?: string;

  /**
   * Nilai select aktif.
   */
  value: string;

  /**
   * Callback ketika nilai berubah.
   */
  onChange: (value: string) => void;

  /**
   * Data pilihan, mendukung flat dan grouped.
   */
  options: Array<SelectOption | GroupedSelectOption>;

  /**
   * Menonaktifkan select.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Mengaktifkan input pencarian.
   *
   * @default false
   */
  enableSearch?: boolean;

  /**
   * Menandai select dalam kondisi error.
   *
   * @default false
   */
  error?: boolean;

  /**
   * Placeholder input pencarian.
   *
   * @default "Search..."
   */
  searchPlaceholder?: string;

  /**
   * Pesan saat data tidak ditemukan.
   *
   * @default "Data tidak ditemukan"
   */
  emptyMessage?: string;

  /**
   * Daftar value yang harus ditampilkan
   * menggunakan warna placeholder.
   *
   * @default ["", "__all__", "__ALL__"]
   */
  placeholderValues?: readonly string[];

  /**
   * Class tambahan untuk container utama.
   */
  className?: string;

  /**
   * Class tambahan untuk trigger select.
   */
  triggerClassName?: string;

  /**
   * Class tambahan untuk select content.
   */
  contentClassName?: string;

  /**
   * Callback ketika select dibuka atau ditutup.
   */
  onOpenChange?: (open: boolean) => void;
}

const DEFAULT_PLACEHOLDER_VALUES = ["", "__all__", "__ALL__"] as const;

function isGroupedOption(
  item: SelectOption | GroupedSelectOption,
): item is GroupedSelectOption {
  return "groupLabel" in item;
}

export default function SelectType({
  label,
  placeholder = "Pilih Opsi",
  value,
  onChange,
  options = [],
  disabled = false,
  enableSearch = false,
  error = false,
  searchPlaceholder = "Search...",
  emptyMessage = "Data tidak ditemukan",
  placeholderValues = DEFAULT_PLACEHOLDER_VALUES,
  className,
  triggerClassName,
  contentClassName,
  onOpenChange,
}: SelectTypeProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  /**
   * Nilai seperti "__all__" sebenarnya adalah pilihan,
   * tetapi secara tampilan diperlakukan seperti placeholder.
   */
  const isPlaceholderValue = placeholderValues.includes(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [search]);

  const filteredOptions = useMemo<
    Array<SelectOption | GroupedSelectOption>
  >(() => {
    if (!debouncedSearch) {
      return options;
    }

    return options
      .map((item) => {
        if (isGroupedOption(item)) {
          const filteredGroupOptions = item.options.filter((option) =>
            option.label.toLowerCase().includes(debouncedSearch),
          );

          if (filteredGroupOptions.length === 0) {
            return null;
          }

          return {
            ...item,
            options: filteredGroupOptions,
          };
        }

        const isMatch = item.label.toLowerCase().includes(debouncedSearch);

        return isMatch ? item : null;
      })
      .filter(
        (item): item is SelectOption | GroupedSelectOption => item !== null,
      );
  }, [debouncedSearch, options]);

  const handleValueChange = (selectedValue: string) => {
    setSearch("");
    setDebouncedSearch("");
    onChange(selectedValue);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSearch("");
      setDebouncedSearch("");
    }

    onOpenChange?.(open);
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="mb-1 block text-sm font-medium">{label}</label>
      )}

      <Select
        value={value}
        onValueChange={handleValueChange}
        onOpenChange={handleOpenChange}
        disabled={disabled}>
        <SelectTrigger
          className={cn(
            "w-full",

            /**
             * Membuat pilihan All terlihat seperti placeholder.
             */
            isPlaceholderValue && "text-muted-foreground",

            error && "border-destructive focus:ring-destructive",

            triggerClassName,
          )}
          aria-invalid={error}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent
          className={cn(
            "w-[var(--radix-select-trigger-width)] p-0",
            contentClassName,
          )}>
          {enableSearch && (
            <div className="sticky top-0 z-10 border-b bg-background p-2">
              <Input
                type="text"
                value={search}
                placeholder={searchPlaceholder}
                className="w-full"
                autoComplete="off"
                onChange={(event) => {
                  setSearch(event.target.value);
                }}
                onKeyDown={(event) => {
                  /*
                   * Mencegah keyboard event diterima
                   * oleh Radix Select saat mengetik.
                   */
                  event.stopPropagation();
                }}
              />
            </div>
          )}

          <div className="max-h-64 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((item) => {
                if (isGroupedOption(item)) {
                  return (
                    <SelectGroup key={item.groupLabel}>
                      <SelectLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                        {item.groupLabel}
                      </SelectLabel>

                      {item.options.map((option) => (
                        <SelectItem
                          key={`${item.groupLabel}-${option.value}`}
                          value={option.value}
                          disabled={option.disabled}
                          className="pl-6 text-sm">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  );
                }

                return (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    disabled={item.disabled}
                    className="text-sm font-medium">
                    {item.label}
                  </SelectItem>
                );
              })
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}
