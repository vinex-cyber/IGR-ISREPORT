// src/lib/db.ts

import { Pool } from "pg";

interface DatabaseOption {
  label: string;
  value: string;
}

interface DatabaseConfig {
  host: string | undefined;
  database: string | undefined;
}

const parseDatabaseOptions = (): DatabaseOption[] => {
  const rawOptions = process.env.NEXT_PUBLIC_DATABASE_OPTIONS;

  if (!rawOptions) {
    throw new Error("NEXT_PUBLIC_DATABASE_OPTIONS belum diatur pada file .env");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawOptions);
  } catch {
    throw new Error("NEXT_PUBLIC_DATABASE_OPTIONS bukan JSON yang valid");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("NEXT_PUBLIC_DATABASE_OPTIONS harus berupa array JSON");
  }

  return parsed.map((item, index) => {
    if (typeof item !== "object" || item === null) {
      throw new Error(`Database option index ${index} tidak valid`);
    }

    const option = item as Record<string, unknown>;

    if (typeof option.label !== "string" || !option.label.trim()) {
      throw new Error(`Label database index ${index} tidak valid`);
    }

    if (typeof option.value !== "string" || !option.value.trim()) {
      throw new Error(`Value database index ${index} tidak valid`);
    }

    return {
      label: option.label.trim(),
      value: option.value.trim(),
    };
  });
};

/**
 * Daftar database dari NEXT_PUBLIC_DATABASE_OPTIONS.
 */
export const DATABASE_OPTIONS = parseDatabaseOptions();

/**
 * Karena daftar database berasal dari runtime environment,
 * BranchType menjadi string dan divalidasi dengan isBranchType().
 */
export type BranchType = string;

const databaseValues = new Set(DATABASE_OPTIONS.map((option) => option.value));

/**
 * Memeriksa apakah branch terdaftar pada
 * NEXT_PUBLIC_DATABASE_OPTIONS.
 */
export const isBranchType = (value: unknown): value is BranchType => {
  return typeof value === "string" && databaseValues.has(value);
};

/**
 * Mengambil branch default.
 *
 * Prioritas:
 * 1. NEXT_PUBLIC_APP_NAME
 * 2. Database pertama dari NEXT_PUBLIC_DATABASE_OPTIONS
 */
export const getDefaultBranch = (): BranchType => {
  const defaultBranch =
    process.env.NEXT_PUBLIC_APP_NAME ?? DATABASE_OPTIONS[0]?.value;

  if (!defaultBranch) {
    throw new Error("Database default belum dikonfigurasi");
  }

  if (!isBranchType(defaultBranch)) {
    throw new Error(
      `Database default "${defaultBranch}" tidak terdaftar pada NEXT_PUBLIC_DATABASE_OPTIONS`,
    );
  }

  return defaultBranch;
};

/**
 * Mengambil konfigurasi host dan nama database
 * berdasarkan nama branch.
 *
 * Contoh:
 * branch = IGRCPG
 *
 * Akan membaca:
 * DB_HOST_IGRCPG
 * DB_NAME_IGRCPG
 */
export const getDatabaseConfig = (branch: BranchType): DatabaseConfig => {
  return {
    host: process.env[`DB_HOST_${branch}`],
    database: process.env[`DB_NAME_${branch}`],
  };
};

/**
 * Config dinamis.
 *
 * Tetap diekspor jika masih digunakan oleh file lain.
 */
export const configs: Record<BranchType, DatabaseConfig> = Object.fromEntries(
  DATABASE_OPTIONS.map((option) => [
    option.value,
    getDatabaseConfig(option.value),
  ]),
);

const pools = new Map<BranchType, Pool>();

const getRequiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Environment variable ${name} belum diatur`);
  }

  return value;
};

/**
 * Mendapatkan koneksi pool PostgreSQL.
 *
 * Jika branch tidak diberikan, menggunakan
 * NEXT_PUBLIC_APP_NAME sebagai default.
 */
export const getPool = (branch?: string): Pool => {
  const selectedBranch = branch?.trim() || getDefaultBranch();

  if (!isBranchType(selectedBranch)) {
    throw new Error(`Branch database tidak valid: ${selectedBranch}`);
  }

  const existingPool = pools.get(selectedBranch);

  if (existingPool) {
    return existingPool;
  }

  const host = getRequiredEnv(`DB_HOST_${selectedBranch}`);

  const database = getRequiredEnv(`DB_NAME_${selectedBranch}`);

  const portValue = process.env.PG_PORT ?? "5432";

  const port = Number(portValue);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`PG_PORT tidak valid: ${portValue}`);
  }

  const pool = new Pool({
    host,
    database,
    port,
    user: getRequiredEnv("PG_USER"),
    password: getRequiredEnv("PG_PASSWORD"),
  });

  pools.set(selectedBranch, pool);

  return pool;
};
