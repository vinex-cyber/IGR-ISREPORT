//

interface MonthInfo {
  month: string;
}

function getMonthBefore(
  monthsBefore: number,
  baseDate = new Date(),
): MonthInfo {
  const date = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth() - monthsBefore,
    1,
  );

  return {
    month: String(date.getMonth() + 1).padStart(2, "0"),
  };
}

export const QueryAvgSalesBulanan = (plu?: string): string => {
  const month01 = getMonthBefore(3);
  const month02 = getMonthBefore(2);
  const month03 = getMonthBefore(1);

  const filerPlu = plu ? `WHERE rsl_prdcd = '${plu}'` : "";

  return `
    SELECT
      rsl_prdcd,

      (
        SUM(
          COALESCE(rsl_qty_${month01.month}, 0) +
          COALESCE(rsl_qty_${month02.month}, 0) +
          COALESCE(rsl_qty_${month03.month}, 0)
        ) / 3.0
      ) AS avg_sales

    FROM tbtr_rekapsalesbulanan
    ${filerPlu}
    GROUP BY rsl_prdcd
  `;
};
