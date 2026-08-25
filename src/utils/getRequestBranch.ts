// utils/getRequestBranch.ts
import type { NextApiRequest } from "next";
import { getBranchFromRequest } from "@/utils/server/getBranchFomRequest";

export function getRequestBranch(req: NextApiRequest) {
  return getBranchFromRequest(req);
}
