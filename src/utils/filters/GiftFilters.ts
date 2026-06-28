// src/utils/filters/shared/GiftFilters.ts
import { normalizeToArray } from "@/utils/normalizeToArray";

// ─── Report Type ──────────────────────────────────────────────────────────────

/**
 * Tipe laporan yang didukung oleh filter gift.
 *
 * - `per-produk` → filter berdasarkan produk gift
 * - `per-member` → filter berdasarkan member penerima gift
 * - `per-struk`  → filter berdasarkan struk transaksi gift
 */
export type GiftReportType = "per-produk" | "per-member" | "per-struk";

// ─── Interface ────────────────────────────────────────────────────────────────

interface GiftFilterInput {
  kodeGift?: string | string[];
  reportType?: GiftReportType; // ← nama generik, bukan selectedReport
}

// ─── Filter ───────────────────────────────────────────────────────────────────

/**
 * Menambahkan filter gift ke conditions dan params.
 *
 * @example
 * // Nama field sama
 * applyGiftFilters(
 *   { kodeGift: filters.kodeGift, reportType: filters.reportType },
 *   conditions,
 *   params,
 * );
 *
 * @example
 * // Nama field berbeda → mapping manual
 * applyGiftFilters(
 *   { kodeGift: filters.kodeGift, reportType: filters.selectedReport as GiftReportType },
 *   conditions,
 *   params,
 * );
 */
export function applyGiftFilters(
  filters: GiftFilterInput,
  conditions: string[],
  params: (string | string[])[],
) {
  const gift = normalizeToArray(filters.kodeGift);
  if (gift.length === 0) return;

  switch (filters.reportType) {
    case "per-produk":
      conditions.push(
        `dtl_prdcd_ctn = ANY(SELECT gfd_prdcd FROM tbtr_gift_dtl WHERE gfd_kodepromosi = ANY($${params.length + 1}))`,
      );
      params.push(gift);
      break;

    case "per-member":
      conditions.push(
        `dtl_cusno = ANY(SELECT DISTINCT kd_member FROM m_gift_h WHERE kd_promosi = $${params.length + 1})`,
      );
      params.push(gift);
      break;

    case "per-struk":
      conditions.push(
        `dtl_struk = ANY(SELECT DISTINCT to_char(tgl_trans,'yyyymmdd')||create_by||trans_no||'S' FROM m_gift_h WHERE kd_promosi = $${params.length + 1})`,
      );
      params.push(gift);
      break;

    default:
      conditions.push(
        `dtl_cusno = ANY(SELECT DISTINCT kd_member FROM m_gift_h WHERE kd_promosi = ANY($${params.length + 1}))`,
      );
      params.push(gift);
      break;
  }
}
