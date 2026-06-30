// scripts/create-api.ts
import fs from "fs";
import path from "path";
import readline from "readline";

const apiName = process.argv[2];

// ─────────────────────────────────────────────
// 🔐 VALIDASI: Hanya terima kebab-case + nested path
// ─────────────────────────────────────────────
const isValidKebabCase = (str: string): boolean => {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);
};

if (!apiName) {
  console.error(
    "❌ Masukkan nama API endpoint (contoh: users atau laporan/harian/penjualan)",
  );
  console.error(
    "   ⚠️  WAJIB kebab-case: huruf kecil, angka, dan dash (-) saja",
  );
  console.error("   Format: npm run create:api <path/nama-endpoint>");
  process.exit(1);
}

// ─────────────────────────────────────────────
// 🔧 HELPERS: Konversi ke format TypeScript
// ─────────────────────────────────────────────

const toPascalCase = (str: string): string => {
  return str
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

const toCamelCase = (str: string): string => {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

// ─────────────────────────────────────────────
// 🧩 PROSES INPUT
// ─────────────────────────────────────────────
const parts = apiName.split("/");
const rawFileName = parts.pop()!;
const folders = parts;

if (!isValidKebabCase(rawFileName)) {
  console.error(`❌ Nama API tidak valid: "${rawFileName}"`);
  console.error("   ✅ Gunakan kebab-case: huruf kecil, angka, dash (-)");
  process.exit(1);
}

for (const folder of folders) {
  if (folder && !isValidKebabCase(folder)) {
    console.error(`❌ Nama folder tidak valid: "${folder}"`);
    process.exit(1);
  }
}

const baseDir = path.join(process.cwd(), "src", "pages", "api", ...folders);
const filePath = path.join(baseDir, `${rawFileName}.ts`);

if (fs.existsSync(filePath)) {
  console.error(`❌ API route sudah ada: ${filePath}`);
  process.exit(1);
}

const typeName = toPascalCase(rawFileName);
const handlerName = toCamelCase(rawFileName);
const routePath = `/api/${apiName}`;

// ─────────────────────────────────────────────
// 🎯 PROMPT: Pilih jenis handler
// ─────────────────────────────────────────────
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askHandlerType(): Promise<"paginated" | "simple" | "manual"> {
  return new Promise((resolve) => {
    console.log("\n📦 Pilih jenis handler:");
    console.log(
      "   1. Paginated  - List data dengan pagination + search (createPaginatedGetHandler)",
    );
    console.log(
      "   2. Simple     - Ambil semua data tanpa pagination (createSimpleGetHandler)",
    );
    console.log("   3. Manual     - Handler kosong, tulis sendiri\n");

    rl.question("Pilihan (1/2/3) [default: 1]: ", (answer) => {
      const choice = answer.trim() || "1";

      if (choice === "2") resolve("simple");
      else if (choice === "3") resolve("manual");
      else resolve("paginated");
    });
  });
}

// ─────────────────────────────────────────────
// 📝 TEMPLATE: Paginated Handler
// ─────────────────────────────────────────────
const paginatedTemplate = `import { z } from "zod";
import { createPaginatedGetHandler } from "@/lib/handlerFactory";
import type { QueryParam } from "@/types/queryParams";

/**
 * =========================================
 * 🔌 API ROUTE: ${typeName}
 * =========================================
 *
 * 📍 Endpoint: ${routePath}
 * 📄 File: src/pages/api/${apiName}.ts
 *
 * 📌 Jenis: Paginated (list + search + pagination)
 */

// ============================================================
// Schema
// ============================================================
const ${typeName}Schema = z.object({
  search: z.string().trim().optional().default(""),
  // TODO: tambah field filter lain sesuai kebutuhan
  // div: z.string().trim().optional(),
});

type ${typeName}Filters = z.infer<typeof ${typeName}Schema>;

// ============================================================
// Filter Builder
// ============================================================
function buildFilters(filters: ${typeName}Filters) {
  const keywordLike = \`%\${filters.search}%\`;

  const conditions = \`
    -- TODO: ganti dengan kondisi WHERE sesuai tabel
    1 = 1
    AND (
      $1 = ''
      OR your_column ILIKE $1
    )
  \`;

  const params: QueryParam[] = [keywordLike];

  return { conditions, params };
}

// ============================================================
// Query Builder
// ============================================================
function buildQuery(conditions: string) {
  return \`
    SELECT
      *
    FROM your_table
    WHERE \${conditions}
    ORDER BY 1
  \`;
}

// ============================================================
// Handler
// ============================================================
export default createPaginatedGetHandler<${typeName}Filters>({
  schema: ${typeName}Schema,
  buildFilters,
  buildQuery,
  successMessage: "Data ${rawFileName.replace(/-/g, " ")} berhasil diambil.",
  emptyMessage: (branch) => \`Tidak ada data untuk branch '\${branch}'.\`,
  errorContext: "${typeName}",
  return404IfEmpty: false,
});
`;

// ─────────────────────────────────────────────
// 📝 TEMPLATE: Simple Handler
// ─────────────────────────────────────────────
const simpleTemplate = `import { z } from "zod";
import { createSimpleGetHandler } from "@/lib/handlerFactory";

/**
 * =========================================
 * 🔌 API ROUTE: ${typeName}
 * =========================================
 *
 * 📍 Endpoint: ${routePath}
 * 📄 File: src/pages/api/${apiName}.ts
 *
 * 📌 Jenis: Simple (ambil semua data tanpa pagination)
 */

// ============================================================
// Schema (kosongkan jika tidak ada filter)
// ============================================================
const ${typeName}Schema = z.object({
  // TODO: tambah field filter sesuai kebutuhan
});

// ============================================================
// Query
// ============================================================
const buildQuery = () => \`
  SELECT
    *
  FROM your_table
  ORDER BY 1
\`;

// ============================================================
// Handler
// ============================================================
export default createSimpleGetHandler({
  schema: ${typeName}Schema,
  buildFilters: () => ({ conditions: "", params: [] }),
  buildQuery,
  successMessage: "Data ${rawFileName.replace(/-/g, " ")} berhasil diambil.",
  emptyMessage: (branch) => \`Tidak ada data untuk branch '\${branch}'.\`,
  errorContext: "${typeName}",
});
`;

// ─────────────────────────────────────────────
// 📝 TEMPLATE: Manual Handler
// ─────────────────────────────────────────────
const manualTemplate = `import { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "@/lib/db";
import { checkMethod, handleServerError } from "@/lib/apiHandler";
import { getRequestBranch } from "@/utils/getRequestBranch";

import type { ApiResponse } from "@/types/api";

/**
 * =========================================
 * 🔌 API ROUTE: ${typeName}
 * =========================================
 *
 * 📍 Endpoint: ${routePath}
 * 📄 File: src/pages/api/${apiName}.ts
 *
 * 📌 Jenis: Manual (handler kosong)
 */

// ============================================================
// Query Builder
// ============================================================
const buildQuery = () => \`
  SELECT *
  FROM your_table
  LIMIT 10
\`;

// ============================================================
// Handler
// ============================================================
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<unknown>>,
) {
  if (!checkMethod(req, res, "GET")) return;

  const branch = getRequestBranch(req);

  try {
    const pool = getPool(branch);
    const { rows } = await pool.query(buildQuery());

    return res.status(200).json({
      success: true,
      message: "Data ${rawFileName.replace(/-/g, " ")} berhasil diambil.",
      total: rows.length,
      data: rows,
    });
  } catch (error) {
    return handleServerError(res, error, branch, "${typeName}");
  }
}
`;

// ─────────────────────────────────────────────
// 🚀 EKSEKUSI
// ─────────────────────────────────────────────
async function main() {
  const handlerType = await askHandlerType();
  rl.close();

  let template: string;
  let typeLabel: string;

  if (handlerType === "paginated") {
    template = paginatedTemplate;
    typeLabel = "Paginated (search + pagination)";
  } else if (handlerType === "simple") {
    template = simpleTemplate;
    typeLabel = "Simple (tanpa pagination)";
  } else {
    template = manualTemplate;
    typeLabel = "Manual";
  }

  fs.mkdirSync(baseDir, { recursive: true });
  fs.writeFileSync(filePath, template);

  console.log(`\n✅ API route berhasil dibuat:`);
  console.log(`   📄 File        : ${filePath}`);
  console.log(`   🔌 Endpoint    : ${routePath}`);
  console.log(`   🧩 Handler     : ${handlerName}Handler`);
  console.log(`   📦 Jenis       : ${typeLabel}`);
  console.log(
    `   🗂️  Folder      : ${folders.length > 0 ? folders.join("/") : "(root api)"}`,
  );
  console.log(``);
  console.log(`💡 Cara test:`);
  console.log(`   curl http://localhost:3001${routePath}`);
}

main();
