// src/lib/branch.ts

import { BranchType, configs } from "./db";

export const getBranch = (branch?: string): BranchType => {
  if (branch && branch in configs) {
    return branch as BranchType;
  }

  return "IGRCPG";
};
