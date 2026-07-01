// hooks/useReportTableLogic.ts

import { useRouter } from "next/router";

import { useFilteredData } from "./useFilteredData";
import { useTitleFromQuery } from "./useTitleFromQuery";
import { useTotalRow } from "./useTotalRow";

import { formatReportPeriod } from "@/utils/formatReportPeriode";

export const useReportTableLogic = <T extends object>(
  data: T[] | undefined,
  searchTerm: string,
  excludeTotalFields: (keyof T)[],
  totalFields: (keyof T)[],
  allFields: (keyof T)[],
  reportTitle?: string,
  paginated?: boolean,
) => {
  const router = useRouter();

  const filteredData = useFilteredData(data ?? undefined, searchTerm);

  const titleFromQuery = useTitleFromQuery();

  const title = reportTitle?.trim() || titleFromQuery || "Laporan";

  const startDate =
    typeof router.query.startDate === "string" ? router.query.startDate : "";

  const endDate =
    typeof router.query.endDate === "string" ? router.query.endDate : "";

  const periode = formatReportPeriod(startDate, endDate);

  const rawTotalRow = useTotalRow<T>(
    paginated ? [] : filteredData, // ← kalau paginated, jangan hitung total
    excludeTotalFields,
    totalFields,
    allFields,
  );

  const totalRow = paginated
    ? undefined // ← tidak tampilkan total kalau paginated
    : rawTotalRow.length > 0
      ? rawTotalRow
      : undefined;

  return {
    filteredData,
    title,
    periode,
    totalRow,
  };
};
