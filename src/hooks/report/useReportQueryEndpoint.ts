// hooks/useReportQueryEndpoint.ts

import { useRouter } from "next/router";

type QueryValue = string | string[] | undefined;

interface UseReportQueryEndpointOptions {
  /**
   * Digunakan ketika endpoint mengikuti selectedReport.
   * Contoh: evaluasi-sales/per-divisi
   */
  basePath?: string;

  /**
   * Digunakan untuk endpoint yang sudah pasti.
   * Contoh: laporan-stok
   */
  endpoint?: string;

  /**
   * Fallback apabila selectedReport tidak ada di URL.
   * Contoh: per-divisi
   */
  reportType?: string;
}

interface UseReportQueryEndpointResult {
  endpoint: string;
  query: Record<string, string>;
  selectedReport: string;
  isReady: boolean;
}

const getQueryValue = (value: QueryValue): string => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
};

export const useReportQueryEndpoint = ({
  basePath,
  endpoint,
  reportType,
}: UseReportQueryEndpointOptions): UseReportQueryEndpointResult => {
  const router = useRouter();

  const query = Object.entries(router.query).reduce<Record<string, string>>(
    (result, [key, value]) => {
      const normalizedValue = getQueryValue(value);

      if (normalizedValue) {
        result[key] = normalizedValue;
      }

      return result;
    },
    {},
  );

  /**
   * Prioritas:
   * 1. reportType dari halaman
   * 2. selectedReport dari URL
   */
  const selectedReport = reportType ?? query.selectedReport ?? "";

  /**
   * Jika reportType diberikan tetapi URL tidak memiliki
   * selectedReport, tambahkan ke query.
   */
  if (selectedReport) {
    query.selectedReport = selectedReport;
  }

  /**
   * Prioritas endpoint:
   * 1. endpoint langsung
   * 2. basePath + selectedReport
   */
  const resolvedEndpoint = endpoint
    ? endpoint.replace(/^\/+|\/+$/g, "")
    : basePath && selectedReport
      ? `${basePath.replace(/^\/+|\/+$/g, "")}/${selectedReport}`
      : "";

  const isReady = router.isReady && Boolean(resolvedEndpoint);

  return {
    endpoint: resolvedEndpoint,
    query,
    selectedReport,
    isReady,
  };
};
