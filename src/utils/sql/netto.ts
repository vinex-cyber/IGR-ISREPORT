// src/utils/sql/netto.ts
// Kalkulasi netto dari nominal amount dengan pajak (BKP/non-BKP, sales/return)

export const SQL_NETTO = `
  CASE
    WHEN trjd_flagtax2 LIKE 'Y%'
      AND trjd_transactiontype = 'S' THEN
      (trjd_nominalamt / 111) * 100
    WHEN trjd_flagtax2 LIKE 'Y%'
      AND trjd_transactiontype = 'R' THEN
      ((trjd_nominalamt / 111) * 100) * -1
    WHEN trjd_flagtax2 <> 'Y'
      AND trjd_transactiontype = 'S' THEN
      (trjd_nominalamt)
    ELSE
      (trjd_nominalamt) * -1
  END
`;
