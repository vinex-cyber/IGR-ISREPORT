// src/utils/getDefaultBranch.ts

import {
  DATABASE_OPTIONS,
  isDatabaseBranch,
  type DatabaseBranch,
} from "@/configs/database-options";

/**
 * Mengambil branch default.
 *
 * Urutan:
 * 1. NEXT_PUBLIC_APP_NAME jika valid
 * 2. Database pertama dalam DATABASE_OPTIONS
 * 3. String kosong jika tidak ada data
 */
export function getDefaultBranch(): DatabaseBranch {
  const appName = process.env.NEXT_PUBLIC_APP_NAME?.trim();

  if (isDatabaseBranch(appName)) {
    return appName;
  }

  return DATABASE_OPTIONS[0]?.value ?? "";
}
