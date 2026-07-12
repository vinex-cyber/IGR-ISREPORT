// src/utils/query/queryCashbackPl.ts

import { QueryCashbackMaster } from "./queryCashbackMaster";

const flag = "PLATINUM";
const alokasiCondition = `COALESCE(CBA_PLATINUM,'0') = '1'`;
const suffix = "pla";

export const GetCashbackPl = () =>
  QueryCashbackMaster(flag, alokasiCondition, suffix);
