// src/pages/api/select-kategori.ts
import { z } from "zod";
import { createSimpleGetHandler } from "@/lib/handlerFactory";

//===============================================================
// Schema
//===============================================================
const SelectKategoriSchema = z.object({});

//===============================================================
// Query
//===============================================================
const buildQuery = () => `
      select
        div_kodedivisi,
        div_namadivisi,
        dep_kodedepartement,
        dep_namadepartement,
        kat_kodekategori,
        kat_namakategori
        from tbmaster_kategori
      left join tbmaster_departement
           on dep_kodedepartement = kat_kodedepartement
      left join tbmaster_divisi
           on div_kodedivisi = dep_kodedivisi
      order by div_kodedivisi, dep_kodedepartement, kat_kodekategori;
    `;

export default createSimpleGetHandler({
  schema: SelectKategoriSchema,
  buildQuery,
  buildFilters: () => ({ conditions: "", params: [] }),
  successMessage: "Data divisi berhasil diambil.",
  emptyMessage: (branch) => `Tidak ada data Kategori untuk branch '${branch}'.`,
  errorContext: "Daftar Kategori",
});
