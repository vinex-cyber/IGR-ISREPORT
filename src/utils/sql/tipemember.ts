// src/utils/sql/tipemember.ts
// Kategorisasi tipe member berdasarkan jenis member dan create_by

export const SQL_TIPE_MEMBER = `
  CASE
    WHEN cus_jenismember = 'T' THEN 'TMI'
    WHEN cus_flagmemberkhusus = 'Y' THEN 'KHUSUS'
    WHEN trjd_create_by IN ('IDM', 'ID1', 'ID2') THEN 'IDM'
    WHEN trjd_create_by IN ('OMI', 'BKL') THEN 'OMI'
    ELSE 'REGULER'
  END
`;
