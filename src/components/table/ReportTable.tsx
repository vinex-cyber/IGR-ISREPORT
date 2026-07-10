//src/components/table/ReportTable.tsx
import { formatNumber } from "@/utils/formatNumber";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ============================================================
// Constants
// ============================================================
const LIMIT_OPTIONS = [50, 100, 250, 500];

// ============================================================
// Types
// ============================================================
interface Column {
  field: string;
  label: string;
  isNumeric?: boolean;
  group?: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface ReportTableProps<T> {
  columns: Column[];
  data: T[];
  totalRow?: T | (string | number)[];
  customFooter?: (data: T[]) => React.ReactNode;
  headerGroups?: { name: string; span: number; color?: string }[];
  keyField?: keyof T | ((row: T) => string);
  renderActions?: (row: T) => React.ReactNode;
  actionHeaderLabel?: string;
  showRowNumber?: boolean;
  textHeader?: "xs" | "sm" | "md" | "lg" | "xl";
  textBody?: "xs" | "sm" | "md" | "lg" | "xl";
  textFooter?: "xs" | "sm" | "md" | "lg" | "xl";
  isRefreshing?: boolean;

  // ── Search & Reset (opsional) ────────────────────────────
  /**
   * Nilai search term aktif.
   * Jika diisi, search bar akan ditampilkan.
   */
  searchTerm?: string;

  /**
   * Callback ketika search term berubah.
   */
  onSearchChange?: (value: string) => void;

  /**
   * Callback ketika tombol reset ditekan.
   */
  onSearchReset?: () => void;

  /**
   * Placeholder search input.
   * @default "Cari..."
   */
  searchPlaceholder?: string;

  // ── Pagination (opsional) ────────────────────────────────
  /**
   * Halaman aktif.
   * @default 1
   */
  page?: number;

  /**
   * Jumlah data per halaman.
   * @default 100
   */
  limit?: number;

  /**
   * Total seluruh data dari server.
   * Jika diisi, pagination UI akan ditampilkan.
   */
  total?: number;

  /**
   * Total halaman dari server.
   */
  totalPages?: number;

  /**
   * Callback ketika halaman berubah.
   */
  onPageChange?: (page: number) => void;

  /**
   * Callback ketika limit berubah.
   */
  onLimitChange?: (limit: number) => void;
}

// ============================================================
// Component
// ============================================================
export function ReportTable<T extends Record<string, unknown>>({
  columns,
  data,
  totalRow,
  customFooter,
  headerGroups = [],
  keyField,
  renderActions,
  actionHeaderLabel = "Actions",
  showRowNumber = false,
  textHeader = "md",
  textBody = "sm",
  textFooter = "md",
  isRefreshing = false,
  // search
  searchTerm,
  onSearchChange,
  onSearchReset,
  searchPlaceholder = "Cari...",
  // pagination
  page = 1,
  limit = 100,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
}: ReportTableProps<T>) {
  const isArrayTotal = Array.isArray(totalRow);
  const extraColumns = (showRowNumber ? 1 : 0) + (renderActions ? 1 : 0);
  const totalColumns = columns.length + extraColumns;
  const firstNumericIndex = columns.findIndex((col) => col.isNumeric);

  const isPaginated = Boolean(
    total !== undefined && totalPages && onPageChange && onLimitChange,
  );

  const hasSearch = Boolean(onSearchChange && onSearchReset);

  const [localSearch, setLocalSearch] = useState(searchTerm ?? "");

  useEffect(function syncSearchFromProps() {
    setLocalSearch(searchTerm ?? "");
  }, [searchTerm]);

  useEffect(function debouncedSearch() {
    const t = setTimeout(() => {
      onSearchChange?.(localSearch);
    }, 300);
    return function cancelDebouncedSearch() { clearTimeout(t); };
  }, [localSearch, onSearchChange]);

  return (
    <div className="space-y-2">
      {/* ================= SEARCH & RESET ================= */}
      {hasSearch && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSearchReset}
            className="h-8 bg-red-400 hover:bg-red-500 dark:bg-red-400 dark:hover:bg-red-500 dark:hover:text-black text-white shadow hover:cursor-pointer">
            <X size={14} />
            Reset
          </Button>

          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-8 pl-8 w-56 text-sm bg-accent hover:bg-accent/80 focus:bg-accent/80 dark:bg-accent dark:hover:bg-accent/80 dark:focus:bg-accent/80"
            />
          </div>
        </div>
      )}

      {/* ================= TABLE ================= */}
      <div className="max-h-[65vh] overflow-y-auto shadow-xl rounded-md">
        <table className="min-w-full table-fixed">
          {/* ================= HEADER ================= */}
          <thead className="sticky top-0 z-10 bg-blue-400 border border-gray-400 dark:bg-gray-400">
            {/* GROUP HEADER */}
            {headerGroups && (
              <tr>
                {headerGroups.map((group, idx) => (
                  <th
                    key={idx}
                    colSpan={group.span + (showRowNumber ? 1 : 0)}
                    className={`border px-2 py-2 text-center font-bold text-white ${group.color || "bg-gray-400"}`}>
                    {group.name}
                  </th>
                ))}
              </tr>
            )}

            {/* COLUMN HEADER */}
            <tr className={`text-${textHeader}`}>
              {showRowNumber && (
                <th className="border px-2 py-2 text-center w-12">No</th>
              )}

              {columns.map((col) => (
                <th key={String(col.field)} className="border px-2 py-2">
                  {col.label}
                </th>
              ))}

              {renderActions && (
                <th className="border px-2 py-2 text-center">
                  {actionHeaderLabel}
                </th>
              )}
            </tr>
          </thead>

          {/* ================= BODY ================= */}
          <tbody className="text-sm bg-white dark:bg-gray-800">
            {isRefreshing ? (
              Array.from({ length: 5 }).map((_, rowIdx) => (
                <tr key={`skeleton-${rowIdx}`}>
                  {Array.from({ length: totalColumns }).map((_, colIdx) => (
                    <td key={colIdx} className="border px-2 py-2">
                      <div className="h-4 bg-gray-200 animate-pulse rounded" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={totalColumns} className="text-center py-4">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={
                    keyField
                      ? typeof keyField === "function"
                        ? keyField(row)
                        : String(row[keyField])
                      : rowIndex
                  }
                  className={`text-${textBody} hover:bg-gray-50 dark:hover:text-black dark:hover:bg-gray-300 cursor-pointer`}>
                  {showRowNumber && (
                    <td className="border px-2 py-2 text-center">
                      {(page - 1) * limit + rowIndex + 1}
                    </td>
                  )}

                  {columns.map((col) => (
                    <td
                      key={String(col.field)}
                      className={`border px-2 py-2 ${
                        col.isNumeric ? "text-right" : ""
                      }`}>
                      {col.render
                        ? col.render(row[col.field as keyof T], row)
                        : col.isNumeric
                          ? row[col.field as keyof T] != null
                            ? formatNumber(Number(row[col.field as keyof T]))
                            : ""
                          : String(row[col.field as keyof T] ?? "")}
                    </td>
                  ))}

                  {renderActions && (
                    <td className="border px-2 py-2 text-center">
                      {renderActions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>

          {/* ================= FOOTER ================= */}
          <tfoot className="sticky bottom-0 z-10">
            {!isRefreshing &&
              data.length > 0 &&
              (customFooter ? (
                customFooter(data)
              ) : totalRow ? (
                <tr className={`font-semibold bg-white text-${textFooter}`}>
                  {/* TOTAL LABEL */}
                  <td
                    colSpan={
                      (showRowNumber ? 1 : 0) +
                      (firstNumericIndex >= 0
                        ? firstNumericIndex
                        : columns.length)
                    }
                    className="border px-2 py-2 text-center bg-blue-400 font-bold dark:bg-gray-400">
                    TOTAL
                  </td>

                  {/* NUMERIC VALUES */}
                  {columns.map((col, idx) => {
                    if (!col.isNumeric) return null;

                    const value = isArrayTotal
                      ? (totalRow as (string | number)[])[idx]
                      : (totalRow as T)[col.field as keyof T];

                    return (
                      <td
                        key={`num-${String(col.field)}`}
                        className="border px-2 py-2 text-right bg-blue-400 dark:bg-gray-400">
                        {typeof value === "number"
                          ? formatNumber(value)
                          : String(value ?? "")}
                      </td>
                    );
                  })}

                  {/* KOLOM NON-NUMERIC SETELAH NUMERIC */}
                  {columns
                    .slice(
                      firstNumericIndex +
                        columns.filter((c) => c.isNumeric).length,
                    )
                    .map((col) => (
                      <td
                        key={`empty-${String(col.field)}`}
                        className="border px-2 py-2 bg-blue-400 dark:bg-gray-400"
                      />
                    ))}

                  {/* ACTION */}
                  {renderActions && (
                    <td className="border px-2 py-2 bg-blue-400 dark:bg-gray-400" />
                  )}
                </tr>
              ) : null)}
          </tfoot>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      {isPaginated && (
        <div className="flex items-center justify-between text-sm">
          {/* Limit selector + info total */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Tampilkan</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange?.(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm">
              {LIMIT_OPTIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <span className="text-muted-foreground">
              data — Total <strong>{total?.toLocaleString()}</strong> baris
            </span>
          </div>

          {/* Navigator halaman */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isRefreshing}
              onClick={() => onPageChange?.(page - 1)}>
              <ChevronLeft size={16} />
              Prev
            </Button>

            <span className="px-2">
              Hal <strong>{page}</strong> / <strong>{totalPages}</strong>
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= (totalPages ?? 1) || isRefreshing}
              onClick={() => onPageChange?.(page + 1)}>
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
