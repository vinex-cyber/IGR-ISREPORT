// types/report.ts

export type ColumnConfig<T> = {
    field: keyof T;
    label: string;
    isNumeric?: boolean;
    isSearchable?: boolean;
    group?: string;
    groupColor?: string;
    render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
};