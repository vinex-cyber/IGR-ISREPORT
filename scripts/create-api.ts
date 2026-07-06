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

// Schema paths
const schemaFileName = `${rawFileName}Schema.ts`;
const schemaFileDir = path.join(process.cwd(), "src", "schema", ...folders);
const schemaFilePath = path.join(schemaFileDir, schemaFileName);
const schemaImportPath =
  folders.length > 0
    ? `${folders.join("/")}/${rawFileName}Schema`
    : `${rawFileName}Schema`;

// ─────────────────────────────────────────────
// 🎯 PROMPT: Pilih jenis handler
// ─────────────────────────────────────────────
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askHandlerType(): Promise<"simple" | "manual"> {
  return new Promise((resolve) => {
    console.log("\n📦 Pilih jenis handler:");
    console.log(
      "   1. Simple     - Ambil semua data tanpa pagination (createSimpleGetHandler)",
    );
    console.log("   2. Manual     - Handler kosong, tulis sendiri\n");

    rl.question("Pilihan (1/2) [default: 1]: ", (answer) => {
      const choice = answer.trim() || "1";

      if (choice === "2") resolve("manual");
      else resolve("simple");
    });
  });
}

function askSchemaLocation(): Promise<"inline" | "separate"> {
  return new Promise((resolve) => {
    console.log("\n📐 Letak schema:");
    console.log("   1. Inline   - Schema di dalam file API route");
    console.log("   2. Terpisah - Schema di src/schema/ (import otomatis)\n");

    rl.question("Pilihan (1/2) [default: 1]: ", (answer) => {
      const choice = answer.trim() || "1";
      resolve(choice === "2" ? "separate" : "inline");
    });
  });
}

// ─────────────────────────────────────────────
// 📝 TEMPLATE: Schema file (terpisah)
// ─────────────────────────────────────────────
const schemaTemplate = `// schema/${apiName}Schema.ts
import { z } from "zod";

export const ${typeName}Schema = z.object({
  search: z.string().trim().optional().default(""),
  // TODO: tambah field filter lain sesuai kebutuhan
  // div: z.string().trim().optional(),
});

export type ${typeName}Filters = z.infer<typeof ${typeName}Schema>;
`;



// ─────────────────────────────────────────────
// 📝 TEMPLATE: Simple Handler — Inline
// ─────────────────────────────────────────────
const simpleInline = `import { z } from "zod";
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
 * 📐 Schema: Inline
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
// 📝 TEMPLATE: Simple Handler — Terpisah
// ─────────────────────────────────────────────
const simpleSeparate = `import { createSimpleGetHandler } from "@/lib/handlerFactory";
import { ${typeName}Schema } from "@/schema/${schemaImportPath}";

/**
 * =========================================
 * 🔌 API ROUTE: ${typeName}
 * =========================================
 *
 * 📍 Endpoint: ${routePath}
 * 📄 File: src/pages/api/${apiName}.ts
 *
 * 📌 Jenis: Simple (ambil semua data tanpa pagination)
 * 📐 Schema: Terpisah (src/schema/${schemaImportPath})
 */

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
// 📝 TEMPLATE: Manual Handler — Inline
// ─────────────────────────────────────────────
const manualInline = `import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
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
 * 📐 Schema: Inline
 */

// ============================================================
// Schema
// ============================================================
const ${typeName}Schema = z.object({
  // TODO: tambah field filter sesuai kebutuhan
});

type ${typeName}Filters = z.infer<typeof ${typeName}Schema>;

// ============================================================
// Query Builder
// ============================================================
const buildQuery = (filters: ${typeName}Filters) => \`
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

  const parsed = ${typeName}Schema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Parameter query tidak valid.",
      errors: parsed.error.flatten(),
    });
  }

  const filters = parsed.data;
  const branch = getRequestBranch(req);

  try {
    const pool = getPool(branch);
    const { rows } = await pool.query(buildQuery(filters));

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
// 📝 TEMPLATE: Manual Handler — Terpisah
// ─────────────────────────────────────────────
const manualSeparate = `import { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "@/lib/db";
import { checkMethod, handleServerError } from "@/lib/apiHandler";
import { getRequestBranch } from "@/utils/getRequestBranch";
import { ${typeName}Schema, type ${typeName}Filters } from "@/schema/${schemaImportPath}";

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
 * 📐 Schema: Terpisah (src/schema/${schemaImportPath})
 */

// ============================================================
// Query Builder
// ============================================================
const buildQuery = (filters: ${typeName}Filters) => \`
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

  const parsed = ${typeName}Schema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Parameter query tidak valid.",
      errors: parsed.error.flatten(),
    });
  }

  const filters = parsed.data;
  const branch = getRequestBranch(req);

  try {
    const pool = getPool(branch);
    const { rows } = await pool.query(buildQuery(filters));

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
  const schemaLocation = await askSchemaLocation();
  rl.close();

  let template: string;
  let typeLabel: string;
  let hasSeparateSchema = false;

  if (handlerType === "simple") {
    template = schemaLocation === "separate" ? simpleSeparate : simpleInline;
    typeLabel = "Simple (tanpa pagination)";
    hasSeparateSchema = schemaLocation === "separate";
  } else {
    template = schemaLocation === "separate" ? manualSeparate : manualInline;
    typeLabel = "Manual";
    hasSeparateSchema = schemaLocation === "separate";
  }

  // Buat file API
  fs.mkdirSync(baseDir, { recursive: true });
  fs.writeFileSync(filePath, template);

  // Buat file schema terpisah jika dipilih
  if (hasSeparateSchema) {
    fs.mkdirSync(schemaFileDir, { recursive: true });
    fs.writeFileSync(schemaFilePath, schemaTemplate);
  }

  console.log(`\n✅ API route berhasil dibuat:`);
  console.log(`   📄 File        : ${filePath}`);
  console.log(`   🔌 Endpoint    : ${routePath}`);
  console.log(`   🧩 Handler     : ${handlerName}Handler`);
  console.log(`   📦 Jenis       : ${typeLabel}`);
  console.log(`   📐 Schema      : ${schemaLocation === "separate" ? `Terpisah (${schemaFilePath})` : "Inline"}`);
  console.log(
    `   🗂️  Folder      : ${folders.length > 0 ? folders.join("/") : "(root api)"}`,
  );
  console.log(``);
  console.log(`💡 Cara test:`);
  console.log(`   curl http://localhost:3001${routePath}`);
}

main();
