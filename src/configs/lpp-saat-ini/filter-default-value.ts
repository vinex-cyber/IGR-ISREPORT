// src/configs/produk-baru/filter-default-value.ts

import type { FilterLppSaatIniInput } from "@/schema/filterLppSaatIni";
import { DATABASE_OPTIONS } from "@/configs/database-options";

const getDefaultBranch = (): string => {
  const envBranch = process.env.NEXT_PUBLIC_APP_NAME;

  const selectedBranch = DATABASE_OPTIONS.find(
    (option) => option.value === envBranch,
  );

  return selectedBranch?.value ?? DATABASE_OPTIONS[0]?.value ?? "";
};

export const getFilterLppSaatIniDefaultValues = (): FilterLppSaatIniInput => ({
  div: "",
  dept: "",
  katb: "",
  tag: "",
  prdcd: "",
  namaBarang: "",
  kodeMonitoringPlu: "",
  kodeSupplier: [],
  namaSupplier: "",
  statusTag: "",
  statusQty: "",
  lokasi: "",
  groupSales: "",
  selectedReport: "per-divisi",
  branch: getDefaultBranch(),
});
