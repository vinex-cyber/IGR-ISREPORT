// src/utils/sql/gross.ts
// Kalkulasi gross dengan pajak untuk IDM/OMI/BKL

export const SQL_GROSS = `
  CASE
    WHEN trjd_flagtax1 = 'Y'
      AND trjd_create_by IN ('IDM', 'OMI', 'BKL') THEN
      trjd_nominalamt * 11.1 / 10
    ELSE
      trjd_nominalamt
  END
`;
