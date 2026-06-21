// utils/getDefaultDatabase.ts

import { DATABASE_OPTIONS } from "@/configs/database-options";

export const getDefaultDatabase = (): string => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  const isAvailable = DATABASE_OPTIONS.some(
    (option) => option.value === appName,
  );

  if (appName && isAvailable) {
    return appName;
  }

  return DATABASE_OPTIONS[0]?.value ?? "";
};
