// hooks/useExportToExcel.ts

import { useState } from "react";

import getDays from "@/hooks/getDays";
import { exportToStyledExcel } from "@/utils/ExportExcel/exportToExcel";

interface Column {
  field: string;
  label: string;
  isNumeric?: boolean;
}

interface UseExportToExcelProps {
  title: string;

  data?: Record<string, unknown>[];

  fetchAll?: () => Promise<Record<string, unknown>[]>;

  mapRow: (row: Record<string, unknown>) => (string | number | null)[];

  totalRow?: (string | number | null)[];

  columns: Column[];
}

export function useExportToExcel({
  title,
  data = [],
  fetchAll,
  mapRow,
  totalRow,
  columns,
}: UseExportToExcelProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (isExporting) return;

    try {
      setIsExporting(true);

      const exportData = fetchAll ? await fetchAll() : data;

      const rows = exportData.map((row) =>
        mapRow(row).map((cell) => cell ?? ""),
      );

      await exportToStyledExcel({
        title: `Laporan ${title}`,
        columns,
        rows,
        totalRow,
        fileName: `Laporan_${title}_${getDays()}.xlsx`,
      });
    } catch (error) {
      console.error("Export Excel gagal.", error);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    handleExport,
    isExporting,
  };
}
