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
- [Export](#export)
- [Scripts](#scripts)

---

## Stack

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | Next.js 15 (Pages Router), React 19, TypeScript |
| **Database** | PostgreSQL via `pg` — koneksi pool per branch |
| **UI** | Tailwind CSS v4, shadcn/ui (Radix primitives), `lucide-react` |
| **Form** | `react-hook-form` + `@hookform/resolvers` + `zod` |
| **Data Fetching** | `axios`, `@tanstack/react-query` |
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
│   ├── form/shared/           # Field form reusable
│   │   ├── PeriodeRange.tsx    # Range date picker
│   │   ├── SelectDivisi.tsx    # Select dengan dependensi
│   │   ├── SelectDepartement.tsx
│   │   ├── SelectKategori.tsx
│   │   ├── CardMember.tsx      # Field member lengkap
│   │   ├── CardProduk.tsx      # Field produk lengkap
│   │   ├── CardKasir.tsx       # Field kasir lengkap
│   │   └── ...                 # 25 total shared components
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
│   │   └── inventory/
│   ├── evaluasi-sales/
│   ├── form-so-harian/
│   │   └── [prdcd]/
│   ├── informasi-promosi/
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

| Pilihan | Template | Cocok untuk |
|---------|----------|-------------|
| `Report` | `useReportPage` + `ReportTable` + `ReportHeader` | Laporan tabel dengan filter |
| `Form` | `react-hook-form` + `zodResolver` + `SettingsDatabase` | Halaman filter yang redirect ke tabel |
| `Kosong` | Layout + container kosong | Halaman statis / placeholder |

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

```typescript
import { exportToPdf } from "@/utils/exportToPdf";
```

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
| `npm run lint` | `next lint` |
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
