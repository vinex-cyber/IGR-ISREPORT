// hooks/useReportPage.ts

import { useState } from "react";

import { useFetchData } from "@/hooks/useFetchData";
import { useRefreshRouter } from "@/hooks/useRefreshRouter";
import { useReportQueryEndpoint } from "@/hooks/useReportQueryEndpoint";
import { useReportTableLogic } from "@/hooks/useReportTableLogic";
import { useExportToExcel } from "@/hooks/useExportToExcel";

interface CustomFetchOptions {
  endpoint: string;
  queryParams?: Record<string, string>;
  enabled?: boolean;
}

interface UseReportPageOptions<T> {
  /**
   * Endpoint langsung tanpa awalan /api.
   * Contoh: laporan-stok
   */
  endpoint?: string;

  /**
   * Base endpoint untuk selectedReport.
   * Contoh: evaluasi-sales
   */
  basePath?: string;

  /**
   * Fallback selectedReport.
   * Contoh: per-divisi
   */
  reportType?: string;

  searchableFields: (keyof T)[];
  numericFields: (keyof T)[];
  headers: string[];
  allFields: (keyof T)[];

  mapRow: (row: T) => (string | number | null)[];

  enabled?: boolean;
  customFetch?: CustomFetchOptions;
}

export function useReportPage<T extends object>(
  options: UseReportPageOptions<T>,
) {
  const {
    endpoint: fixedEndpoint,
    basePath,
    reportType,
    searchableFields,
    numericFields,
    headers,
    mapRow,
    allFields,
    enabled,
    customFetch,
  } = options;

  /**
   * Hook selalu dipanggil.
   * Mendukung endpoint tetap maupun selectedReport.
   */
  const routerResult = useReportQueryEndpoint({
    endpoint: fixedEndpoint,
    basePath,
    reportType,
  });

  /**
   * customFetch memiliki prioritas tertinggi.
   */
  const endpoint = customFetch?.endpoint ?? routerResult.endpoint;

  const query = customFetch?.queryParams ?? routerResult.query;

  const defaultFetchEnabled = routerResult.isReady && Boolean(endpoint);

  const fetchEnabled = customFetch
    ? (customFetch.enabled ?? Boolean(customFetch.endpoint))
    : (enabled ?? defaultFetchEnabled);

  const [searchTerm, setSearchTerm] = useState("");

  const { data, loading, error, refetch } = useFetchData<T[]>({
    endpoint,
    queryParams: query,
    enabled: fetchEnabled,
  });

  const { isRefreshing, handleRefresh } = useRefreshRouter(loading, refetch);

  const { filteredData, title, periode, totalRow } = useReportTableLogic<T>(
    data ?? [],
    searchTerm,
    searchableFields,
    numericFields,
    allFields,
  );

  const columns = allFields.map((field, index) => ({
    field,
    label: headers[index] ?? String(field),
    isNumeric: numericFields.includes(field),
  }));

  const { handleExport } = useExportToExcel<T>({
    title,
    data: filteredData ?? [],
    mapRow: (row) => mapRow(row).map((cell) => cell ?? ""),
    totalRow,
    columns,
  });

  return {
    query,
    selectedReport: routerResult.selectedReport,
    endpoint,

    searchTerm,
    setSearchTerm,

    data,
    filteredData,
    loading,
    error,

    title,
    periode,
    totalRow,

    handleExport,
    isRefreshing,
    handleRefresh,
    refetch,
  };
}
