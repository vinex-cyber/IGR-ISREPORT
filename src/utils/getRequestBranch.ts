// utils/getRequestBranch.ts
import type { NextApiRequest } from "next";

import { getBranchFromIp } from "@/configs/branch-network-map";
import { getDefaultBranch } from "@/utils/getDefaultBranch";
import { DATABASE_OPTIONS } from "@/configs/database-options"; // untuk validasi

const DATABASE_VALUES = new Set(DATABASE_OPTIONS.map((option) => option.value));

export function getRequestBranch(req: NextApiRequest) {
  // 1. Prioritas pertama → branch dari query parameter (pilihan user)
  const queryBranch = req.query.branch;

  const branchFromQuery =
    typeof queryBranch === "string" ? queryBranch.trim() : "";

  if (branchFromQuery && DATABASE_VALUES.has(branchFromQuery)) {
    return branchFromQuery;
  }

  // 2. Fallback → deteksi dari IP
  const forwardedFor = req.headers["x-forwarded-for"];

  const ip =
    typeof forwardedFor === "string"
      ? forwardedFor.split(",")[0]?.trim()
      : (req.socket.remoteAddress ?? "");

  return getBranchFromIp(ip) ?? getDefaultBranch();
}
