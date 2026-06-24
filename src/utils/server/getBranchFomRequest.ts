// src/utils/server/getBranchFromRequest.ts

import type { IncomingMessage } from "http";

import { getBranchFromIp } from "@/configs/branch-network-map";

import type { DatabaseBranch } from "@/configs/database-options";

import { getDefaultBranch } from "@/utils/getDefaultBranch";

function getFirstHeaderValue(header: string | string[] | undefined): string {
  if (Array.isArray(header)) {
    return header[0]?.trim() ?? "";
  }

  return header?.trim() ?? "";
}

export function normalizeIpAddress(ipAddress: string): string {
  return ipAddress.trim().replace(/^::ffff:/, "");
}

export function getClientIp(request: IncomingMessage): string {
  /*
   * Digunakan ketika Next.js berada di belakang Nginx.
   */
  const realIp = getFirstHeaderValue(request.headers["x-real-ip"]);

  if (realIp) {
    return normalizeIpAddress(realIp);
  }

  /*
   * X-Forwarded-For bisa berisi beberapa IP:
   *
   * 192.168.226.50, 127.0.0.1
   *
   * IP pertama adalah IP client.
   */
  const forwardedFor = getFirstHeaderValue(request.headers["x-forwarded-for"]);

  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim() ?? "";

    if (firstIp) {
      return normalizeIpAddress(firstIp);
    }
  }

  return normalizeIpAddress(request.socket.remoteAddress ?? "");
}

export function getBranchFromRequest(request: IncomingMessage): DatabaseBranch {
  const clientIp = getClientIp(request);

  const branchFromIp = getBranchFromIp(clientIp);

  /*
   * Jika IP tidak cocok, gunakan NEXT_PUBLIC_APP_NAME
   * atau database pertama.
   */
  return branchFromIp ?? getDefaultBranch();
}
