// configs/database-options.ts

export interface DatabaseOption {
  label: string;
  value: string;
}

const isDatabaseOption = (value: unknown): value is DatabaseOption => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const option = value as Record<string, unknown>;

  return (
    typeof option.label === "string" &&
    option.label.trim().length > 0 &&
    typeof option.value === "string" &&
    option.value.trim().length > 0
  );
};

const parseDatabaseOptions = (): readonly DatabaseOption[] => {
  const rawOptions = process.env.NEXT_PUBLIC_DATABASE_OPTIONS;

  if (!rawOptions) {
    throw new Error("NEXT_PUBLIC_DATABASE_OPTIONS belum diatur di file .env");
  }

  try {
    const parsed: unknown = JSON.parse(rawOptions);

    if (!Array.isArray(parsed)) {
      throw new Error("Format harus berupa array JSON");
    }

    const options = parsed.filter(isDatabaseOption);

    if (options.length === 0) {
      throw new Error("Daftar database tidak boleh kosong");
    }

    if (options.length !== parsed.length) {
      throw new Error("Terdapat label atau value database yang tidak valid");
    }

    return options;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Format tidak diketahui";

    throw new Error(`NEXT_PUBLIC_DATABASE_OPTIONS tidak valid: ${message}`);
  }
};

export const DATABASE_OPTIONS = parseDatabaseOptions();

/**
 * Karena nilainya berasal dari environment variable
 * saat aplikasi dijalankan/build, tipenya menjadi string.
 */
export type DatabaseBranch = (typeof DATABASE_OPTIONS)[number]["value"];
