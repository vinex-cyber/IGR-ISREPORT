interface MonthInfo {
  month: string;
  year: number;
  days: number;
}

function getMonthBefore(
  monthsBefore: number,
  baseDate = new Date(),
): MonthInfo {
  /*
   * Tanggal 1 dipakai agar aman saat bulan sekarang
   * memiliki tanggal 29, 30, atau 31.
   */
  const date = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth() - monthsBefore,
    1,
  );

  const year = date.getFullYear();
  const monthIndex = date.getMonth();

  const month = String(monthIndex + 1).padStart(2, "0");

  /*
   * Tanggal 0 pada bulan berikutnya menghasilkan
   * tanggal terakhir pada bulan yang sedang dihitung.
   */
  const days = new Date(year, monthIndex + 1, 0).getDate();

  return {
    month,
    year,
    days,
  };
}

export const QuerySalesPerDay = (): string => {
  const month01 = getMonthBefore(3);
  const month02 = getMonthBefore(2);
  const month03 = getMonthBefore(1);

  const totalDays = month01.days + month02.days + month03.days;

  return `
    SELECT
      sls_prdcd AS spd_prdcd,

      COALESCE(sls_qty_${month01.month}, 0) AS spd_qty_1,
      COALESCE(sls_qty_${month02.month}, 0) AS spd_qty_2,
      COALESCE(sls_qty_${month03.month}, 0) AS spd_qty_3,

      TRUNC(
        (
          COALESCE(sls_qty_${month01.month}, 0) +
          COALESCE(sls_qty_${month02.month}, 0) +
          COALESCE(sls_qty_${month03.month}, 0)
        ) / ${totalDays}.0,
        5
      ) AS spd_qty,

      COALESCE(sls_rph_${month01.month}, 0) AS spd_rph_1,
      COALESCE(sls_rph_${month02.month}, 0) AS spd_rph_2,
      COALESCE(sls_rph_${month03.month}, 0) AS spd_rph_3,

      TRUNC(
        (
          COALESCE(sls_rph_${month01.month}, 0) +
          COALESCE(sls_rph_${month02.month}, 0) +
          COALESCE(sls_rph_${month03.month}, 0)
        ) / ${totalDays}.0,
        5
      ) AS spd_rph

    FROM tbtr_salesbulanan
  `;
};
