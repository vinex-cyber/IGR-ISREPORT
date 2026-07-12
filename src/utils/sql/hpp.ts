// src/utils/sql/hpp.ts
// Kalkulasi HPP berdasarkan divisi

export const SQL_HPP = `
  CASE
    WHEN trjd_divisioncode = '5'
      AND substr(trjd_division, 1, 2) = '39' THEN
      CASE
        WHEN 'Y' = 'Y' THEN
          trjd_nominalamt - (
            CASE
              WHEN prd_markupstandard IS NULL THEN
                (5 * trjd_nominalamt) / 100
              ELSE
                (prd_markupstandard * trjd_nominalamt) / 100
            END
          )
      END
    ELSE
      (trjd_quantity / CASE WHEN prd_unit = 'KG' THEN 1000 ELSE 1 END) * trjd_baseprice
  END
`;
