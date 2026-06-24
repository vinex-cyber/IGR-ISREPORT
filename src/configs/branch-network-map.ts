// src/configs/branch-network-map.ts

import {
  isDatabaseBranch,
  type DatabaseBranch,
} from "@/configs/database-options";

export interface BranchNetworkRule {
  prefix: string;
  branch: DatabaseBranch;
}

function parseBranchNetworkMap(): readonly BranchNetworkRule[] {
  const rawMap = process.env.BRANCH_NETWORK_MAP;

  if (!rawMap) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(rawMap);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      throw new Error("Format harus berupa object JSON");
    }

    const entries = Object.entries(parsed as Record<string, unknown>);

    const rules = entries.map(([prefix, branch]) => {
      const normalizedPrefix = prefix.trim();

      if (!normalizedPrefix) {
        throw new Error("Prefix jaringan tidak boleh kosong");
      }

      if (!isDatabaseBranch(branch)) {
        throw new Error(
          `Branch "${String(branch)}" pada prefix "${prefix}" tidak valid`,
        );
      }

      return {
        prefix: normalizedPrefix,
        branch,
      };
    });

    /*
     * Prefix yang lebih panjang diperiksa terlebih dahulu.
     *
     * Contoh:
     * 192.168.226.10 diperiksa sebelum 192.168.226.
     */
    return rules.sort(
      (first, second) => second.prefix.length - first.prefix.length,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Format tidak diketahui";

    throw new Error(`BRANCH_NETWORK_MAP tidak valid: ${message}`);
  }
}

export const BRANCH_NETWORK_RULES = parseBranchNetworkMap();

export function getBranchFromIp(ipAddress: string): DatabaseBranch | undefined {
  const normalizedIp = ipAddress.trim().replace(/^::ffff:/, "");

  const matchedRule = BRANCH_NETWORK_RULES.find((rule) =>
    normalizedIp.startsWith(rule.prefix),
  );

  return matchedRule?.branch;
}
