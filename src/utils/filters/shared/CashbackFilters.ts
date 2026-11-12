// src/utils/filters/shared/CashbackFilters.ts
import type { QueryParam } from "@/types/queryParams";
import { normalizeToArray } from "@/utils/normalizeToArray";

// ─── Report Type ──────────────────────────────────────────────────────────────

/**
 * Tipe laporan yang didukung oleh filter cashback.
 *
 * - `per-produk` → filter berdasarkan produk cashback
 * - `per-member` → filter berdasarkan member penerima cashback
 * - `per-struk`  → filter berdasarkan struk transaksi cashback
 */
export type CashbackReportType = "per-produk" | "per-member" | "per-struk";

// ─── Interface ────────────────────────────────────────────────────────────────

interface CashbackFilterInput {
  kodeCashback?: string | string[];
  reportType?: CashbackReportType;
}

// ─── Filter ───────────────────────────────────────────────────────────────────

/**
 * Menambahkan filter cashback ke conditions dan params.
 *
 * Catatan: beda dengan gift, default (reportType tidak dikenal) memakai
 * `per-struk` supaya perilaku filter cashback di halaman evaluasi sales
 * tidak berubah.
 *
 * @example
 * applyCashbackFilters(
 *   { kodeCashback: filters.cashback, reportType: filters.selectedReport as CashbackReportType },
 *   conditions,
 *   params,
 * );
 */
export function applyCashbackFilters(
  filters: CashbackFilterInput,
  conditions: string[],
  params: QueryParam[],
) {
  const cashback = normalizeToArray(filters.kodeCashback);
  if (cashback.length === 0) return;

  const paramIdx = `$${params.length + 1}`;

  switch (filters.reportType) {
    case "per-produk":
      conditions.push(
        `dtl_prdcd_ctn = ANY(SELECT cbd_prdcd FROM tbtr_cashback_dtl WHERE cbd_kodepromosi = ANY(${paramIdx}))`,
      );
      break;

    case "per-member":
      conditions.push(
        `dtl_cusno = ANY(SELECT DISTINCT kd_member FROM m_promosi_h WHERE kd_promosi = ANY(${paramIdx}))`,
      );
      break;

    case "per-struk":
    default:
      conditions.push(
        `dtl_struk = ANY(SELECT DISTINCT to_char(tgl_trans,'yyyymmdd')||create_by||trans_no||'S' FROM m_promosi_h WHERE kd_promosi = ANY(${paramIdx}))`,
      );
      break;
  }

  params.push(cashback);
}
