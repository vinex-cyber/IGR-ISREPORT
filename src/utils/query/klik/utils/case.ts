export const getCaseMaxDeliveryTime = () => `
  CASE
        -------------------------------------------------------------- TRX DI BAWAH JAM 12 ----------------------------------------------------------------------
        -- NEXTDAY < 12
        WHEN obi_shippingservice = 'N' AND to_char(obi_createdt, 'HH24:MI') <= '11:59' THEN obi_maxdeliverytime + interval '1' day
        -- SAMEDAY < 12
        WHEN obi_shippingservice = 'S' AND to_char(obi_createdt, 'HH24:MI') <= '11:59' THEN obi_maxdeliverytime
        -- CORP < 12
        WHEN obi_shippingservice IS NULL AND obi_nopb LIKE '%cor%' AND to_char(obi_createdt, 'HH24:MI') <= '11:59' THEN obi_createdt + interval '2' day
        -- TMI < 12
        WHEN obi_attribute2 = 'TMI' AND to_char(obi_createdt, 'HH24:MI') <= '11:59' AND obi_nopb LIKE '%TMI%' THEN obi_createdt + interval '2' day
        WHEN obi_attribute2 = 'TMI' AND to_char(obi_createdt, 'HH24:MI') <= '11:59' AND obi_nopb LIKE '%TMI%' AND obi_maxdeliverytime IS NULL THEN obi_createdt + interval '2' day
        -------------------------------------------------------------- TRX DI ATAS JAM 12 ----------------------------------------------------------------------
        -- NEXTDAY > 12
        WHEN obi_shippingservice = 'N' AND to_char(obi_createdt, 'HH24:MI') >= '12:00' THEN date_trunc('DAY', obi_maxdeliverytime + interval '1' day)
        WHEN OBI_MAXDELIVERYTIME IS NULL AND TO_CHAR(OBI_CREATEDT, 'HH24:MI') >= '12:00' AND obi_shippingservice NOT IN ('S') THEN DATE_TRUNC('DAY', OBI_CREATEDT+ INTERVAL '1' DAY)
        -- SAMEDAY > 12
        WHEN obi_shippingservice = 'S' AND to_char(obi_createdt, 'HH24:MI') >= '12:00' THEN obi_maxdeliverytime
        WHEN OBI_MAXDELIVERYTIME IS NULL AND TO_CHAR(OBI_CREATEDT, 'HH24:MI') >= '12:00' AND obi_shippingservice = 'S' THEN DATE_TRUNC('DAY', OBI_CREATEDT+ INTERVAL '1' DAY)
        -- CORP > 12
        WHEN obi_shippingservice IS NULL AND obi_nopb LIKE '%cor%' AND to_char(obi_createdt, 'HH24:MI') >= '12:00' THEN obi_createdt + interval '2' day
        -- TMI > 12
        WHEN obi_attribute2 = 'TMI' AND to_char(obi_createdt, 'HH24:MI') >= '12:00' AND obi_nopb LIKE '%TMI%' AND obi_shippingservice IS NULL THEN obi_createdt + interval '2' day
        WHEN obi_attribute2 = 'TMI' AND to_char(obi_createdt, 'HH24:MI') >= '12:00' AND obi_nopb LIKE '%TMI%' AND obi_maxdeliverytime IS NULL THEN obi_createdt + interval '2' day
        ELSE OBI_MAXDELIVERYTIME
      END
`;

export const getCaseShippingService = () => `
  CASE
       WHEN obi_shippingservice = 'N' THEN 'NEXTDAY'
       WHEN obi_shippingservice = 'S' THEN 'SAMEDAY'
       WHEN obi_nopb LIKE '%cor%'     THEN 'COR'
       WHEN obi_shippingservice = 'N' and obi_kdekspedisi like '%Ambil di Toko Indogrosir%' THEN 'AMTOK'
       WHEN obi_shippingservice = 'S' and obi_kdekspedisi like '%Ambil di Toko Indogrosir%' THEN 'AMTOK'
       ELSE obi_shippingservice
  END
`;

export const getExpedisi = () => `
  CASE
        WHEN obi_kdekspedisi LIKE 'Indopaket Mobil%' THEN 'MOBIL'
        WHEN obi_kdekspedisi LIKE 'Indopaket Motor%' THEN 'MOTOR'
        WHEN obi_kdekspedisi LIKE 'Ambil di Toko Indogrosir%' THEN 'AMTOK'
        ELSE obi_kdekspedisi
  END
`;
