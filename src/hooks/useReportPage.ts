// hooks/useReportPage.ts

import { useState, useCallback, useMemo, useRef, useEffect } from "react";

import axiosClient from "@/lib/axiosClient";
import { useFetchData } from "@/hooks/useFetchData";
import { useRefreshRouter } from "@/hooks/useRefreshRouter";
import { useReportQueryEndpoint } from "@/hooks/useReportQueryEndpoint";
import { useReportTableLogic } from "@/hooks/useReportTableLogic";
import { useExportToExcel } from "@/hooks/useExportToExcel";

/**
 * Konfigurasi untuk mengganti proses fetch bawaan useReportPage.
 *
 * customFetch mempunyai prioritas lebih tinggi daripada:
 * - endpoint
 * - basePath
 * - reportType
 * - query dari router
 */
interface CustomFetchOptions {
  /**
   * Endpoint API khusus tanpa awalan `/api`.
   *
   * @example
   * "form-so-harian"
   *
   * @example
   * "evaluasi-sales/per-divisi"
   */
  endpoint: string;

  /**
   * Query parameter khusus yang dikirim ke endpoint.
   *
   * Ketika diisi, query dari URL/router tidak digunakan.
   *
   * @example
   * {
   *   startDate: "2026-06-21",
   *   endDate: "2026-06-21",
   *   branch: "IGRCPG"
   * }
   */
  queryParams?: Record<string, string>;

  /**
   * Menentukan apakah request boleh dijalankan.
   *
   * @default true jika endpoint tersedia
   */
  enabled?: boolean;
}

/**
 * Konfigurasi utama untuk hook useReportPage.
 */
interface UseReportPageOptions<T> {
  /**
   * Endpoint API yang sudah pasti tanpa awalan `/api`.
   */
  endpoint?: string;

  /**
   * Path utama API untuk laporan yang memiliki beberapa jenis laporan.
   */
  basePath?: string;

  /**
   * Jenis laporan tetap atau fallback untuk `selectedReport`.
   */
  reportType?: string;

  /**
   * Judul laporan.
   */
  reportTitle?: string;

  /**
   * Daftar field yang digunakan untuk pencarian global.
   */
  searchableFields: (keyof T)[];

  /**
   * Daftar field angka yang akan dihitung pada total/footer.
   */
  numericFields: (keyof T)[];

  /**
   * Judul kolom untuk export Excel.
   */
  headers: string[];

  /**
   * Seluruh field yang digunakan pada laporan dan export.
   */
  allFields: (keyof T)[];

  /**
   * Mengubah satu object data menjadi array untuk export Excel.
   */
  mapRow: (row: T) => (string | number | null)[];

  /**
   * Menentukan apakah proses fetch boleh dijalankan.
   */
  enabled?: boolean;

  /**
   * Konfigurasi fetch khusus.
   */
  customFetch?: CustomFetchOptions;

  // ── Pagination (opsional) ──────────────────────────────────

  /**
   * Aktifkan pagination.
   *
   * Jika false, semua data diambil sekaligus (perilaku lama).
   *
   * @default false
   */
  paginated?: boolean;

  /**
   * Jumlah data per halaman.
   *
   * Hanya digunakan ketika paginated=true.
   *
   * @default 100
   */
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

  // ── Query yang dikirim ke API ────────────────────────────────
  const query = useMemo(() => {
    if (!paginated) return baseQuery; // perilaku lama, tidak ada page/limit

    return {
      ...baseQuery,
      page: String(page),
      limit: String(limit),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseQueryString, paginated, page, limit]);

  const [searchTerm, setSearchTerm] = useState("");

  const { data, loading, error, refetch, total, totalPages } = useFetchData<
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
  );

  const columns = allFields.map((field, index) => ({
    field,
    label: headers[index] ?? String(field),
    isNumeric: numericFields.includes(field),
  }));

  // ── fetchAll untuk export Excel ──────────────────────────────
  const fetchAll = useCallback(async (): Promise<T[]> => {
    if (!endpoint) return [];

    const response = await axiosClient.get(endpoint, {
      params: {
        ...baseQuery,
        export: "true", // ambil semua data tanpa pagination
      },
    });

    return response.data.data ?? [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, baseQueryString]);

  const { handleExport, isExporting } = useExportToExcel<T>({
    title,
    // Kalau paginated → pakai fetchAll, kalau tidak → pakai data langsung (perilaku lama)
    ...(paginated ? { fetchAll } : { data: filteredData ?? [] }),
    mapRow: (row) => mapRow(row).map((cell) => cell ?? ""),
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
