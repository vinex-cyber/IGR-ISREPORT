// hooks/useReportPage.ts

import { useState, useCallback, useMemo, useRef, useEffect } from "react";

import axiosClient from "@/lib/axiosClient";
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
  endpoint?: string;
  basePath?: string;
  reportType?: string;
  reportTitle?: string;
  searchableFields: string[];
  numericFields: string[];
  headers: string[];
  allFields: string[];
  mapRow: (row: T) => (string | number | null)[];
  enabled?: boolean;
  customFetch?: CustomFetchOptions;
  paginated?: boolean;
  defaultLimit?: number;
}

/**
 * Hook reusable untuk halaman laporan.
 *
 * Hook ini menangani:
 * - penentuan endpoint API;
 * - selectedReport;
 * - query parameter dari URL;
 * - fetch data;
 * - pencarian data;
 * - perhitungan total;
 * - refresh data;
 * - export Excel;
 * - pagination (opsional).
 *
 * Terdapat tiga cara pemakaian.
 *
 * @example
 * // 1. Endpoint tetap, tanpa selectedReport
 * useReportPage<FormSoHarianRows>({
 *   endpoint: "form-so-harian",
 *   ...config,
 * });
 *
 * @example
 * // 2. Endpoint dinamis menggunakan selectedReport dari URL
 * useReportPage<PerDivisiRows>({
 *   basePath: "evaluasi-sales",
 *   ...config,
 * });
 *
 * @example
 * // 3. Dengan pagination
 * useReportPage<PerProdukRows>({
 *   basePath: "evaluasi-sales",
 *   reportType: "per-produk",
 *   paginated: true,
 *   defaultLimit: 100,
 *   ...config,
 * });
 */
export function useReportPage<T extends object>(
  options: UseReportPageOptions<T>,
) {
  const {
    endpoint: fixedEndpoint,
    basePath,
    reportType,
    reportTitle,
    searchableFields,
    numericFields,
    headers,
    mapRow,
    allFields,
    enabled,
    customFetch,
    paginated = false, // ← default false, tidak ubah perilaku lama
    defaultLimit = 100,
  } = options;

  const routerResult = useReportQueryEndpoint({
    endpoint: fixedEndpoint,
    basePath,
    reportType,
  });

  const endpoint = customFetch?.endpoint ?? routerResult.endpoint;
  const baseQuery = customFetch?.queryParams ?? routerResult.query;

  const defaultFetchEnabled = routerResult.isReady && Boolean(endpoint);
  const fetchEnabled = customFetch
    ? (customFetch.enabled ?? Boolean(customFetch.endpoint))
    : (enabled ?? defaultFetchEnabled);

  // ── Pagination state ────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);

  // Reset ke halaman 1 ketika query berubah
  const baseQueryString = JSON.stringify(baseQuery);

  const [searchTerm, setSearchTerm] = useState("");

  // ── Query yang dikirim ke API ────────────────────────────────
  const query = useMemo(() => {
    if (!paginated) return baseQuery; // perilaku lama, tidak ada page/limit

    const q: Record<string, string> = {
      ...baseQuery,
      page: String(page),
      limit: String(limit),
    };
    if (searchTerm.trim()) {
      q.search = searchTerm.trim();
    }
    return q;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseQueryString, paginated, page, limit, searchTerm]);

  const { data, loading, error, refetch, total, totalPages, totals } = useFetchData<
    T[]
  >({
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
    reportTitle,
    paginated,
    totals,
  );

  const columns = allFields.map((field, index) => ({
    field: field as string,
    label: headers[index] ?? String(field),
    isNumeric: numericFields.includes(field),
  }));

  // ── fetchAll untuk export Excel ──────────────────────────────
  const fetchAll = useCallback(async (): Promise<Record<string, unknown>[]> => {
    if (!endpoint) return [];

    const params: Record<string, string> = {
      ...baseQuery,
      export: "true",
    };
    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
    }

    const response = await axiosClient.get(endpoint, { params });

    return response.data.data ?? [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, baseQueryString, searchTerm]);

  const { handleExport, isExporting } = useExportToExcel({
    title,
    ...(paginated ? { fetchAll } : { data: (filteredData ?? []) as Record<string, unknown>[] }),
    mapRow: (row: Record<string, unknown>) => mapRow(row as T).map((cell) => cell ?? ""),
    totalRow,
    columns,
  });

  // ── Reset page ketika filter/query berubah ───────────────────
  const prevQueryRef = useRef(baseQueryString);

  useEffect(() => {
    if (prevQueryRef.current !== baseQueryString) {
      prevQueryRef.current = baseQueryString;
      setPage(1);
    }
  }, [baseQueryString]);

  // Reset ke halaman 1 saat pencarian berubah (hanya mode paginated)
  useEffect(() => {
    if (paginated) {
      setPage(1);
    }
  }, [searchTerm, paginated]);

  return {
    // ── Yang sudah ada (tidak berubah) ───────────────────────
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

    // ── Tambahan pagination ──────────────────────────────────
    page,
    setPage,
    limit,
    setLimit,
    total,
    totalPages,
    isExporting,
  };
}
