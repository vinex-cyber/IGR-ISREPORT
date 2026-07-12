// src/utils/query/queryLokasi.ts
export const QueryLokasi = `
  SELECT
    CASE
      WHEN SUBSTR(lks_koderak, 1, 1) IN ('R', 'O', 'F', 'X', 'K') THEN '1'
      ELSE '2'
    END AS lks_lokasi,
    prd_prdcd,
    prd_deskripsipanjang,
    lks_koderak,
    lks_kodesubrak,
    lks_tiperak,
    lks_shelvingrak,
    lks_nourut,
    lks_qty,
    lks_expdate
  FROM tbmaster_lokasi
  LEFT JOIN tbmaster_prodmast ON lks_prdcd = prd_prdcd
`;
