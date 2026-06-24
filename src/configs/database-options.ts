// src/configs/database-options.ts

export interface DatabaseOption {
  readonly label: string;
  readonly value: string;
}

/**
 * Memeriksa apakah sebuah nilai merupakan
 * object DatabaseOption yang valid.
 */
function isDatabaseOption(value: unknown): value is DatabaseOption {
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
}

/**
 * Membaca daftar database dari environment variable.
 *
 * Contoh isi .env:
 *
 * NEXT_PUBLIC_DATABASE_OPTIONS=[
 *   {"label":"IGR - CPG","value":"IGRCPG"},
 *   {"label":"ICM - CPG","value":"ICMCPG"}
 * ]
 */
function parseDatabaseOptions(): readonly DatabaseOption[] {
  const rawOptions = process.env.NEXT_PUBLIC_DATABASE_OPTIONS;

  if (!rawOptions) {
    throw new Error("NEXT_PUBLIC_DATABASE_OPTIONS belum diatur di file .env");
  }

  try {
    const parsed: unknown = JSON.parse(rawOptions);

    if (!Array.isArray(parsed)) {
      throw new Error("Format harus berupa array JSON");
    }

    if (parsed.length === 0) {
      throw new Error("Daftar database tidak boleh kosong");
    }

    if (!parsed.every(isDatabaseOption)) {
      throw new Error("Terdapat label atau value database yang tidak valid");
    }

    const normalizedOptions = parsed.map((option) => ({
      label: option.label.trim(),
      value: option.value.trim(),
    }));

    const uniqueValues = new Set(
      normalizedOptions.map((option) => option.value),
    );

    if (uniqueValues.size !== normalizedOptions.length) {
      throw new Error("Terdapat value database yang duplikat");
    }

    return normalizedOptions;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Format tidak diketahui";

    throw new Error(`NEXT_PUBLIC_DATABASE_OPTIONS tidak valid: ${message}`);
  }
}

export const DATABASE_OPTIONS = parseDatabaseOptions();

/**
 * Karena nilai berasal dari environment variable,
 * TypeScript hanya dapat mengetahui tipenya sebagai string.
 */
export type DatabaseBranch = (typeof DATABASE_OPTIONS)[number]["value"];

/**
 * Memeriksa apakah value tersedia
 * di dalam DATABASE_OPTIONS.
 */
export function isDatabaseBranch(value: unknown): value is DatabaseBranch {
  if (typeof value !== "string") {
    return false;
  }

  const normalizedValue = value.trim();

  return DATABASE_OPTIONS.some((option) => option.value === normalizedValue);
}
