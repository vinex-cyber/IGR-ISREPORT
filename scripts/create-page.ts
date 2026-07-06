// scripts/create-page.ts
import fs from "fs";
import path from "path";

const pageName = process.argv[2];

// ─────────────────────────────────────────────
// 🔐 VALIDASI: Hanya terima kebab-case + nested path
// ─────────────────────────────────────────────
const isValidKebabCase = (str: string): boolean => {
    return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);
};

if (!pageName) {
    console.error("❌ Masukkan nama page (contoh: informasi-promosi atau laporan/harian/penjualan)");
    console.error("   ⚠️  WAJIB kebab-case: huruf kecil, angka, dan dash (-) saja");
    console.error("   Format: npm run create:page <path/nama-page>");
    process.exit(1);
}

// ─────────────────────────────────────────────
// 🔧 HELPERS: Konversi ke format TypeScript/UI
// ─────────────────────────────────────────────

// Kebab-case → PascalCase (untuk Component): "informasi-promosi" → "InformasiPromosi"
const toPascalCase = (str: string): string => {
    return str
        .split("-")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
};

// Kebab-case → Title Case (untuk UI): "informasi-promosi" → "Informasi Promosi"
const toTitleCase = (str: string): string => {
    return str
        .split("-")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

// ─────────────────────────────────────────────
// 🧩 PROSES INPUT
// ─────────────────────────────────────────────
const parts = pageName.split("/");
const rawFileName = parts.pop()!; // "informasi-promosi"
const folders = parts;            // ["laporan", "harian"]

// 🔐 Validasi nama file HARUS kebab-case
if (!isValidKebabCase(rawFileName)) {
    console.error(`❌ Nama page tidak valid: "${rawFileName}"`);
    console.error("   ✅ Gunakan kebab-case: huruf kecil, angka, dash (-)");
    console.error("   📌 Contoh valid:");
    console.error("      - informasi-promosi");
    console.error("      - laporan-penjualan");
    console.error("      - dashboard-admin-2024");
    console.error("   🚫 Contoh invalid:");
    console.error("      - InformasiPromosi (PascalCase)");
    console.error("      - informasi_promosi (snake_case)");
    console.error("      - informasiPromosi (camelCase)");
    process.exit(1);
}

// 🔐 Validasi folder (jika ada) juga harus kebab-case
for (const folder of folders) {
    if (folder && !isValidKebabCase(folder)) {
        console.error(`❌ Nama folder tidak valid: "${folder}"`);
        console.error("   ✅ Folder juga harus kebab-case (huruf kecil + dash)");
        process.exit(1);
    }
}

// ─────────────────────────────────────────────
// 📁 BUILD PATH (folder/index.tsx)
// ─────────────────────────────────────────────
const baseDir = path.join(process.cwd(), "src", "pages", ...folders, rawFileName);
const filePath = path.join(baseDir, "index.tsx");

// 🔐 Cek jika file sudah ada
if (fs.existsSync(filePath)) {
    console.error(`❌ Page sudah ada: ${filePath}`);
    process.exit(1);
}

// ─────────────────────────────────────────────
// 🏷️ NAMING UNTUK COMPONENT & UI
// ─────────────────────────────────────────────
const componentName = toPascalCase(rawFileName);  // InformasiPromosi
const titleName = toTitleCase(rawFileName);       // Informasi Promosi

// ─────────────────────────────────────────────
// 📝 TEMPLATE (minimal, seperti master-lokasi)
// ─────────────────────────────────────────────
const template = `// src/pages/${pageName}/index.tsx
import Layout from "@/components/Layout";

export default function ${componentName}Page() {
  return (
    <Layout title="${titleName}">
      <h1 className="text-2xl font-bold mb-4">${titleName}</h1>
    </Layout>
  );
}
`;

// ─────────────────────────────────────────────
// 🚀 EKSEKUSI: Buat folder + tulis file
// ─────────────────────────────────────────────
fs.mkdirSync(baseDir, { recursive: true });
fs.writeFileSync(filePath, template);

console.log(`✅ Page berhasil dibuat:`);
console.log(`   📄 File        : ${filePath}`);
console.log(`   🧩 Component   : ${componentName}Page`);
console.log(`   🏷️  UI Title    : ${titleName}`);
console.log(`   🗂️  Folder      : src/pages/${pageName}`);