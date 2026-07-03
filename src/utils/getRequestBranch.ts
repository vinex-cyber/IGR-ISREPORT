// utils/getRequestBranch.ts
import type { NextApiRequest } from "next";
import { getBranchFromIp } from "@/configs/branch-network-map";
import { getDefaultBranch } from "@/utils/getDefaultBranch";
import { DATABASE_OPTIONS } from "@/configs/database-options";

const DATABASE_VALUES = new Set(DATABASE_OPTIONS.map((option) => option.value));

export function getRequestBranch(req: NextApiRequest) {
  // 1. Cookie → branch pilihan user (tidak kelihatan di URL)
  const cookieBranch = req.cookies["selected_branch"]?.trim();
  if (cookieBranch && DATABASE_VALUES.has(cookieBranch)) {
    return cookieBranch;
  }

  // 2. Fallback → deteksi dari IP
  const forwardedFor = req.headers["x-forwarded-for"];
  const ip =
    typeof forwardedFor === "string"
      ? forwardedFor.split(",")[0]?.trim()
      : (req.socket.remoteAddress ?? "");

  return getBranchFromIp(ip) ?? getDefaultBranch();
}
