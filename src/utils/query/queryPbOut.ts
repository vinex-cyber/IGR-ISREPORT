// src/utils/query/queryPbOut.ts

export const QueryPbOut = (plu?: string) => {
  const filterPlu = plu ? `AND pbd_prdcd = $1` : "";

  return `
        SELECT
            PBD_PRDCD PLU_PBOUT,
            SUM((PBD_QTYPB))PB_OUT
        FROM tbtr_pb_d
            WHERE PBD_NOPO   IS NULL
            AND PBD_RECORDID IS NULL
            AND DATE_TRUNC('day', PBD_CREATE_DT) BETWEEN CURRENT_DATE - INTERVAL '14 days' AND CURRENT_DATE
            ${filterPlu}
        GROUP BY pbd_prdcd
    `;
};
