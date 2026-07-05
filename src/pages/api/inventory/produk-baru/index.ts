// src/pages/api/form-so-harian/index.ts

import type { NextApiRequest, NextApiResponse } from "next";

import { getPool } from "@/lib/db";
import { FilterProdukBaruSchema } from "@/schema/filterProdukBaru";
import { buildFilterProdukBaru } from "@/utils/filters/FilterProdukBaru";
import { getRequestBranch } from "@/utils/getRequestBranch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);

    return res.status(405).json({
      success: false,
      message: `Method ${req.method} tidak diizinkan`,
    });
  }

  try {
    const result = FilterProdukBaruSchema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Parameter query tidak valid",
        errors: result.error.flatten(),
      });
    }

    const filters = result.data;
    const branch = getRequestBranch(req);
    const pool = getPool(branch);

    const { conditions, params } = buildFilterProdukBaru(filters);

    const query = `
      SELECT
        prd.prd_kodedivisi AS div,
        prd.prd_kodedepartement AS dept,
        prd.prd_kodekategoribarang AS katb,
        d.mstd_prdcd AS plu,
        prd.prd_deskripsipanjang AS desk,
        MIN(TO_CHAR(d.mstd_tgldoc, 'DD-MM-YYYY')) AS tgl_awal_penerimaan
      FROM tbtr_mstran_d d
      LEFT JOIN tbmaster_prodmast prd
        ON d.mstd_prdcd = prd.prd_prdcd
      ${conditions}
      GROUP BY
        prd.prd_kodedivisi,
        prd.prd_kodedepartement,
        prd.prd_kodekategoribarang,
        d.mstd_prdcd,
        prd.prd_deskripsipanjang
      ORDER BY
        prd.prd_kodedivisi,
        prd.prd_kodedepartement,
        prd.prd_kodekategoribarang,
        d.mstd_prdcd
    `;

    const data = await pool.query(query, params);

    return res.status(200).json({
      success: true,
      data: data.rows,
    });
  } catch (error: unknown) {
    console.error("Error fetching produk baru:", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data produk baru",
    });
  }
}
