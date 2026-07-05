# Next CPG

> Internal CPG (Consumer Packaged Goods) reporting and analytics app built with Next.js 15 (Pages Router) and PostgreSQL.

---

## Stack

| Kategori            | Teknologi                                                                 |
| ------------------- | ------------------------------------------------------------------------- |
| Framework           | Next.js 15, React 19, TypeScript                                          |
| Database            | PostgreSQL via `pg` (node-postgres), multi-branch connection pool         |
| UI                  | Tailwind CSS v4, shadcn/ui (Radix primitives), `lucide-react`            |
| Forms & Validation  | `react-hook-form`, `@hookform/resolvers`, `zod`                          |
| Data Fetching       | `axios`, `@tanstack/react-query`                                         |
| Charts              | `recharts`                                                               |
| Export              | `exceljs` (Excel), `jspdf` + `jspdf-autotable` (PDF)                     |
| Date                | `date-fns`, `react-day-picker`                                           |

---

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL (beberapa branch database)

### Instalasi

```bash
npm install
```

### Environment Variables

Buat file `.env.local` di root project:

```env
# Database connection per branch (contoh format)
IGRCPG_CONNECTION_STRING=postgresql://user:pass@host:5432/igrcpg
ICMCPG_CONNECTION_STRING=postgresql://user:pass@host:5432/icmcpg
SPICPG1I_CONNECTION_STRING=postgresql://user:pass@host:5432/spicpg1i
SPICPG4L_CONNECTION_STRING=postgresql://user:pass@host:5432/spicpg4l

# Optional: default app name untuk branch detection
NEXT_PUBLIC_APP_NAME=IGRCPG
```

### Menjalankan

```bash
npm run dev        # development server (http://localhost:3001)
npm run build      # production build
npm run lint       # ESLint check
npm run start      # start production server
```

---

## Struktur Project

```
src/
├── components/        # UI + custom components
│   ├── ui/            # shadcn/ui primitives
│   ├── input/         # Custom inputs (InputProdukPlu, dll)
│   ├── table/         # ReportTable
│   ├── Settings/      # SettingsDatabase
│   └── form/          # Shared form fields (PeriodeRange, SelectDivisi, dll)
├── configs/           # Feature configs (columns, filters, defaults)
│   ├── form-so-harian/
│   ├── evaluasi-sales/
│   ├── inventory/
│   └── database-options.ts
├── hooks/             # Custom React hooks
│   ├── useReportPage.ts
│   ├── useFetchData.ts
│   ├── useReportQueryEndpoint.ts
│   └── ...
├── lib/               # Core library
│   ├── db.ts          # DB pool management
│   ├── handlerFactory.ts
│   ├── apiHandler.ts
│   └── axiosClient.ts
├── pages/             # Pages + API routes
│   ├── api/           # API endpoints
│   └── ...            # Frontend pages
├── schema/            # Zod validation schemas
├── types/             # TypeScript type definitions
│   ├── api.ts
│   ├── report.ts
│   └── queryParams.ts
└── utils/             # Utilities
    ├── filters/       # SQL filter builders
    ├── query/         # SQL query builders
    ├── pagination/    # Pagination helpers
    ├── server/        # Server-side helpers
    ├── exportToPdf/
    ├── branchCookie.ts
    └── reportBuilder.ts
```

---

## Database Branch System

Aplikasi ini terhubung ke **beberapa branch database** yang berbeda (IGRCPG, ICMCPG, SPICPG1I, SPICPG4L).

**Cara menentukan branch:**

1. **Cookie** — User memilih branch via `SettingsDatabase` → disimpan ke cookie `selected_branch` (30 hari)
2. **IP** — Fallback: deteksi dari alamat IP client → mapping di `configs/branch-network-map.ts`
3. **Default** — `NEXT_PUBLIC_APP_NAME` atau branch pertama dari `DATABASE_OPTIONS`

**Server-side:** `getRequestBranch(req)` membaca cookie → IP → default
**Client-side:** `getBranchCookie()` / `setBranchCookie()` via `utils/branchCookie.ts`

---

## Code Generators

```bash
npm run create:api   <path/nama-endpoint>   # Generate API route
npm run create:page  <path/nama-page>        # Generate halaman
npm run create:config <path/nama-config>     # Generate column config
npm run create:component <NamaComponent>     # Generate component
```

Semua nama **wajib kebab-case** (contoh: `laporan/stok-masuk`, `informasi-promosi`).

### create:api

Membuat API route di `src/pages/api/`. Tersedia 2 prompt interaktif:

1. **Jenis handler:**
   - `Paginated` — list data dengan pagination + search (via `createPaginatedGetHandler`)
   - `Simple` — ambil semua data tanpa pagination (via `createSimpleGetHandler`)
   - `Manual` — handler dari nol

2. **Letak schema Zod:**
   - `Inline` — schema di dalam file API route
   - `Terpisah` — schema di `src/schema/`, API route import dari sana

### create:page

Membuat page di `src/pages/`. Tersedia prompt pemilihan jenis page:
- `Report` — laporan tabel dengan `useReportPage` + `ReportTable`
- `Form` — form filter dengan `react-hook-form` + `SettingsDatabase`
- `Kosong` — page kosong dengan Layout

### create:config

Membuat konfigurasi kolom tabel di `src/configs/`:
- Type `*Rows` (field data)
- Array `*Columns` (ColumnConfig untuk UI + export)

### create:component

Membuat React component di `src/components/`:
- **Client Component** (default) — dengan `"use client"` untuk interaktivitas
- **Server Component** (flag `--server`) — tanpa `"use client"`

---

## API Convention

### Paginated Handler

```typescript
import { createPaginatedGetHandler } from "@/lib/handlerFactory";

// Schema Zod untuk validasi query params
const MySchema = z.object({ search: z.string().optional() });

// Filter builder → SQL conditions + params
function buildFilters(filters) { /* ... */ }

// Query builder → SQL string
function buildQuery(conditions) { return `SELECT ... WHERE ${conditions}`; }

export default createPaginatedGetHandler({
  schema: MySchema,
  buildFilters,
  buildQuery,
  successMessage: "...",
  emptyMessage: (branch) => `...`,
  errorContext: "MyFeature",
});
```

Response: `{ total, page, limit, totalPages, data }`

### Simple Handler

```typescript
export default createSimpleGetHandler({ ... });
```

Response: `{ total, data }`

### Manual Handler

Untuk kebutuhan khusus, bisa bikin handler sendiri — pastikan panggil `getRequestBranch(req)` untuk deteksi branch server-side.

---

## Page Convention

### Report Page

Gunakan `useReportPage` untuk halaman laporan tabel:

```typescript
const { filteredData, loading, error, title, periode, handleExport, handleRefresh }
  = useReportPage<MyRows>({
    endpoint: "fitur-saya",
    reportTitle: "Laporan Saya",
    ...config,   // dari buildReport(columns)
  });
```

- Query params (startDate, endDate, branch, dll) otomatis dibaca dari URL
- Search, export Excel, refresh, dan total baris sudah built-in
- Untuk pagination, tambah `paginated: true`

### Form Filter Page

Gunakan `react-hook-form` + `zodResolver`:

```typescript
const methods = useForm<MyInput>({
  resolver: zodResolver(MySchema),
  defaultValues: getMyDefaultValues(),
});
```

- Field `SettingsDatabase` untuk memilih branch (tersimpan di cookie)
- Submit redirect ke halaman tabel dengan params di URL
- Branch **tidak perlu** dikirim via URL — dibaca dari cookie oleh API via `getRequestBranch(req)`

---

## Export

| Format  | Library       | Fitur                                            |
| ------- | ------------- | ------------------------------------------------ |
| Excel   | `exceljs`     | Auto dari `useExportToExcel`, format number, total row |
| PDF     | `jspdf` + `jspdf-autotable` | Manual via `utils/exportToPdf/`                |

---

## Scripts

| Perintah              | Fungsi                                  |
| --------------------- | --------------------------------------- |
| `npm run dev`         | `next dev --turbopack`                  |
| `npm run build`       | `next build`                            |
| `npm run lint`        | `next lint`                             |
| `npm run start`       | `next start`                            |
| `npm run create:api`  | Generate API route                      |
| `npm run create:page` | Generate page                           |
| `npm run create:config` | Generate column config                  |
| `npm run create:component` | Generate component                   |
