// src/utils/query/queryRiwayatPembelian.ts

export const QueryRiwayatPembelian = (conditions: string) => `
SELECT *
FROM (
  SELECT
    m.mstd_typetrn,
    m.mstd_kodesupplier,
    s.sup_namasupplier AS mstd_namasupplier,
    m.mstd_qty,
    m.mstd_qtybonus1,
    m.mstd_qtybonus2,
    m.mstd_nodoc,
    m.mstd_tgldoc,
    TO_CHAR(m.mstd_create_dt, 'hh24:mi:ss') AS mstd_jam,
    (m.mstd_gross - m.mstd_discrph) / (m.mstd_qty + 0.00000001) AS mstd_lastcost,
    m.mstd_avgcost / m.mstd_frac AS mstd_avgcost,
    m.mstd_create_dt,
    ROW_NUMBER() OVER (ORDER BY m.mstd_create_dt DESC) AS rn
  FROM tbtr_mstran_d m
  LEFT JOIN tbmaster_supplier s ON s.sup_kodesupplier = m.mstd_kodesupplier
  LEFT JOIN tbmaster_prodmast p ON p.prd_prdcd = m.mstd_prdcd
  WHERE 1=1 ${conditions}
  AND m.mstd_typetrn IN ('B', 'L')
  AND m.mstd_recordid IS NULL
  ORDER BY m.mstd_create_dt DESC
) sub1
WHERE rn <= 100
ORDER BY mstd_create_dt DESC
`;
