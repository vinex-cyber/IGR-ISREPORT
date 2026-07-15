# Next CPG

> **Consumer Packaged Goods** — Internal reporting dan analytics aplikasi. Multi-branch PostgreSQL, export Excel/PDF, form filter interaktif.

---

## Daftar Isi

- [Stack](#stack)
- [Quick Start](#quick-start)
- [Environment](#environment)
- [Struktur Project](#struktur-project)
- [Branch Database](#branch-database)
- [Code Generator](#code-generator)
- [API Route](#api-route)
- [Halaman (Page)](#halaman-page)
- [Komponen](#komponen)
- [Form System](#form-system)
- [Hooks](#hooks)
  - [useAnimeCounter](#useanimecounter)
  - [useAnimeOnScroll](#useanimeonscroll)
  - [useAnimeHover](#useanimehover)
  - [animePresets](#animepresets)
- [Export](#export)
- [Rich Text Editor (Tiptap)](#rich-text-editor-tiptap)
- [Scripts](#scripts)

---

## Stack

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | Next.js 16 (Pages Router), React 19, TypeScript |
| **Database** | PostgreSQL via `pg` — koneksi pool per branch |
| **UI** | Tailwind CSS v4, shadcn/ui (Radix primitives), `lucide-react` |
| **Form** | `react-hook-form` + `@hookform/resolvers` + `zod` |
| **Editor** | Tiptap v3 (`@tiptap/react`), `jspdf` + `jspdf-autotable` (PDF) |
| **Data Fetching** | `axios`, `useFetchData` (manual state) |
| **Charts** | `recharts` |
| **Export** | `exceljs` (Excel), `jspdf` + `jspdf-autotable` (PDF) |
| **Date** | `date-fns`, `react-day-picker` |

---

## Quick Start

```bash
npm install
npm run dev        # → http://localhost:3001
npm run build      # production build
npm run lint       # ESLint
```

---

## Environment

Buat `.env.local` di root:

```env
# ── Koneksi Database per Branch ──────────────────────────
# Format: DB_HOST_<BRANCH>=<host>
DB_HOST_IGRCPG=your_db_host
DB_HOST_ICMCPG=your_db_host
DB_NAME_IGRCPG=igrcpg
DB_NAME_ICMCPG=icmcpg

# Credentials (shared)
PG_USER=your_user
PG_PASSWORD=your_password
PG_PORT=5432

# ── Daftar Branch (wajib) ────────────────────────────────
NEXT_PUBLIC_DATABASE_OPTIONS=[{"label":"IGRCPG","value":"IGRCPG"},{"label":"ICMCPG","value":"ICMCPG"}]

# ── Branch Default ──────────────────────────────────────
NEXT_PUBLIC_APP_NAME=IGRCPG

# ── IP → Branch Mapping (opsional) ──────────────────────
# BRANCH_NETWORK_MAP={"192.168.1.":"IGRCPG"}
```

---

## Struktur Project

```
src/
├── components/
│   ├── ui/                    # shadcn/ui primitives (46 komponen)
│   ├── animation/             # Wrapper animasi
│   │   └── Reveal.tsx          # Scroll-reveal (fade + slide, arah configurable)
│   ├── form/shared/           # Field form reusable
│   │   ├── PeriodeRange.tsx    # Range date picker
│   │   ├── SelectDivisi.tsx    # Select dengan dependensi
│   │   ├── SelectDepartement.tsx
│   │   ├── SelectKategori.tsx
│   │   ├── CardMember.tsx      # Field member lengkap
│   │   ├── CardProduk.tsx      # Field produk lengkap
│   │   ├── CardKasir.tsx       # Field kasir lengkap
│   │   └── ...                 # 25 total shared components
│   ├── form/informasi-promosi/
│   │   └── FormInformasiPromosi.tsx # Form input PLU → navigasi ke [prdcd]
│   ├── input/                  # Input dengan modal pencarian
│   │   ├── InputProdukPlu.tsx
│   │   ├── InputKodeGift.tsx
│   │   ├── InputKodeMember.tsx
│   │   ├── InputKodeCashback.tsx
│   │   └── ...                 # 10 total input components
│   ├── table/
│   │   └── ReportTable.tsx    # Tabel laporan universal
│   ├── Settings/
│   │   └── SettingsDatabase.tsx # Pemilih branch (dropdown)
│   ├── Layout.tsx              # Layout utama + Navbar
│   ├── ReportHeader.tsx        # Header laporan (title + export + refresh)
│   └── LoadingIgr.tsx          # Skeleton loading + spinner
│
├── configs/                   # Konfigurasi per fitur
│   ├── database-options.ts     # Branch database dari env
│   ├── branch-network-map.ts   # IP → branch mapping
│   ├── produk-baru/            # Produk Baru config
│   │   ├── produk-baru-config.ts
│   │   └── filter-default-value.ts
│   ├── evaluasi-sales/         # 12 file konfigurasi
│   ├── form-so-harian/
│   ├── lpp-saat-ini/
│   └── supplierConfig.ts
│
├── hooks/                     # React Hooks
│   ├── useReportPage.ts        # Orchestrator utama halaman laporan
│   ├── useFetchData.ts         # Generic data fetcher
│   ├── useReportQueryEndpoint.ts # Baca query dari URL
│   ├── useExportToExcel.ts     # Export Excel
│   ├── useReportTableLogic.ts  # Filter + total + periode
│   ├── useLookupData.ts        # Server/Client lookup dgn cache
│   ├── useDependentSelect.ts   # Select cascading
│   ├── useFilteredData.ts      # Client-side search filter
│   ├── useGroupedOptions.ts    # Grouped select options
│   ├── useTotalRow.ts          # Total baris kalkulasi
│   └── ...
│
├── lib/
│   ├── db.ts                   # PostgreSQL pool manager
│   ├── handlerFactory.ts       # Factory API handler
│   ├── apiHandler.ts           # checkMethod + handleServerError
│   └── axiosClient.ts          # Axios instance (baseURL: /api)
│
├── pages/                     # Pages + API routes
│   ├── index.tsx               # Home
│   ├── _app.tsx                # App wrapper
│   ├── api/                    # API endpoints
│   │   ├── daftar-produk.ts
│   │   ├── select-divisi.ts
│   │   ├── evaluasi-sales/     # 12 endpoint
│   │   ├── form-so-harian/
│       │   ├── informasi-promosi/  # data-produk, data-trend-sales
│   │   └── inventory/
│   ├── evaluasi-sales/
│   ├── form-so-harian/
│   │   └── [prdcd]/
│   ├── informasi-promosi/
│   │   ├── index.tsx          # Landing: form + kartu + tabel promo (scroll-reveal)
│   │   ├── KartuProduk.tsx    # Kartu produk (fetch API, shadcn Button)
│   │   ├── TabelTrendSales.tsx # Trend sales 12 bulan (fetch API, unpivot)
│   │   ├── TabelSettingHarga.tsx, TabelMemberPricing.tsx, TabelPromo*.tsx
│   │   └── [prdcd]/
│   │       └── index.tsx      # Detail produk by PLU (KartuProduk + TabelTrendSales)
│   └── inventory/
│       ├── produk-baru/
│       │   └── table-produk-baru/
│       └── lpp-saat-ini/
│
├── schema/                    # Zod validation schemas
│   ├── filterProdukBaru.ts
│   ├── filterLppSaatIni.ts
│   ├── filterFormSoHarian.ts
│   └── filterDetailStruk.ts
│
├── types/                     # TypeScript type definitions
│   ├── api.ts                 # ApiResponse<T>, ApiSuccess, ApiError
│   ├── report.ts              # ColumnConfig<T>
│   └── queryParams.ts         # QueryParam type
│
└── utils/
    ├── filters/               # SQL filter builders
    ├── query/                 # SQL query builders
    │   ├── queryGroupFlag.ts  # Flag produk (NAS/IGR/OMI/IDM/BRD/DEPO)
    │   ├── queryAvgSalesBulanan.ts # Rata-rata sales bulanan
    │   ├── queryPbOut.ts      # PB Outstanding (14 hari terakhir)
    │   └── queryTrendSales.ts # Trend sales bulanan (sls_qty_01..12, st_sales/hpp untuk bulan berjalan)
    ├── formatPlu.ts           # Format & validasi PLU/prdcd (pad 7 digit, digit akhir 0)
    ├── pagination/            # Pagination helpers
    ├── server/                # Server helpers
    ├── exportToPdf/
    ├── ExportExcel/
    ├── branchCookie.ts        # Client-side cookie (set/get)
    ├── getRequestBranch.ts    # Server-side branch detection
    └── reportBuilder.ts       # buildReport() dari ColumnConfig
```

---

## Branch Database

Aplikasi terhubung ke **beberapa database branch** sekaligus. Sistem pendeteksian branch:

### Alur Client

```
SettingsDatabase (dropdown)
      │
      ├── setBranchCookie(value)  → cookie "selected_branch"
      └── onChange(value)         → state React
```

### Alur Server (API)

```
getRequestBranch(req)
      │
      ├── 1. Cookie "selected_branch"  (prioritas)
      ├── 2. IP Address → branch-network-map
      └── 3. Default (NEXT_PUBLIC_APP_NAME)
```

### Konfigurasi Mapping IP

File `src/configs/branch-network-map.ts` membaca env `BRANCH_NETWORK_MAP`:

```json
{
  "192.168.1." : "IGRCPG",
  "10.0.0.0/24": "ICMCPG"
}
```

3 tipe pattern: **exact** IP, **CIDR** (`/24`), **prefix** (tanpa slash).

### Client-side Cookie

```typescript
import { getBranchCookie, setBranchCookie } from "@/utils/branchCookie";

setBranchCookie("IGRCPG");       // simpan 30 hari
const branch = getBranchCookie(); // baca
```

---

## Code Generator

Semua generator ada di `scripts/`. Nama **wajib kebab-case**.

```bash
npm run create:api      <path/nama>    # → src/pages/api/...ts
npm run create:page     <path/nama>    # → src/pages/...tsx
npm run create:config   <path/nama>    # → src/configs/...Config.ts
npm run create:component <Nama>        # → src/components/...tsx
```

### `create:api`

Membuat API route di `src/pages/api/`. Prompt interaktif:

**1. Jenis Handler:**

| Pilihan | Fungsi | Response |
|---------|--------|----------|
| `Simple` | Semua data tanpa pagination via `createGetHandler` | `{ total, data }` |
| `Manual` | Handler custom dari nol | Terserah |

**2. Letak Schema Zod:**

| Pilihan | Hasil |
|---------|-------|
| `Inline` | Schema di dalam file API route |
| `Terpisah` | Schema di `src/schema/`, API route import |

### `create:page`

Membuat page di `src/pages/`. Prompt interaktif:

**1. Format File:**

| Pilihan | Hasil | Contoh |
|---------|-------|--------|
| `Folder` | `src/pages/.../nama/index.tsx` | `master-lokasi/index.tsx` |
| `Flat` | `src/pages/.../nama.tsx` | `master-lokasi.tsx` |

**2. Template (dulu ada pilihan Report/Form/Kosong, sekarang minimal):**

```tsx
// src/pages/nama/index.tsx
import Layout from "@/components/Layout";

export default function NamaPage() {
  return (
    <Layout title="Nama">
      <h1 className="text-2xl font-bold mb-4">Nama</h1>
    </Layout>
  );
}
```

### `create:config`

Membuat file di `src/configs/`:

```typescript
// Output: src/configs/<path>/<nama>Config.ts
export type MyFeatureRows = { field1: string; field2: number };
export const myFeatureColumns: ColumnConfig<MyFeatureRows>[] = [ ... ];
```

### `create:component`

Membuat React component di `src/components/`:

```bash
npm run create:component UserProfile           # Client Component
npm run create:component UserProfile --server   # Server Component
```

---

## API Route

### Simple Handler (via Factory)

```typescript
import { createGetHandler } from "@/lib/handlerFactory";
import type { QueryParam } from "@/types/queryParams";

const buildQuery = () => `
  SELECT * FROM my_table ORDER BY id
`;

export default createGetHandler({
  schema: z.object({}),
  buildFilters: () => ({ conditions: "1=1", params: [] }),
  buildQuery,
  successMessage: "Data berhasil diambil.",
  emptyMessage: (branch) => `Tidak ada data untuk branch '${branch}'.`,
  errorContext: "MyFeature",
});
```

**Response:** `{ success, message, total, data }`

Dengan filter:

```typescript
import { z } from "zod";
import { createGetHandler } from "@/lib/handlerFactory";
import type { QueryParam } from "@/types/queryParams";

const MySchema = z.object({
  search: z.string().trim().optional().default(""),
  startDate: z.string().optional(),
});

type MyFilters = z.infer<typeof MySchema>;

function buildFilters(filters: MyFilters) {
  if (!filters.search) return { conditions: "1=1", params: [] };

  const conditions = `name ILIKE $1`;
  const params: QueryParam[] = [`%${filters.search}%`];
  return { conditions, params };
}

function buildQuery(conditions: string) {
  return `SELECT * FROM my_table WHERE ${conditions} ORDER BY id`;
}

export default createGetHandler<MyFilters>({
  schema: MySchema,
  buildFilters,
  buildQuery,
  successMessage: "Data berhasil diambil.",
  emptyMessage: (branch) => `Tidak ada data untuk branch '${branch}'.`,
  errorContext: "MyFeature",
});
```

### Manual Handler (Custom)

Untuk kebutuhan khusus yang tidak cocok dengan factory:

```typescript
import { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "@/lib/db";
import { checkMethod, handleServerError } from "@/lib/apiHandler";
import { getRequestBranch } from "@/utils/getRequestBranch";

export default async function handler(req, res) {
  if (!checkMethod(req, res, "GET")) return;

  const branch = getRequestBranch(req);
  try {
    const pool = getPool(branch);
    const { rows } = await pool.query("SELECT * FROM my_table");
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return handleServerError(res, error, branch, "MyFeature");
  }
}
```

### Pagination (Client-side)

Pagination ditangani di client oleh `useReportPage`. API cukup mengembalikan semua data (via `createGetHandler`).

---

## Navbar / Menu

Menu navbar ada di `src/components/navbar/menus/`. Setiap menu dikelompokkan per modul:

```
src/components/navbar/menus/
├── index.ts              # Re-export semua menu
├── inventory-menu.ts     # Menu Inventory
├── store-menu.ts         # Menu Store
├── logistik-menu.ts      # Menu Logistik
└── web-ho-menu.ts        # Menu Web HO
```

### Menambahkan Route Baru

Edit file menu yang sesuai, tambah item:

```ts
{
  title: "Nama Menu",
  href: "/path/halaman",
  description: "Penjelasan singkat halaman ini.",
}
```

Contoh — `inventory-menu.ts`:

```ts
export const INVENTORY_MENU = [
  { title: "Produk Baru", href: "/inventory/produk-baru", description: "..." },
  { title: "Master Lokasi", href: "/inventory/master-lokasi", description: "..." },
] satisfies readonly NavbarMenuItem[];
```

Tidak perlu edit `index.ts` — dia otomatis re-export semua file menu.

---

## Halaman (Page)

### Report Page (Tabel Laporan)

Gunakan `useReportPage` + `buildReport` + `ReportTable`:

```typescript
import { useReportPage } from "@/hooks/useReportPage";
import { buildReport } from "@/utils/reportBuilder";
import { ReportTable } from "@/components/table/ReportTable";

const config = buildReport<MyRows>(myColumns);
const {
  filteredData,    // T[] | undefined
  loading,         // boolean
  error,           // string | null
  title,           // string
  periode,         // string (format: "01 Jan - 05 Jul 2026")
  handleExport,    // () => Promise<void>
  handleRefresh,   // () => Promise<void>
  isRefreshing,    // boolean
  isExporting,     // boolean
} = useReportPage<MyRows>({
  endpoint: "my-feature",     // tanpa /api
  reportTitle: "My Report",
  ...config,                   // allFields, numericFields, searchableFields, headers, mapRow
});
```

Query params (`startDate`, `endDate`, `branch`, dll) otomatis terbaca dari URL melalui `useReportQueryEndpoint`.

**Dengan Pagination (client-side):**

```typescript
const { page, setPage, limit, setLimit, total, totalPages } = useReportPage({
  endpoint: "my-feature",
  paginated: true,
  defaultLimit: 100,
  ...config,
});
```

Saat `paginated: true`, `useReportPage` mengirim `export: true` ke API (ambil semua data), lalu melakukan filter & pagination di client. Eksport Excel menggunakan seluruh data (tanpa filter search).

### Form Filter Page

Gunakan `react-hook-form` + `zodResolver`:

```typescript
const methods = useForm<MyInput>({
  resolver: zodResolver(MySchema),
  defaultValues: getMyDefaultValues(),
});

const onSubmit = (data) => {
  const params = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    if (key === "branch" || !value) return;
    params.append(key, String(value));
  });
  router.push(`/my-feature/table?${params}`);
};
```

**Komponen form yang tersedia:**

| Komponen | Fungsi |
|----------|--------|
| `PeriodeRange` | Range date picker (DD-MM-YYYY) |
| `SelectDivisi` | Cascading select divisi |
| `SelectDepartement` | Cascading select departemen |
| `SelectKategori` | Cascading select kategori |
| `SelectBranch` | Pilih branch database |
| `CardProduk` | Field produk lengkap (PLU, nama, barcode, dll) |
| `CardMember` | Field member lengkap (kode, nama, outlet, dll) |
| `CardKasir` | Field kasir lengkap (kode, station, method) |
| `CardSupplier` | Field supplier (kode, nama) |
| `CardPromo` | Field promo (gift, cashback) |

Semua komponen form sudah **generic** (`<TFieldValues extends FieldValues>`) dan kompatibel dengan `react-hook-form` `control`.

### SettingsDatabase

Setiap halaman yang butuh pemilihan branch:

```typescript
<SettingsDatabase
  value={branch}
  onChange={setBranch}
  options={DATABASE_OPTIONS}
/>
```

Simpan branch di cookie via `setBranchCookie`, baca di server via `getRequestBranch(req)`.

---

## Fitur: Informasi Promosi

Halaman produk & promosi berbasis PLU. Dua route:

| Route | Fungsi |
|-------|--------|
| `/informasi-promosi` | Landing: form input PLU, kartu produk, tabel promo (scroll-reveal per blok) |
| `/informasi-promosi/[prdcd]` | Detail produk berdasarkan PLU — kartu produk + trend sales bulanan |

### Alur Form → Detail

`FormInformasiPromosi` (`components/form/informasi-promosi/`) memformat PLU lalu `router.push('/informasi-promosi/[formattedPlu]')`. Halaman `[prdcd]` membaca `prdcd` dari URL dan meneruskannya ke `KartuProduk` + `TabelTrendSales`.

### API

**1. `GET /informasi-promosi/data-produk?prdcd=<plu>`** → `{ total, data }`

- Handler: `createGetHandler` dengan `buildFilters` (filter `prd_prdcd` opsional) + `buildQuery`.
- Query builder: `queryGroupFlag` (flag NAS/IGR/OMI/IDM/BRD/DEPO), `queryAvgSalesBulanan`, `queryPbOut` (PB outstanding 14 hari). Semua menerima `plu?` dan menaruh filter `AND prd_prdcd = $1` bila ada.
- `KartuProduk` mengambil data via `useQueryData` (endpoint `__/informasi-promosi/data-produk`, tanpa prefix `/api` karena `axiosClient` sudah `baseURL: "/api"`).

**2. `GET /informasi-promosi/data-trend-sales?prdcd=<plu>`** → `{ total, data }`

- Handler: `createGetHandler` dengan `buildFilters` (filter `sls_prdcd` opsional) + `buildQuery`.
- Query builder: `queryTrendSales` — query `TBTR_SALESBULANAN` dengan JOIN ke `TBMASTER_STOCK` (st_sales, hpp).
- Response: single row per PLU dengan kolom pivoted `sls_qty_01..12`, `sls_rph_01..12`, `st_sales`, `hpp`.

### TabelTrendSales

Komponen tabel 12 baris (JAN–DES). Fetch dari API `/informasi-promosi/data-trend-sales`, lalu unpivot kolom:

| Bulan | QTY | Rupiah |
|-------|-----|--------|
| JAN | `sls_qty_01` | `sls_rph_01` |
| ... | ... | ... |
| Bulan berjalan | `st_sales` | `hpp` |
| ... | ... | ... |
| DES | `sls_qty_12` | `sls_rph_12` |

- **Bulan berjalan** menggunakan `st_sales` (QTY) dan `hpp` (rupiah) dari `TBMASTER_STOCK`, bukan dari kolom `sls_qty_XX`/`sls_rph_XX`.
- Highlight `bg-amber-200` pada baris bulan berjalan.
- Progress animation 0→1 saat masuk viewport (anime.js `outExpo`).
- `useAnimeOnScroll` dengan stagger per baris.
- Tanpa `plu` prop → tampilkan placeholder "Pilih PLU".

### formatPlu

Util wajib untuk semua input PLU/prdcd — pad ke 7 digit, paksa digit terakhir `0`, dan bisa validasi angka saja:

```ts
import { formatPlu } from "@/utils/formatPlu";

formatPlu("123");            // "0000120"
formatPlu("123,456");       // "0000120,0000450"
formatPlu("123", { validate: true }); // throw kalau ada non-angka
```

### Animasi

Seluruh blok di-wrap `<Reveal>` (lihat [Reveal](#reveal-scroll-reveal-wrapper)) → efek "pindah halaman" saat scroll. Tabel promo selang-seling `direction="left"` / `"right"`.

---

## Komponen

### ReportTable

Tabel universal untuk semua laporan. Fitur:

- Search bar client-side
- Sticky header + footer
- Column grouping (multi-row header)
- Skeleton loading
- Pagination (Prev/Next, limit selector)
- Total row otomatis (numeric fields dijumlah)
- Row numbering opsional
- Action column per row

```typescript
<ReportTable
  columns={myColumns}
  data={filteredData ?? []}
  keyField={(row) => row.id}
  showRowNumber
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  onSearchReset={() => setSearchTerm("")}
  page={page}
  limit={limit}
  total={total}
  totalPages={totalPages}
  onPageChange={setPage}
  onLimitChange={setLimit}
  isRefreshing={isRefreshing}
/>
```

### Layout

Mengatur title, favicon (berubah per branch), background (berubah per branch), navbar.

```typescript
<Layout title="Produk Baru" branch={branch}>
  {children}
</Layout>
```

### ReportHeader

Header laporan dengan title, periode, tombol export Excel, refresh, dan tombol kembali.

```typescript
<ReportHeader
  title={title}
  periode={periode}
  onExport={handleExport}
  onRefresh={handleRefresh}
  isRefreshing={isRefreshing}
  isExporting={isExporting}
/>
```

### LoadingIgr

Skeleton table 13×10 + spinner + logo IGR.

### ColumnConfig (Tipe)

```typescript
type ColumnConfig<T> = {
  field: keyof T;         // field dari data
  label: string;          // label kolom
  isNumeric?: boolean;    // auto format number + total
  isSearchable?: boolean; // ikut pencarian client
  group?: string;         // grouping header
  groupColor?: string;    // warna header group (Tailwind)
};
```

### Input dengan Modal Pencarian

| Komponen | Modal | Search By |
|----------|-------|-----------|
| `InputProdukPlu` | `InputProdukModal` | PLU, barcode, nama |
| `InputNamaProduk` | `InputProdukModal` | Nama barang |
| `InputKodeGift` | `InputGiftModal` | Kode gift |
| `InputKodeCashback` | `InputCashbackModal` | Kode cashback |
| `InputKodeMember` | `InputKodeMemberModal` | No member, nama |
| `InputSerchSupplier` | `SupplierModal` | Kode supplier |
| `InputNamaSupplier` | `SupplierModal` | Nama supplier |
| `InputKodeKair` | `InputKodeKasirModal` | Kode kasir |
| `InputMonitoringPlu` | `InputMonitoringPluModal` | PLU |

Semua mendukung mode `multiple`, `append`, `separator`, `allowManualInput`.

---

### Reveal (Scroll-Reveal Wrapper)

Wrapper animasi berbasis `IntersectionObserver` + anime.js. Setiap elemen dibungkus `<Reveal>` akan memutar animasi **fade + slide** saat masuk viewport (replay setiap kali masuk).

```tsx
import Reveal from "@/components/animation/Reveal";

<Reveal>
  <TabelPromoCashback />
</Reveal>

{/* arah slide bisa diatur */}
<Reveal direction="left">  <TabelPromoCashback /></Reveal>  {/* masuk dari kiri  */}
<Reveal direction="right"> <TabelPromoGift /></Reveal>     {/* masuk dari kanan */}
<Reveal direction="up">    <KartuProduk /></Reveal>        {/* default: dari atas */}
```

| Prop | Type | Default | Keterangan |
|------|------|---------|-----------|
| `children` | `ReactNode` | — | Konten yang dianimasi |
| `className` | `string` | `""` | Class tambahan |
| `direction` | `"up" \| "left" \| "right"` | `"up"` | Arah slide masuk |
| `duration` | `number` (ms) | `500` | Durasi animasi (bisa diubah per blok) |
| `ease` | `string` | `"outQuad"` | Easing anime.js (mis. `outCubic`) |

---

## Form System

### useDependentSelect

Hook untuk cascading select (parent-child). Digunakan oleh `SelectDivisi`, `SelectDepartement`, `SelectKategori`.

```typescript
const { options, parentValue } = useDependentSelect({
  control,
  name: "dept",
  parentName: "div",
  data: rawData,                 // T[]
  filterFn: (item, parent) => ..., // filter logic
  getOption: (item) => ({ label: item.name, value: item.code }),
  includeAllOption: true,
  allLabel: "All",
});
```

### Form Field Convention

Semua field form:

1. Terima `control: Control<FormType>` dari react-hook-form
2. Generic `<TFieldValues extends FieldValues>`
3. Gunakan `Controller` atau `useController`
4. Support `disabled`, `placeholder`, `className`

---

## Hooks

### useReportPage (Orchestrator)

Hook utama untuk halaman laporan. Menggabungkan:

```
useReportQueryEndpoint → useFetchData → useRefreshRouter → useReportTableLogic → useExportToExcel
```

**Input utama:**

| Prop | Type | Default |
|------|------|---------|
| `endpoint` | `string` | — |
| `reportTitle` | `string` | URL `selectedReport` |
| `searchableFields` | `(keyof T)[]` | — |
| `numericFields` | `(keyof T)[]` | — |
| `headers` | `string[]` | — |
| `allFields` | `(keyof T)[]` | — |
| `mapRow` | `(row) => (string\|number)[]` | — |
| `paginated` | `boolean` | `false` |
| `customFetch` | `CustomFetchOptions` | — |

**Return:**

| Field | Type |
|-------|------|
| `data`, `filteredData` | `T[] \| null \| undefined` |
| `loading`, `error`, `isRefreshing`, `isExporting` | `boolean \| string \| null` |
| `title`, `periode` | `string` |
| `handleExport`, `handleRefresh`, `refetch` | Function |
| `searchTerm`, `setSearchTerm` | State |
| `page`, `setPage`, `limit`, `setLimit`, `total`, `totalPages` | Pagination |

### useFetchData

Generic fetcher dengan `axiosClient`.

```typescript
const { data, loading, error, refetch } = useFetchData<T>({
  endpoint: "inventory/produk-baru",
  queryParams: { startDate, endDate, branch },
  enabled: true,
});
```

### useLookupData

Lookup dengan caching + branch detection. Dua mode:

| Mode | Behavior |
|------|----------|
| `"client"` | Fetch semua, filter di client |
| `"server"` | Server-side paginated search (minSearch threshold) |

Otomatis clear cache saat branch berubah (poll cookie tiap 300ms).

### useAnimeCounter

Animated counter dengan anime.js. Cocok untuk angka statistik, stock, sales.

```typescript
import { useAnimeCounter } from "@/hooks/useAnimeCounter";

const stock = useAnimeCounter({ to: 2067, duration: 1200 });
const sales = useAnimeCounter({ to: 565186, duration: 1200, delay: 300 });

return (
  <div>
    <p>Stock: {stock.value.toLocaleString()}</p>
    <p>Sales: {sales.value.toLocaleString()}</p>
  </div>
);
```

| Option | Type | Default |
|--------|------|---------|
| `to` | `number` | — |
| `from` | `number` | `0` |
| `duration` | `number` (ms) | `1000` |
| `ease` | `string` | `"outExpo"` |
| `autoplay` | `boolean` | `true` |
| `delay` | `number` (ms) | `0` |

Return: `{ value: number, start: () => void }` — `.start()` bisa dipanggil manual ulang.

### useAnimeOnScroll

Animasi entry saat elemen masuk viewport (IntersectionObserver).

```typescript
import { useAnimeOnScroll } from "@/hooks/useAnimeOnScroll";
import { presets } from "@/hooks/animePresets";

useAnimeOnScroll(".section-scroll", presets.staggerFadeUp(80), {
  childSelector: ".anim-child",
  triggerOnce: true,
});

useAnimeOnScroll(".section-scroll", presets.staggerFadeLeft(60), {
  childSelector: ".row-fade",
  threshold: 0.3,
});
```

**Cara kerja:**

1. Class `.section-scroll` dipasang di `<section>` target
2. Anak-anak elemen yang mau dianimasi dikasih class sesuai `childSelector` (misal `.anim-child` / `.row-fade`)
3. Saat section masuk viewport, anime.js jalan ke semua anak sekaligus

| Option | Type | Default |
|--------|------|---------|
| `threshold` | `number` | `0.2` |
| `rootMargin` | `string` | `"0px"` |
| `triggerOnce` | `boolean` | `true` |
| `staggerDelay` | `number` | — |
| `childSelector` | `string` | `".anim-item"` |

### useAnimeHover

Hover scale effect untuk tombol/kartu.

```typescript
import { useAnimeHover } from "@/hooks/useAnimeHover";

useAnimeHover(".btn-hover", { scale: 1.08 });
```

| Option | Type | Default |
|--------|------|---------|
| `scale` | `number` | `1.06` |
| `duration` | `number` (ms) | `200` |
| `ease` | `string` | `"outQuad"` |

### animePresets

Preset konfigurasi siap pakai — tinggal pilih:

| Preset | Efek |
|--------|------|
| `presets.fadeUp` | opacity 0→1, translateY 30→0 |
| `presets.fadeLeft` | opacity 0→1, translateX -20→0 |
| `presets.scaleIn` | scale 0→1, opacity 0→1 |
| `presets.bounceIn` | scale 0→1 dengan easing bounce |
| `presets.staggerFadeUp(delay)` | fadeUp + `stagger(delay)` per elemen |
| `presets.staggerFadeLeft(delay)` | fadeLeft + `stagger(delay)` per elemen |
| `presets.staggerScaleIn(delay)` | scaleIn + `stagger(delay)` per elemen |

Bisa juga pakai `AnimationParams` biasa kalau preset gak cocok:

```typescript
useAnimeOnScroll(".section-scroll", {
  opacity: [0, 1],
  scale: [0.8, 1],
  duration: 600,
  ease: "outBack",
}, { childSelector: ".anim-child" });
```

---

## Export

### Excel (Otomatis)

`useExportToExcel` terintegrasi dengan `useReportPage`:

```typescript
const { handleExport, isExporting } = useExportToExcel({
  title,
  data: filteredData ?? [],
  // atau fetchAll untuk paginated
  mapRow: (row) => [row.field1, row.field2, ...],
  totalRow,
  columns,
});
```

### PDF (Manual)

Ada dua jalur PDF:

1. **Laporan tabel** (`src/utils/exportToPdf/index.ts`) — `exportToPdf({ title, columns, data, mode })` dengan `mode: "preview" | "download" | "print"`.
2. **Surat / dokumen bebas** dari editor Tiptap (`src/utils/exportToPdf/editorPdf.ts`):

```typescript
import {
  buildEditorPdf,
  editorJsonToPdfBlobUrl,
  downloadEditorPdf,
  printEditorPdf,
} from "@/utils/exportToPdf/editorPdf";

// Preview: JSON editor → blob URL → iframe
const url = await editorJsonToPdfBlobUrl(json);
// Unduh
await downloadEditorPdf(json, "penawaran.pdf");
// Cetak langsung (autoPrint)
await printEditorPdf(json);
```

---

## Rich Text Editor (Tiptap)

Editor rich text berbasis Tiptap v3 untuk menyusun dokumen (mis. surat penawaran).
Render **WAJIB** via `dynamic(ssr:false)` di Pages Router.

```typescript
import { EditorTiptap } from "@/components/input/EditorTiptapDynamic";

<EditorTiptap
  value={content}
  onChange={setContent}
  editable
  toolbarOffset={96}        // px, jarak dari atas (di bawah navbar)
  contentMaxHeight="60vh"   // scroll area isi editor
  branch={branch}           // untuk kop surat per-branch
/>;
```

### Fitur
- **Toolbar persisten** (`editor/toolbar/EditorToolbar.tsx`): paragraf/judul 1–5, ukuran font (px),
  bold/italic/strike, list, kutipan, align teks, align tabel (kiri/tengah/kanan),
  sisip kop surat, sisip footer, sisip PLU, undo/redo.
- **Sisip footer** (`buildFooterContent` di `editor/letterhead.ts`): catatan (paragraf PPN 11%),
  paragraf penutup, dan tabel tanda tangan (rata kanan via `align: "right"`, class
  `letterhead-signature`).
- **Bubble toolbar** (`editor/toolbar/EditorBubbleMenu.tsx`): muncul saat teks diblok
  (paragraf/judul, ukuran font, bold/italic/strike, align).
- **Slash command** `/`: paragraf, heading, list, kutipan, garis pemisah (tipis/sedang/tebal),
  tabel, gambar, PLU.
- **Kop surat** per-branch (`configs/input/letterheadConfig.ts`): logo + nama + alamat + garis biru
  + tanggal + Lampiran/Perihal.
- **Tabel PLU**: header biru, border biru muda, tambah/hapus baris (nomor otomatis renumber),
  font mengikuti baris pertama tabel yang ada.
- Toolbar/bubble memakai `useEditorState` agar state (ukuran font, active) ikut update saat seleksi.
- **Modal Info Promo**: tombol "Info" di lookup PLU membuka `PromoInfoModal` yang menampilkan
  Cashback, Gift, Cashback Member, dan Promo MD (tabel `data-setting-harga`) secara berdampingan.
  Data dari API `data-promo-cashback`, `data-promo-gift`, `data-cashback-jenismember`,
  `data-setting-harga` (filter `prdcd`).
- **Export PDF menghormati align tabel**: tabel rata kiri/tengah/kanan di editor dipertahankan
  di PDF (diukur lebarnya lalu di-center/right), bukan selalu full-width.
- **Export PDF menghormati align teks per sel tabel**: `cellHalign`/`toAutoTableCell` di
  `editorPdf.ts` membaca `textAlign` paragraf tiap sel dan meneruskannya ke `autoTable`
  (`styles.halign`), sehingga align teks di dalam sel ikut di PDF.
- **Deskripsi tabel PLU rapat**: heading deskripsi yang langsung diikuti tabel diberi
  margin-top kecil dan gap bawah minim di PDF agar menempel ke tabelnya.

### Konvensi Penting
- Class editor di DOM adalah `.ProseMirror` (bukan `.tiptap`).
- `BubbleMenu` di-import dari `@tiptap/react/menus`.
- Dengan tabel `resizable:true`, atribut `class`/`style` tidak diteruskan ke `<table>`;
  disinkron oleh plugin di `editor/extensions/pluTable.ts`.
- Cetak: header "PDF.js viewer" + URL berasal dari header cetak browser — nonaktifkan via
  dialog print (uncheck "Headers and footers").

---

## Types

### ApiResponse

```typescript
type ApiSuccess<T> = {
  success: true;
  message: string;
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  data: T;
};

type ApiError = {
  success: false;
  message: string;
  errors?: unknown;
};

type ApiResponse<T> = ApiSuccess<T> | ApiError;
```

### ColumnConfig

```typescript
type ColumnConfig<T> = {
  field: keyof T;
  label: string;
  isNumeric?: boolean;
  isSearchable?: boolean;
  group?: string;
  groupColor?: string;
};
```

---

## Scripts

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | `next dev --turbopack` |
| `npm run build` | `next build` |
| `npm run lint` | `eslint src/` |
| `npm run start` | `next start` |
| `npm run create:api` | Generate API route (prompt interaktif) |
| `npm run create:page` | Generate page (prompt interaktif) |
| `npm run create:config` | Generate column config |
| `npm run create:component` | Generate component |

---

## Catatan

- Semua URL endpoint API menggunakan prefix `/api` (tidak perlu ditulis di hook)
- Branch otomatis terbaca dari cookie → IP → default (tidak perlu dikirim manual)
- Semua form field sudah generic dan reusable — jika perlu field baru, cek dulu di `components/form/shared/`
- Nama file/folder **wajib kebab-case** (kecuali komponen React yang PascalCase)
