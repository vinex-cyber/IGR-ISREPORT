// src/utils/query/queryCashbackMb.ts

import { QueryCashbackMaster } from "./queryCashbackMaster";

const flag = "BIRU";
const alokasiCondition = `(COALESCE(cba_REGULER,'0') ='1' OR COALESCE(cba_REGULER_BIRUPLUS,'0')='1')`;
const suffix = "biru";

export const GetCashbackMb = () =>
  QueryCashbackMaster(flag, alokasiCondition, suffix);
