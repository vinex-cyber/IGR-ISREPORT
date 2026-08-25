// src/lib/db.ts

import { Pool } from "pg";
import { getDefaultBranch } from "@/utils/getDefaultBranch";
import { isDatabaseBranch } from "@/configs/database-options";

const pools = new Map<string, Pool>();

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

  if (!isDatabaseBranch(selectedBranch)) {
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
