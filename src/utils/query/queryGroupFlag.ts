export const QueryGroupFlag = () => {
  return `
WITH produk_flag AS (
    SELECT
        prd_prdcd AS plu,

        prd_flagnas,
        prd_flagigr,
        prd_flagomi,
        prd_flagobi,
        prd_flagidm,

        COALESCE(NULLIF(UPPER(TRIM(prd_flagnas)), ''), 'N') AS flagnas,
        COALESCE(NULLIF(UPPER(TRIM(prd_flagigr)), ''), 'N') AS flagigr,
        COALESCE(NULLIF(UPPER(TRIM(prd_flagomi)), ''), 'N') AS flagomi,
        COALESCE(NULLIF(UPPER(TRIM(prd_flagobi)), ''), 'N') AS flagobi,
        COALESCE(NULLIF(UPPER(TRIM(prd_flagidm)), ''), 'N') AS flagidm

    FROM tbmaster_prodmast

    WHERE prd_prdcd LIKE '%0'
)

SELECT
    plu,

    prd_flagnas,
    prd_flagigr,
    prd_flagomi,
    prd_flagobi,
    prd_flagidm,

    CASE
        /*
         * Flag selain Y, N, NULL, atau string kosong
         * dianggap tidak dikenali.
         */
        WHEN flagnas NOT IN ('Y', 'N')
          OR flagigr NOT IN ('Y', 'N')
          OR flagomi NOT IN ('Y', 'N')
          OR flagobi NOT IN ('Y', 'N')
          OR flagidm NOT IN ('Y', 'N')
        THEN 'TIDAK TAHU'

        /*
         * Semua flag tidak aktif.
         */
        WHEN flagnas = 'N'
         AND flagigr = 'N'
         AND flagomi = 'N'
         AND flagobi = 'N'
         AND flagidm = 'N'
        THEN 'BLM ADA FLAG'

        /*
         * Hanya flag nasional yang aktif.
         * Dipertahankan mengikuti label query lama.
         */
        WHEN flagnas = 'Y'
         AND flagigr = 'N'
         AND flagomi = 'N'
         AND flagobi = 'N'
         AND flagidm = 'N'
        THEN 'NASIONAL'

        /*
         * Susun otomatis seluruh kombinasi flag aktif.
         */
        ELSE CONCAT_WS(
            '+',

            CASE
                WHEN flagnas = 'Y'
                THEN 'NAS'
            END,

            CASE
                WHEN flagigr = 'Y'
                THEN 'IGR'
            END,

            CASE
                WHEN flagomi = 'Y'
                THEN 'OMI'
            END,

            CASE
                WHEN flagobi = 'Y'
                THEN 'K.IGR'
            END,

            CASE
                WHEN flagidm = 'Y'
                THEN 'IDM'
            END
        )
    END AS flag

FROM produk_flag
    `;
};
