import { formatNumber } from "@/utils/formatNumber";
import React from "react";

interface Column<T> {
  field: keyof T;
  label: string;
  isNumeric?: boolean;
  group?: string; // Optional group for header grouping
}

interface ReportTableProps<T> {
  columns: Column<T>[];
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
}

/**
 * ReportTable Component
 * @param columns - Array of column definitions
 * @param data - Array of data objects to display
 * @param totalRow - Object or array representing the total row values
 * @param renderHeaderGroup - Optional React component to render the header group
 * @param keyField - Optional field to use as the key for each row
 * @param renderActions - Optional function to render actions for each row
 * @param actionHeaderLabel - Optional label for the actions header
 * @param showRowNumber - Optional flag to show row number column
 * @param textHeader - Optional text size for header
 * @param textBody - Optional text size for body
 * @param textFooter - Optional text size for footer
 * @param isRefreshing - Optional flag to indicate if the table is refreshing
 * @returns {JSX.Element} - The ReportTable component
 */

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
}: ReportTableProps<T>) {
  const isArrayTotal = Array.isArray(totalRow);

  // 🔥 CENTRALIZED COLUMN COUNT
  const extraColumns = (showRowNumber ? 1 : 0) + (renderActions ? 1 : 0);

  const totalColumns = columns.length + extraColumns;

  const firstNumericIndex = columns.findIndex((col) => col.isNumeric);

  return (
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
                  <td key={colIdx} className="border px-2 py-2 ">
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
                    {rowIndex + 1}
                  </td>
                )}

                {columns.map((col) => (
                  <td
                    key={String(col.field)}
                    className={`border px-2 py-2 ${
                      col.isNumeric ? "text-right" : ""
                    }`}>
                    {col.isNumeric
                      ? formatNumber(Number(row[col.field]))
                      : String(row[col.field] ?? "")}
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
                {/* 🔥 TOTAL LABEL */}
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

                {/* 🔥 NUMERIC VALUES */}
                {columns.map((col, idx) => {
                  if (!col.isNumeric) return null;

                  const value = isArrayTotal
                    ? (totalRow as (string | number)[])[idx]
                    : (totalRow as T)[col.field];

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

                {/* 🔥 KOLOM NON-NUMERIC SETELAH NUMERIC */}
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

                {/* 🔥 ACTION */}
                {renderActions && (
                  <td className="border px-2 py-2 bg-blue-400 dark:bg-gray-400" />
                )}
              </tr>
            ) : null)}
        </tfoot>
      </table>
    </div>
  );
}
