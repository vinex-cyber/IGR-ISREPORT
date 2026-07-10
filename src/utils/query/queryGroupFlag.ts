// src/utils/query/queryGroupFlag.ts
export const QueryGroupFlag = (plu?: string) => {
  const filterPlu = plu ? `AND prd_prdcd = $1` : "";
  return `
WITH produk_flag AS (
    SELECT
        prd_prdcd AS plu,
        prd_plumcg,

        prd_flagnas,
        prd_flagigr,
        prd_flagomi,
        prd_flagobi,
        prd_flagidm,
        prd_flagbrd,

        COALESCE(NULLIF(UPPER(TRIM(prd_flagnas)), ''), 'N') AS flagnas,
        COALESCE(NULLIF(UPPER(TRIM(prd_flagigr)), ''), 'N') AS flagigr,
        COALESCE(NULLIF(UPPER(TRIM(prd_flagomi)), ''), 'N') AS flagomi,
        COALESCE(NULLIF(UPPER(TRIM(prd_flagobi)), ''), 'N') AS flagobi,
        COALESCE(NULLIF(UPPER(TRIM(prd_flagidm)), ''), 'N') AS flagidm,
        COALESCE(NULLIF(UPPER(TRIM(prd_flagbrd)), ''), 'N') AS flagbrd,
        COALESCE(NULLIF(UPPER(TRIM(
            CASE WHEN prd_plumcg IN (SELECT pluidm FROM depo_list_idm) THEN 'Y' ELSE 'N' END
        )), ''), 'N') AS flagdepo

    FROM tbmaster_prodmast

    WHERE prd_prdcd LIKE '%0'

    ${filterPlu}
)

SELECT
    plu,
    prd_flagnas,
    prd_flagigr,
    prd_flagomi,
    prd_flagobi,
    prd_flagidm,
    prd_flagbrd,
    flagdepo AS prd_flagdepo,

    CASE
        /*
         * Flag selain Y, N, NULL, atau string kosong
         * dianggap tidak dikenali.
         */
        WHEN flagnas  NOT IN ('Y', 'N')
          OR flagigr  NOT IN ('Y', 'N')
          OR flagomi  NOT IN ('Y', 'N')
          OR flagobi  NOT IN ('Y', 'N')
          OR flagidm  NOT IN ('Y', 'N')
          OR flagbrd  NOT IN ('Y', 'N')
          OR flagdepo NOT IN ('Y', 'N')
        THEN 'TIDAK TAHU'

        /*
         * Semua flag tidak aktif.
         */
        WHEN flagnas  = 'N'
         AND flagigr  = 'N'
         AND flagomi  = 'N'
         AND flagobi  = 'N'
         AND flagidm  = 'N'
         AND flagbrd  = 'N'
         AND flagdepo = 'N'
        THEN 'BLM ADA FLAG'

        /*
         * Hanya flag nasional yang aktif.
         */
        WHEN flagnas  = 'Y'
         AND flagigr  = 'N'
         AND flagomi  = 'N'
         AND flagobi  = 'N'
         AND flagidm  = 'N'
         AND flagbrd  = 'N'
         AND flagdepo = 'N'
        THEN 'NASIONAL'

        /*
         * Susun otomatis seluruh kombinasi flag aktif,
         * urutan dari atas: NAS → IGR → OMI → K.IGR → IDM → BRD → DEPO
         */
        ELSE CONCAT_WS(
            '+',
            CASE WHEN flagnas  = 'Y' THEN 'NAS'   END,
            CASE WHEN flagigr  = 'Y' THEN 'IGR'   END,
            CASE WHEN flagomi  = 'Y' THEN 'OMI'   END,
            CASE WHEN flagobi  = 'Y' THEN 'K.IGR' END,
            CASE WHEN flagidm  = 'Y' THEN 'IDM'   END,
            CASE WHEN flagbrd  = 'Y' THEN 'BRD'   END,
            CASE WHEN flagdepo = 'Y' THEN 'DEPO'  END
        )
    END AS flag

FROM produk_flag
    `;
};
