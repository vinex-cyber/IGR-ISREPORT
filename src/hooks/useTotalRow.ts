// hooks/useTotalRow.ts
import { useMemo } from "react";
import { formatNumber } from "@/utils/formatNumber";


export function useTotalRow<T>(
    data: T[] | undefined,
    identityFields: string[],
    numericFields: string[],
    allFields: string[]
): (string | number)[] {
    return useMemo(() => {
        if (!data || data.length === 0) return [];

        return allFields.map((field, index) => {
            if (index === 0) return "TOTAL";
            if (identityFields.includes(field)) return "";
            if (numericFields.includes(field)) {
                const total = data.reduce(
                    (acc, row) => acc + Number((row as Record<string, unknown>)[field] ?? 0),
                    0
                );
                return formatNumber(total);
            }
            return "";
        });
    }, [data, identityFields, numericFields, allFields]);
}
