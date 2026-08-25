import { useState, useMemo, useRef, useEffect, useCallback } from "react";

import { useFetchData } from "@/hooks/data/useFetchData";
import { useReportQueryEndpoint } from "@/hooks/report/useReportQueryEndpoint";
import { useReportTableLogic } from "@/hooks/report/useReportTableLogic";
import { useTotalRow } from "@/hooks/report/useTotalRow";
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
    paginated = false,
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

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);

  const baseQueryString = JSON.stringify(baseQuery);

  const [searchTerm, setSearchTerm] = useState("");

  // ── Query ke API: selalu export=true biar dapet semua data ──
  const query = useMemo(() => {
    if (!paginated) return baseQuery as Record<string, string>;
    return { ...baseQuery, export: "true" } as Record<string, string>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseQueryString, paginated]);

  const { data, loading, error, refetch } = useFetchData<T[]>({
    endpoint,
    queryParams: query,
    enabled: fetchEnabled,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
  }, [refetch]);

  useEffect(function syncRefreshingState() {
    if (!loading) {
      setIsRefreshing(false);
    }
  }, [loading]);

  // ── Client-side filter (dari semua data) ────────────────────
  const {
    filteredData: fullFiltered,
    title,
    periode,
    totalRow,
  } = useReportTableLogic<T>(
    data ?? [],
    searchTerm,
    searchableFields,
    numericFields,
    allFields,
    reportTitle,
    false,
    undefined,
  );

  // ── Client-side pagination ──────────────────────────────────
  const displayData = useMemo(() => {
    if (!fullFiltered) return undefined;
    if (!paginated) return fullFiltered;
    const start = (page - 1) * limit;
    return fullFiltered.slice(start, start + limit);
  }, [fullFiltered, paginated, page, limit]);

  const clientTotal = fullFiltered?.length ?? 0;
  const clientTotalPages = paginated ? Math.ceil(clientTotal / limit) : 1;

  const columns = allFields.map((field, index) => ({
    field: field as string,
    label: headers[index] ?? String(field),
    isNumeric: numericFields.includes(field),
  }));

  // ── Total untuk export (dari raw data, tanpa filter search) ──
  const exportTotalRow = useTotalRow(
    data ?? undefined,
    searchableFields,
    numericFields,
    allFields,
  );

  // ── Export: pakai raw data ────────────────────────────────────
  const { handleExport, isExporting } = useExportToExcel({
    title,
    data: (data ?? []) as Record<string, unknown>[],
    mapRow: (row: Record<string, unknown>) =>
      mapRow(row as T).map((cell) => cell ?? ""),
    totalRow: exportTotalRow.length > 0 ? exportTotalRow : undefined,
    columns,
  });

  // ── Reset page ketika filter/query berubah ───────────────────
  const prevQueryRef = useRef(baseQueryString);

  useEffect(function resetPageOnFilterChange() {
    if (prevQueryRef.current !== baseQueryString) {
      prevQueryRef.current = baseQueryString;
      setPage(1);
    }
  }, [baseQueryString]);

  useEffect(function resetPageOnSearch() {
    if (paginated) {
      setPage(1);
    }
  }, [searchTerm, paginated]);

  return {
    query,
    selectedReport: routerResult.selectedReport,
    endpoint,
    searchTerm,
    setSearchTerm,
    data,
    filteredData: displayData,
    loading,
    error,
    title,
    periode,
    totalRow,
    handleExport,
    isRefreshing,
    handleRefresh,
    refetch,

    page,
    setPage,
    limit,
    setLimit,
    total: clientTotal,
    totalPages: clientTotalPages,
    isExporting,
  };
}
