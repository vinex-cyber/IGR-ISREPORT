export const QueryPoOutStanding = () => {
  return `
SELECT tpod_prdcd,
            SUM(tpod_qtypo) AS tpod_qtypo,
            COUNT(tpod_nopo) AS tpod_nopo
     FROM   (
                SELECT tpod_prdcd,
                       tpod_qtypo,
                       tpod_nopo
                FROM   tbtr_po_d
                WHERE  tpod_nopo IN (
                           SELECT tpoh_nopo
                           FROM   tbtr_po_h
                           WHERE  tpoh_recordid IS NULL
                           AND    tpoh_tglpo + INTERVAL '1 day' * tpoh_jwpb >= CURRENT_DATE
                       )
       
            ) poout
     GROUP BY tpod_prdcd
    `;
};
