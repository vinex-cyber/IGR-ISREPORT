// hooks/useExportToExcel.ts

import { useState } from "react";

import getDays from "@/hooks/getDays";
import { exportToStyledExcel } from "@/utils/ExportExcel/exportToExcel";

type Column<T> = {
  field: keyof T;
  label: string;
  isNumeric?: boolean;
};

interface UseExportToExcelProps<T extends object> {
  title: string;

  /**
   * Data yang akan diexport.
   *
   * Jika fetchAll tidak diberikan,
   * maka data ini yang digunakan.
   */
  data?: T[];

  /**
   * Ambil seluruh data dari server.
   *
   * Cocok untuk report yang menggunakan
   * pagination atau lazy loading.
   */
  fetchAll?: () => Promise<T[]>;

  mapRow: (row: T) => (string | number | null)[];

  totalRow?: (string | number | null)[];

  columns: Column<T>[];
}

export function useExportToExcel<T extends object>({
  title,
  data = [],
  fetchAll,
  mapRow,
  totalRow,
  columns,
}: UseExportToExcelProps<T>) {
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
