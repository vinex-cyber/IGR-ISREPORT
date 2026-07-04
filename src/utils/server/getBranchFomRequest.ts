// src/utils/server/getBranchFromRequest.ts

import type { IncomingMessage } from "http";

import { getBranchFromIp } from "@/configs/branch-network-map";
import { DATABASE_OPTIONS } from "@/configs/database-options";
import type { DatabaseBranch } from "@/configs/database-options";
import { getDefaultBranch } from "@/utils/getDefaultBranch";

const DATABASE_VALUES = new Set(DATABASE_OPTIONS.map((opt) => opt.value));

function getFirstHeaderValue(header: string | string[] | undefined): string {
  if (Array.isArray(header)) {
    return header[0]?.trim() ?? "";
  }

  return header?.trim() ?? "";
}

/**
 * Menormalisasi format IP yang diterima Node.js/Nginx.
 *
 * Contoh:
 * ::ffff:192.168.226.50 → 192.168.226.50
 * 192.168.226.50:52100  → 192.168.226.50
 * ::1                   → 127.0.0.1
 */
export function normalizeIpAddress(ipAddress: string): string {
  let normalized = ipAddress.trim().replace(/^::ffff:/i, "");

  if (normalized === "::1") {
    return "127.0.0.1";
  }

  const ipv4WithPort = normalized.match(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/);

  if (ipv4WithPort?.[1]) {
    normalized = ipv4WithPort[1];
  }

  return normalized;
}

/**
 * Membaca IP client.
 *
 * Prioritas:
 * 1. X-Real-IP dari Nginx
 * 2. X-Forwarded-For
 * 3. Socket remoteAddress
 */
export function getClientIp(request: IncomingMessage): string {
  const realIp = normalizeIpAddress(
    getFirstHeaderValue(request.headers["x-real-ip"]),
  );

  if (realIp) {
    return realIp;
  }

  const forwardedFor = getFirstHeaderValue(request.headers["x-forwarded-for"]);

  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim() ?? "";

    if (firstIp) {
      return normalizeIpAddress(firstIp);
    }
  }

  return normalizeIpAddress(request.socket.remoteAddress ?? "");
}

/**
 * Menentukan branch berdasarkan IP client.
 *
 * Jika IP tidak terdaftar dalam mapping jaringan,
 * gunakan branch default dari NEXT_PUBLIC_APP_NAME.
 */
export function getBranchFromRequest(request: IncomingMessage): DatabaseBranch {
  const cookies = (
    request as IncomingMessage & { cookies?: Record<string, string> }
  ).cookies;

  const cookieBranch = cookies?.selected_branch?.trim();
  if (cookieBranch && DATABASE_VALUES.has(cookieBranch)) {
    return cookieBranch as DatabaseBranch;
  }

  const clientIp = getClientIp(request);

  const branchFromIp = getBranchFromIp(clientIp);

  return branchFromIp ?? getDefaultBranch();
}
