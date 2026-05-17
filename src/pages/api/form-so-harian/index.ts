// api/form-so-harian/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "@/lib/db";
import { formSoHarianQuery } from "@/utils/query/formSoHarian";
import { FilterFormSoHarianSchema } from "@/schema/filterFormSoHarian";
import { FilterFormSoHarian } from "@/utils/filters/FiltersFormSoHarian";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // Validasi query parameters menggunakan Zod
    const result = FilterFormSoHarianSchema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: result.error.flatten(),
      });
    }

    const filters = result.data;
    const branch = filters.branch || "IGRCPG";
    const pool = getPool(branch);

    const { conditions, params } = FilterFormSoHarian(result.data);
    const query = `
                        select
                            prdcd,
                            desk,
                            satuan,
                            tag,
                            area,
                            alamat,
                            modif_by,
                            plano,
                            lpp,
                            acost,
                            flag,
                            plano_qty,
                            omi_recid4,
                            qty_rom
                        from
                            (${formSoHarianQuery()}) as subquery
                        ${conditions} 
                        order by area asc
        `;
    const data = await pool.query(query, params);
    res.status(200).json({
      success: true,
      data: data.rows,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
