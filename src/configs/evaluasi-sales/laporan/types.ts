import type { ColumnConfig } from "@/types/report";

export type ModalType = "produk-tanggal" | "produk" | "struk" | "struk-view";

export interface ActionItem {
  label: string;
  icon: React.ReactNode;
  modal: ModalType;
}

export interface ReportDefinition {
  columns: ColumnConfig<Record<string, unknown>>[];
  keyField: (row: Record<string, unknown>) => string;
  rowLabel: (row: Record<string, unknown>) => string | React.ReactNode;
  actions: ActionItem[];
  paginated?: boolean;
  defaultLimit?: number;
  textHeader?: "xs" | "sm" | "md" | "lg" | "xl";
  textBody?: "xs" | "sm" | "md" | "lg" | "xl";
  textFooter?: "xs" | "sm" | "md" | "lg" | "xl";
  sectionClass?: string;
}
