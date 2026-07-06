import { z } from "zod";
import { createGetHandler } from "@/lib/handlerFactory";

//===============================================================
// Schema
//===============================================================
const SelectTagSchema = z.object({});

//===============================================================
// Query
//===============================================================
const buildQuery = () => `
      select
        tag_kodetag,
        tag_keterangan
      from tbmaster_tag
      order by tag_kodetag
    `;

//===============================================================
// Handler
//===============================================================
export default createGetHandler({
  schema: SelectTagSchema,
  buildQuery,
  buildFilters: () => ({ conditions: "", params: [] }),
  errorContext: "api select tag",
  emptyMessage: (branch) => `Tidak ada data tag untuk branch '${branch}'.`,
  successMessage: (branch) =>
    `Data tag berhasil diambil untuk branch '${branch}'.`,
});
