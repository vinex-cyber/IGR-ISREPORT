// src/configs/branch-network-map.ts

import {
  isDatabaseBranch,
  type DatabaseBranch,
} from "@/configs/database-options";

type BranchNetworkRuleType = "exact" | "cidr" | "prefix";

interface BranchNetworkRule {
  pattern: string;
  branch: DatabaseBranch;
  type: BranchNetworkRuleType;
  specificity: number;
}

function normalizeIpAddress(ipAddress: string): string {
  return ipAddress.trim().replace(/^::ffff:/i, "");
}

/**
 * Mengubah alamat IPv4 menjadi angka 32-bit.
 *
 * Contoh:
 * 192.168.226.32
 */
function ipv4ToNumber(ipAddress: string): number | undefined {
  const parts = ipAddress.split(".");

  if (parts.length !== 4) {
    return undefined;
  }

  const numbers = parts.map((part) => Number(part));

  const isValid = numbers.every(
    (number) => Number.isInteger(number) && number >= 0 && number <= 255,
  );

  if (!isValid) {
    return undefined;
  }

  const [first = 0, second = 0, third = 0, fourth = 0] = numbers;

  return (first * 256 ** 3 + second * 256 ** 2 + third * 256 + fourth) >>> 0;
}

function parseCidrPrefix(pattern: string): number | undefined {
  const parts = pattern.split("/");

  if (parts.length !== 2) {
    return undefined;
  }

  const [network = "", prefixText = ""] = parts;

  const prefix = Number(prefixText);

  if (
    ipv4ToNumber(network) === undefined ||
    !Number.isInteger(prefix) ||
    prefix < 0 ||
    prefix > 32
  ) {
    return undefined;
  }

  return prefix;
}

/**
 * Memeriksa apakah IP termasuk dalam CIDR.
 *
 * Contoh:
 * 192.168.226.32 berada dalam 192.168.226.0/24
 */
function isIpInCidr(ipAddress: string, cidr: string): boolean {
  const [networkAddress = "", prefixText = ""] = cidr.split("/");

  const ipNumber = ipv4ToNumber(ipAddress);

  const networkNumber = ipv4ToNumber(networkAddress);

  const prefix = Number(prefixText);

  if (
    ipNumber === undefined ||
    networkNumber === undefined ||
    !Number.isInteger(prefix) ||
    prefix < 0 ||
    prefix > 32
  ) {
    return false;
  }

  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;

  return (ipNumber & mask) === (networkNumber & mask);
}

function createNetworkRule(
  pattern: string,
  branch: DatabaseBranch,
): BranchNetworkRule {
  const normalizedPattern = pattern.trim();

  if (!normalizedPattern) {
    throw new Error("Pattern jaringan tidak boleh kosong.");
  }

  const cidrPrefix = parseCidrPrefix(normalizedPattern);

  if (cidrPrefix !== undefined) {
    return {
      pattern: normalizedPattern,
      branch,
      type: "cidr",
      specificity: cidrPrefix,
    };
  }

  if (ipv4ToNumber(normalizedPattern) !== undefined) {
    return {
      pattern: normalizedPattern,
      branch,
      type: "exact",
      specificity: 32,
    };
  }

  /*
   * Mendukung format lama:
   *
   * 192.168.226.
   */
  return {
    pattern: normalizedPattern,
    branch,
    type: "prefix",
    specificity: normalizedPattern.length,
  };
}

function parseBranchNetworkMap(): readonly BranchNetworkRule[] {
  const rawMap = process.env.BRANCH_NETWORK_MAP;

  if (!rawMap) {
    console.warn("[Branch Network] BRANCH_NETWORK_MAP belum diatur.");

    return [];
  }

  try {
    const parsed: unknown = JSON.parse(rawMap);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      throw new Error("BRANCH_NETWORK_MAP harus berupa object JSON.");
    }

    const rules = Object.entries(parsed as Record<string, unknown>).map(
      ([pattern, branch]) => {
        if (!isDatabaseBranch(branch)) {
          throw new Error(
            `Branch "${String(branch)}" untuk jaringan "${pattern}" tidak valid.`,
          );
        }

        return createNetworkRule(pattern, branch);
      },
    );

    /*
     * Aturan paling spesifik diperiksa dahulu:
     *
     * exact IP
     * CIDR paling sempit
     * prefix biasa
     */
    return rules.sort((first, second) => {
      const typePriority: Record<BranchNetworkRuleType, number> = {
        exact: 3,
        cidr: 2,
        prefix: 1,
      };

      const priorityDifference =
        typePriority[second.type] - typePriority[first.type];

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return second.specificity - first.specificity;
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Kesalahan tidak diketahui.";

    throw new Error(`BRANCH_NETWORK_MAP tidak valid: ${message}`);
  }
}

export const BRANCH_NETWORK_RULES = parseBranchNetworkMap();

function doesRuleMatch(ipAddress: string, rule: BranchNetworkRule): boolean {
  switch (rule.type) {
    case "exact":
      return ipAddress === rule.pattern;

    case "cidr":
      return isIpInCidr(ipAddress, rule.pattern);

    case "prefix":
      return ipAddress.startsWith(rule.pattern);
  }
}

export function getBranchFromIp(ipAddress: string): DatabaseBranch | undefined {
  const normalizedIp = normalizeIpAddress(ipAddress);

  const matchedRule = BRANCH_NETWORK_RULES.find((rule) =>
    doesRuleMatch(normalizedIp, rule),
  );

  return matchedRule?.branch;
}
