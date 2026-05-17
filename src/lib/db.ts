import { Pool } from "pg";

export const configs = {
  IGRCPG: {
    host: process.env.DB_HOST_IGRCPG,
    database: process.env.DB_NAME_IGRCPG,
  },

  ICMCPG: {
    host: process.env.DB_HOST_ICMCPG,
    database: process.env.DB_NAME_ICMCPG,
  },

  SPICPG1I: {
    host: process.env.DB_HOST_SPICPG1I,
    database: process.env.DB_NAME_SPICPG1I,
  },

  SPICPG4L: {
    host: process.env.DB_HOST_SPICPG4L,
    database: process.env.DB_NAME_SPICPG4L,
  },
};

export type BranchType = keyof typeof configs;

const pools: Partial<Record<BranchType, Pool>> = {};

export const getPool = (branch: BranchType) => {
  if (!pools[branch]) {
    pools[branch] = new Pool({
      host: configs[branch].host,
      database: configs[branch].database,
      port: process.env.PG_PORT ? parseInt(process.env.PG_PORT) : 5432,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
    });
  }

  return pools[branch]!;
};
