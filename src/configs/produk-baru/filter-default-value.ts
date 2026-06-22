// src/configs/produk-baru/filter-default-value.ts

import type { FilterProdukBaruInput } from "@/schema/filterProdukBaru";
import { DATABASE_OPTIONS } from "@/configs/database-options";

const getLocalDate = (): string => {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - offset).toISOString().split("T")[0];
};

const getDefaultBranch = (): string => {
  const envBranch = process.env.NEXT_PUBLIC_APP_NAME;

  const selectedBranch = DATABASE_OPTIONS.find(
    (option) => option.value === envBranch,
  );

  return selectedBranch?.value ?? DATABASE_OPTIONS[0]?.value ?? "";
};

export const getFilterProdukBaruDefaultValues = (): FilterProdukBaruInput => ({
  startDate: getLocalDate(),
  endDate: getLocalDate(),
  div: "",
  dept: "",
  katb: "",
  branch: getDefaultBranch(),
});
