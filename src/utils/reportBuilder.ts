// utils/reportBuilder.ts
import { ColumnConfig } from "@/types/report";

export function buildReport<T>(columns: ColumnConfig<T>[]) {
    const allFields: string[] = columns.map(c => c.field as string);

    const numericFields: string[] = columns
        .filter(c => c.isNumeric)
        .map(c => c.field as string);

    const searchableFields: string[] = columns
        .filter(c => c.isSearchable)
        .map(c => c.field as string);

    const headers = allFields;

    const mapRow: (row: Record<string, unknown>) => (string | number)[] = (row) =>
        columns.map(col =>
            col.isNumeric ? Number(row[col.field as string]) : (row[col.field as string] as string | number)
        );

    const tableColumns = columns.map(c => ({
        field: c.field as string,
        label: c.label,
        isNumeric: c.isNumeric,
    }));

    const headerGroups = buildHeaderGroups(columns);

    return {
        allFields,
        numericFields,
        searchableFields,
        headers,
        mapRow,
        tableColumns,
        headerGroups,
    };
}

function buildHeaderGroups<T>(columns: ColumnConfig<T>[]) {
    const hasAnyGroup = columns.some(c => c.group);

    if (!hasAnyGroup) return [];

    const groups: { name: string; span: number; color?: string }[] = [];

    let currentGroup = "";
    let count = 0;
    let currentColor = "";

    columns.forEach((col, index) => {
        const group = col.group || "Others";
        const color = col.groupColor || "bg-gray-300";

        if (group !== currentGroup) {
            if (currentGroup) {
                groups.push({
                    name: currentGroup,
                    span: count,
                    color: currentColor,
                });
            }
            currentGroup = group;
            currentColor = color;
            count = 1;
        } else {
            count++;
        }

        if (index === columns.length - 1) {
            groups.push({
                name: group,
                span: count,
                color,
            });
        }
    });

    return groups;
}