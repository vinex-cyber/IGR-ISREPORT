// hooks/useReportTableLogic.ts

import { useRouter } from "next/router";

import { useFilteredData } from "@/hooks/useFilteredData";
import { useTitleFromQuery } from "./useTitleFromQuery";
import { useTotalRow } from "./useTotalRow";

import { FormatTanggal } from "@/utils/formatTanggal";

export const useReportTableLogic = <T extends object>(
  data: T[] | undefined,
  searchTerm: string,
  excludeTotalFields: string[],
  totalFields: string[],
  allFields: string[],
  reportTitle?: string,
  paginated?: boolean,
  totals?: Record<string, unknown> | null,
) => {
  const router = useRouter();

  const filteredData = useFilteredData(data ?? undefined, searchTerm, excludeTotalFields);

  const titleFromQuery = useTitleFromQuery();

  const title = reportTitle?.trim() || titleFromQuery || "Laporan";

  const startDate =
    typeof router.query.startDate === "string" ? router.query.startDate : "";

  const endDate =
    typeof router.query.endDate === "string" ? router.query.endDate : "";

  const periode = startDate || endDate
    ? `Periode: ${FormatTanggal(startDate)} s/d ${FormatTanggal(endDate)}`
    : "";

  const rawTotalRow = useTotalRow(
    paginated ? (totals ? [totals as T] : []) : filteredData,
    excludeTotalFields,
    totalFields,
    allFields,
  );

  const totalRow = rawTotalRow.length > 0 ? rawTotalRow : undefined;

  return {
    filteredData,
    title,
    periode,
    totalRow,
  };
};
