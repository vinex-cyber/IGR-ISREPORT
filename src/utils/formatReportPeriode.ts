// utils/formatReportPeriod.ts
import { FormatTanggal } from "./formatTanggal";

export const formatReportPeriod = (start?: string, end?: string) => {
    if (!start && !end) return "";
    return `Periode: ${FormatTanggal(start)} s/d ${FormatTanggal(end)}`;
};
