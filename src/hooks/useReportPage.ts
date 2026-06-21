// hooks/useReportPage.ts

import { useState } from "react";

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
   *
   * Gunakan `endpoint` untuk laporan yang tidak memerlukan
   * pemilihan `selectedReport`.
   *
   * @example
   * useReportPage<FormSoHarianRows>({
   *   endpoint: "form-so-harian",
   *   ...config,
   * });
   *
   * Request akhirnya:
   * `/api/form-so-harian`
   *
   * Jangan digunakan bersamaan dengan `basePath`
   * kecuali memang diperlukan.
   */
  endpoint?: string;

  /**
   * Path utama API untuk laporan yang memiliki beberapa jenis laporan.
   *
   * `basePath` akan digabungkan dengan:
   * - `selectedReport` dari URL; atau
   * - `reportType` sebagai fallback.
   *
   * @example
   * basePath: "evaluasi-sales"
   *
   * Jika selectedReport adalah "per-divisi",
   * endpoint menjadi:
   * `evaluasi-sales/per-divisi`
   *
   * Request akhirnya:
   * `/api/evaluasi-sales/per-divisi`
   */
  basePath?: string;

  /**
   * Jenis laporan tetap atau fallback untuk `selectedReport`.
   *
   * Gunakan ini ketika halaman sudah mengetahui jenis laporannya,
   * tetapi Anda tetap ingin mendukung selectedReport.
   *
   * @example
   * useReportPage<PerDivisiRows>({
   *   basePath: "evaluasi-sales",
   *   reportType: "per-divisi",
   *   ...config,
   * });
   *
   * Endpoint akhirnya:
   * `evaluasi-sales/per-divisi`
   */
  reportType?: string;

  /**
   * Daftar field yang digunakan untuk pencarian global.
   *
   * @example
   * searchableFields: [
   *   "prdcd",
   *   "nama_barang",
   * ]
   */
  searchableFields: (keyof T)[];

  /**
   * Daftar field angka yang akan dihitung pada total/footer.
   *
   * @example
   * numericFields: [
   *   "total_qty",
   *   "total_netto",
   *   "total_margin",
   * ]
   */
  numericFields: (keyof T)[];

  /**
   * Judul kolom untuk export Excel.
   *
   * Urutan headers harus sama dengan urutan `allFields`.
   *
   * @example
   * headers: [
   *   "PLU",
   *   "Nama Barang",
   *   "Total Qty",
   * ]
   */
  headers: string[];

  /**
   * Seluruh field yang digunakan pada laporan dan export.
   *
   * Urutannya harus sama dengan `headers`.
   *
   * @example
   * allFields: [
   *   "prdcd",
   *   "nama_barang",
   *   "total_qty",
   * ]
   */
  allFields: (keyof T)[];

  /**
   * Mengubah satu object data menjadi array untuk export Excel.
   *
   * @example
   * mapRow: (row) => [
   *   row.prdcd,
   *   row.nama_barang,
   *   row.total_qty,
   * ]
   */
  mapRow: (row: T) => (string | number | null)[];

  /**
   * Menentukan apakah proses fetch boleh dijalankan.
   *
   * Jika tidak diisi, fetch dijalankan ketika:
   * - router sudah siap;
   * - endpoint tersedia.
   *
   * @example
   * enabled: Boolean(branch)
   */
  enabled?: boolean;

  /**
   * Konfigurasi fetch khusus.
   *
   * Jika digunakan, `customFetch` akan menggantikan endpoint
   * dan query bawaan dari useReportQueryEndpoint.
   *
   * @example
   * customFetch: {
   *   endpoint: "produk/detail",
   *   queryParams: {
   *     prdcd: "1234560",
   *     branch: "IGRCPG",
   *   },
   *   enabled: true,
   * }
   */
  customFetch?: CustomFetchOptions;
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
 * - export Excel.
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
 * // 3. Endpoint dengan reportType sebagai fallback
 * useReportPage<PerDivisiRows>({
 *   basePath: "evaluasi-sales",
 *   reportType: "per-divisi",
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
    searchableFields,
    numericFields,
    headers,
    mapRow,
    allFields,
    enabled,
    customFetch,
  } = options;

  /**
   * Mendapatkan endpoint dan query berdasarkan:
   * - endpoint tetap;
   * - basePath;
   * - reportType;
   * - selectedReport dari URL.
   */
  const routerResult = useReportQueryEndpoint({
    endpoint: fixedEndpoint,
    basePath,
    reportType,
  });

  /**
   * Urutan prioritas endpoint:
   * 1. customFetch.endpoint
   * 2. endpoint dari useReportQueryEndpoint
   */
  const endpoint = customFetch?.endpoint ?? routerResult.endpoint;

  /**
   * Urutan prioritas query:
   * 1. customFetch.queryParams
   * 2. query dari router
   */
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
    /**
     * Query parameter yang digunakan untuk mengambil data.
     */
    query,

    /**
     * selectedReport dari URL atau reportType fallback.
     */
    selectedReport: routerResult.selectedReport,

    /**
     * Endpoint akhir yang digunakan useFetchData.
     */
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
