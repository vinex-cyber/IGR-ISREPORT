// src/utils/query/queryCashbackMm.ts
import { QueryCashbackMaster } from "@/utils/query/queryCashbackMaster";

const flag = "MERAH";
const alokasiCondition = `(COALESCE(cba_retailer, '0') = '1'
           OR COALESCE(cba_silver, '0')      = '1'
           OR COALESCE(cba_gold1, '0')       = '1'
           OR COALESCE(cba_gold2, '0')       = '1'
           OR COALESCE(cba_gold3, '0')       = '1')`;
const suffix = "mm";

export const GetCashbackMm = () =>
  QueryCashbackMaster(flag, alokasiCondition, suffix);
