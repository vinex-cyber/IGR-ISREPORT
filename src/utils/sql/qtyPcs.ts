// src/utils/sql/qtyPcs.ts
// Konversi quantity ke PCS (handle KG frac 1000)

export const SQL_QTY_PCS = `
  CASE
    WHEN prd_unit = 'KG' AND prd_frac = 1000 THEN
      trjd_quantity / prd_frac
    ELSE
      trjd_quantity * prd_frac
  END
`;
