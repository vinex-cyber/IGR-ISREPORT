import * as caseUtils from "@/utils/query/klik/utils/case";

const buildRokokWhere = (conditions: string) => {
  // Ekstrak filter tanggal dari conditions (dibuat FilterKlik sbg
  // "obi_tglpb <op> $N [AND obi_tglpb <op> $N]"). Pakai placeholder $N yang sama
  // agar terikat ke nilai params di lapisan luar — tak bergantung posisi params.
  const matches = [
    ...conditions.matchAll(/obi_tglpb\s*(>=|<=|>|<|=)\s*\$(\d+)/g),
  ].map((m) => ({ op: m[1], idx: m[2] }));

  if (matches.length === 0) return { whereObih: "", whereSub: "" };

  const obih = matches
    .map((m) => `date_trunc('day', obi_tglpb) ${m.op} $${m.idx}`)
    .join(" AND ");
  const sub = matches
    .map((m) => `date_trunc('day', pptglpb) ${m.op} $${m.idx}`)
    .join(" AND ");

  return { whereObih: `WHERE ${obih}`, whereSub: `WHERE ${sub}` };
};

export const queryDetailKlik = (conditions: string): string => {
  const { whereObih, whereSub } = buildRokokWhere(conditions);

  return `
  SELECT
      *
  FROM
      (SELECT
      (obi_notrans ||to_char(obi_tgltrans,'yyyymmdd')) as obi_key,
      CASE
        WHEN obi_recid = '1'      THEN 'SIAP PICKING'
        WHEN obi_recid = '2'      THEN 'SIAP SCANNING'
        WHEN obi_recid = '3'      THEN 'SIAP DRAFT STRUK'
        WHEN obi_recid = '5'      THEN 'SIAP STRUK'
        WHEN obi_recid = '6'      THEN 'SELESAI STRUK'
        WHEN coalesce(obi_recid, 'N') = 'N'    THEN 'SIAP SEND HH'
        WHEN obi_recid like 'B%'  THEN 'BATAL'
      END as status,
      obi_recid,
      obi_tglpb,
      obi_tglstruk,
      obi_createdt,
      CASE
       WHEN obi_attribute2 <> 'TMI' THEN split_part(obi_nopb, '/', 1)
       ELSE obi_nopb
      END trx,
      obi_nopb,
      obi_notrans,
      obi_kdmember,
      cus_namamember,
      cus_flagmemberkhusus,
      cus_jenismember,
      cus_kodeoutlet,
      cus_kodesuboutlet,
      obi_ttlorder,
      obi_itemorder,
      obi_realorder,
      obi_realitem,
      obi_alasanbtl,
      obi_kdekspedisi,
      obi_tipebayar,
      obi_draftstruk,
      obi_attribute2,
      case
        when obi_tipebayar = 'COD' then 'COD'
        else 'NON COD'
      end as tipebayar,
      ${caseUtils.getCaseMaxDeliveryTime()} as obi_maxdeliverytime,
      CASE
            WHEN TO_CHAR(OBI_CREATEDT, 'HH24:MI') <= '12:00' THEN '< 12'
            ELSE '> 12'
      END AS stt,
      notif_rokok,
      ${caseUtils.getCaseShippingService()} as obi_shippingservice,
      ${caseUtils.getExpedisi()} as ekspedisi

      FROM tbtr_obi_h
      left join tbmaster_customer on obi_kdmember = cus_kodemember
      
      -- ROKOK --
      LEFT JOIN (SELECT DISTINCT
          PPPB, 
          CASE
            WHEN obi_attribute2 <> 'TMI' THEN split_part(PPPB, '/', 1)
            ELSE PPPB
          END AS pb,
          CASE 
          WHEN OBI_PRDCD <>'NULL' THEN 'ADA ROKOK' 
          ELSE 'TIDAK ADA' 
          END AS NOTIF_ROKOK
          FROM(
          SELECT * FROM TBTR_OBI_D
          LEFT JOIN (SELECT * FROM TBMASTER_PRODMAST)prd ON PRD_PRDCD = OBI_PRDCD
          LEFT JOIN (SELECT OBI_NOTRANS PPNO,
                       OBI_TGLTRANS PPTGL,
                       obi_tglpb pptglpb,
                       obi_attribute2,
                       OBI_NOPB PPPB
                       FROM TBTR_OBI_H
                        ${whereObih}
                    )obih ON OBI_NOTRANS = PPNO AND OBI_TGLTRANS = PPTGL
          ${whereSub}
          AND PRD_KODEDIVISI ='1' AND PRD_KODEDEPARTEMENT ='14')sub)rokok ON PPPB = obi_nopb
      ) as a
      ${
        conditions
          ? "WHERE " + conditions
          : "where date_trunc('day',obi_tglpb) = date_trunc('day',now()) order by obi_tglpb desc"
      }
      ${
        conditions.length > 0
          ? "order by to_char(obi_createdt,'yyyy-mm-dd hh24:mi:ss') asc"
          : ""
      } 
    `;
};
