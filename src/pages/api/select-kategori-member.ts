import { createSimpleGetHandler } from "@/lib/handlerFactory";
import { z } from "zod";

//===============================================================
// Schema
//===============================================================
const SelectKategoriMemberSchema = z.object({});

//===============================================================
// Query
//===============================================================
const buildQuery = () => `
      select
        grp_idgroupkat,
        grp_group,
        grp_kategori,
        grp_subkategori
      from tbtabel_groupkategori
      order by grp_group desc, grp_kategori asc;
    `;

export default createSimpleGetHandler({
  schema: SelectKategoriMemberSchema,
  buildFilters: () => ({ conditions: "", params: [] }),
  buildQuery,
  successMessage: "Data kategori member berhasil diambil.",
  emptyMessage: (branch) =>
    `Tidak ada data kategori member untuk branch '${branch}'.`,
  errorContext: "Daftar kategori member",
});
