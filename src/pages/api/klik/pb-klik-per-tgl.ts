// src/pages/api/klik/pb-klik-per-tgl.ts
import { createGetHandler } from "@/lib/handlerFactory";
import type { QueryParam } from "@/types/queryParams";
import { KlikFilters, klikSchemas } from "@/schema/klik/klikSchemas";
import { queryDetailKlik } from "@/utils/query/klik/queryDetailKlik";
import { FilterKlik } from "@/utils/filters/FilterKlik";

const buildQuery = (conditions: string, _params: QueryParam[]) => `
select
      obi_tglpb,
      sum(coalesce(belum_send_hh,0)) as belum_send_hh,
      sum(coalesce(proses_picking,0)) as proses_picking,
      sum(coalesce(siap_struk_cod,0)) as siap_struk_cod,
      sum(coalesce(siap_struk_non_cod,0)) as siap_struk_non_cod,
      sum(coalesce(selesai_struk,0)) as selesai_struk,
      sum(coalesce(batal,0)) as batal,
      sum(coalesce(total_pb,0)) as total_pb,
      sum(coalesce(total_order,0)) as total_order,
      sum(coalesce(real_order,0)) as real_order,
      sum(coalesce(batal_order,0)) as batal_order
    from
    (
      select
        to_char(obi_tglpb,'dd-mm-yyyy') as obi_tglpb,
        CASE
          when status = 'SIAP SEND HH' then count(obi_nopb)
        END as belum_send_hh,
        case
          when status in ('SIAP PICKING', 'SIAP SCANNING', 'SIAP DRAFT STRUK') then count(obi_nopb)
        END as proses_picking,
        case
          when status = 'SIAP STRUK' and tipebayar = 'COD' then count(obi_nopb)
        end as siap_struk_cod,
        case
          when status = 'SIAP STRUK' and tipebayar <> 'COD' then count(obi_nopb)
        end as siap_struk_non_cod,
        case
          when status = 'SELESAI STRUK' then count(obi_nopb)
        end as selesai_struk,
        case
          when status = 'BATAL' then count(obi_nopb)
        end as batal,
        sum(obi_ttlorder) FILTER (WHERE status = 'BATAL') as batal_order,
        count(obi_nopb) as total_pb,
        sum(obi_ttlorder) as total_order,
        sum(obi_realorder) as real_order
      from
        (${queryDetailKlik(conditions)}) as klik
      group by
        to_char(obi_tglpb,'dd-mm-yyyy'), to_char(obi_tglpb,'yyyymmdd'), status, tipebayar
    ) as klik_per_day
    group by
      obi_tglpb
      `;

export default createGetHandler<KlikFilters>({
  schema: klikSchemas,
  buildFilters: FilterKlik,
  buildQuery,
  successMessage: (_branch, filters) =>
    `Data Status Order ${filters?.status ?? "Semua"} berhasil diambil.`,
  emptyMessage: (branch) =>
    `Tidak ada data status order untuk branch '${branch}'.`,
  errorContext: "Daftar Status Order",
  return404IfEmpty: false,
  paginated: true,
});
