# Project: Next CPG

**Aturan:** Jangan langsung push ke main. Tanya dulu sebelum commit/push/merge. Kerjakan di branch yang sesuai.
**Type Safety:** Dilarang menggunakan `any`. Gunakan `unknown`, `Record<string, unknown>`, atau generic type yang sesuai.

Internal CPG (Consumer Packaged Goods) reporting/analytics app. Next.js 16 Pages Router + PostgreSQL.

## Stack
- **Framework:** Next.js 16 (Pages Router), React 19, TypeScript
- **Editor:** Tiptap v3 (`@tiptap/react`), `jspdf` + `jspdf-autotable` untuk export PDF editor
- **Database:** PostgreSQL via `pg` (node-postgres), pool per branch
- **Forms/Validation:** `react-hook-form` + `@hookform/resolvers` + `zod` (v4 — dipakai AI SDK v7 juga; API `required_error` lama diganti `error`)
- **UI:** Tailwind CSS v4, shadcn/ui (Radix primitives), `lucide-react`
- **Data Fetching:** `axios` + `useFetchData` (manual state)
- **Export:** `exceljs` (Excel), `jspdf` + `jspdf-autotable` (PDF)
- **Charts:** `recharts`
- **Date:** `date-fns`, `react-day-picker`

## Directory Structure

```
src/
├── components/       # React components (UI + custom)
│   ├── ui/           # shadcn/ui primitives
│   ├── input/        # Custom inputs (InputProdukPlu, etc.)
│   ├── table/        # ReportTable
│   ├── Settings/     # SettingsDatabase
│   └── ...
├── configs/           # Feature configs (columns, filters, defaults)
│   ├── form-so-harian/
│   ├── evaluasi-sales/
│   ├── inventory/
│   └── database-options.ts
├── hooks/             # Custom hooks
│   ├── animation/           # Animation hooks
│   │   ├── animePresets.ts        # Preset animasi (fadeUp, scaleIn, dll)
│   │   ├── useAnimeCounter.ts     # Counter animasi 0→N
│   │   ├── useAnimeHover.ts       # Animasi hover scale
│   │   └── useAnimeOnScroll.ts    # Animasi scroll-triggered
│   ├── data/                # Data fetching hooks
│   │   ├── useFetchData.ts        # Generic fetcher (axios + manual state)
│   │   └── useLookupData.ts       # Lookup dengan caching + branch detection
│   ├── report/              # Report page hooks
│   │   ├── useReportPage.ts       # Main report page hook
│   │   ├── useReportQueryEndpoint.ts
│   │   ├── useReportTableLogic.ts
│   │   ├── useTitleFromQuery.ts
│   │   └── useTotalRow.ts
│   ├── useFilteredData.ts        # Filter data berdasarkan search term
│   ├── useFormPage.ts            # Submit form → redirect
│   ├── useExportToExcel.ts       # Export data ke Excel
│   ├── useRefreshRouter.ts       # State refreshing + re-fetch
│   └── ...
├── lib/               # Core library
│   ├── db.ts                 # DB pool management
│   ├── handlerFactory.ts     # API handler factory
│   ├── apiHandler.ts         # checkMethod, handleServerError
│   └── axiosClient.ts        # Axios instance
├── pages/             # Pages + API routes
│   ├── api/                   # API endpoints
│   └── ...                    # Frontend pages
├── schema/            # Zod validation schemas
├── types/             # TypeScript types
│   ├── api.ts
│   ├── report.ts
│   └── queryParams.ts
└── utils/             # Utilities
    ├── filters/               # SQL filter builders
    ├── query/                 # SQL query builders
    ├── pagination/            # Pagination helpers
    ├── server/                # Server-side helpers
    ├── branchCookie.ts
    ├── formatPlu.ts           # Format & validasi PLU (pad 7 digit, digit akhir 0)
    ├── exportToPdf/
    └── reportBuilder.ts
```

## Database
- **JANGAN PERNAH SENTUH DATABASE LANGSUNG** — dilarang DDL (CREATE/ALTER/DROP INDEX, TABLE, VIEW, dst.), perubahan struktur/skema, atau operasi tulis/UPDATE data manual. Semua akses DB hanya lewat query aplikasi (SELECT) di kode.
- Performance issue di database = perbaiki QUERY di app (optimasi SQL), bukan tambah index/ubah skema.
- Multiple branches: IGRCPG, ICMCPG, SPICPG1I, SPICPG4L (from `.env.local`)
- Branch is auto-detected from client IP or selected via `SettingsDatabase` → `selected_branch` cookie
- `getPool(branch)` from `@/lib/db` returns pg.Pool

## API Convention
- **WAJIB pakai `createGetHandler<TFilters>(config)` dari `@/lib/handlerFactory`** — JANGAN tulis handler manual (custom `NextApiRequest`/`NextApiResponse`). Contoh rujukan: `src/pages/api/chart/trend-sales-divisi/index.ts`
- Config: `schema` (Zod), `buildFilters` (→ `{ conditions, params }`), `buildQuery` (→ SQL string), `successMessage`, `emptyMessage`, `errorContext`
- Endpoint chart/agregat yang sah kosong → **wajib `return404IfEmpty: false`** (default handler = 404 kalau kosong, bikin card frontend hilang)
- Param filter dilempar sebagai SQL param (`$1`, `$2`) lewat `params` — jangan interpolate; kalau param dipakai untuk milih ekspresi kolom, pakai `CASE WHEN $1 = ...` di dalam query
- **Pengecualian async** (contoh: `api/chart/trend-tahunan`): kalau query butuh resolusi async SEBELUM build (cek nama tabel arsip via `information_schema` — tidak semua branch punya arsip sama), boleh handler manual async. Tabel arsip di-resolve ke snapshot bulan terakhir yang ADA (`MAX(table_name)` + regex `_[0-9]{2}$`); tahun tanpa arsip → kolom NULL (garis chart kosong, bukan error 500)
- **Jangan biarkan 500 di endpoint dashboard** — `useFetchData` mempertahankan data lama saat error, jadi user lihat data branch sebelumnya tanpa sadar error (kejadian: SPI tidak punya `tbtr_rekapsalesbulanan_2024_12` → chart 500 → nilai IGRCPG nyangkut)
- Kalau butuh agregasi yang dipakai beberapa endpoint, bikin SATU base query di `src/utils/query/` dan wrap dengan GROUP BY berbeda (contoh: `queryTodaySales.ts`)
- Branch detected server-side via `getRequestBranch(req)` (cookie → IP)
- **Pagination is client-side:** `useReportPage` dengan `paginated: true` mengirim `export: true` ke API, lalu melakukan slicing di client. Tidak perlu `createPaginatedGetHandler`.

## Page Convention
- Report pages use `useReportPage<T>({ endpoint, ...config })`
- Config from `buildReport(columns)` returns `{ allFields, numericFields, searchableFields, headers, mapRow }`
- Form uses `react-hook-form` + `zodResolver`
- Table uses `ReportTable` component

## React Effect Convention
- **Named useEffect:** Semua `useEffect` **WAJIB** pakai named function, bukan anonymous arrow.
  - Effect: `useEffect(function observeViewport() { ... }, [...])`
  - Cleanup: `return function disconnectObserver() { ... }`
  - Nama harus deskriptif (camelCase), describe apa yang effect lakukan
  - Contoh: `fetchData`, `closeOnEscape`, `lockBodyScroll`, `debounceSearch`, `animateProgress`
- **Named Cleanup:** Cleanup function juga harus diberi nama.
  - Contoh: `disconnectObserver`, `abortFetch`, `removeEventListener`, `cancelAnimation`
- **Animation Hooks:** Gunakan `useAnimeCounter` dan `useAnimeOnScroll` dari `@/hooks/animation/`

## Code Generation
- `npm run create:page` — scaffold new page
- `npm run create:api` — scaffold API route
- `npm run create:config` — scaffold column config
- `npm run create:component` — scaffold component

## Informasi Promosi
- API endpoints: `data-produk`, `data-trend-sales` — semua di `src/pages/api/informasi-promosi/`
- `queryTrendSales.ts`: query `TBTR_SALESBULANAN` — kolom pivoted `sls_qty_01..12`, `sls_rph_01..12`. Bulan berjalan pakai `st_sales`/`hpp` dari `TBMASTER_STOCK`
- `TabelTrendSales`: unpivot kolom `sls_qty_XX`/`sls_rph_XX` → 12 baris, bulan berjalan = `st_sales`/`hpp`
- `formatPlu`: wajib dipanggil di semua input PLU — pad 7 digit, digit terakhir `0`

## Rich Text Editor (Tiptap) + Export PDF
- **Status:** ✅ Fitur berjalan (halaman: `/editor-surat`)
- **Editor:** Tiptap v3 (headless/ProseMirror), WAJIB `dynamic(ssr:false)` di Pages Router.
  - Import editor via `@/components/input/EditorTiptapDynamic` (alias `EditorTiptap`).
  - `useEditor` pakai `immediatelyRender: false`.
- **Struktur:** `src/components/input/editor/`
  - `extensions/pluTable.ts` — `PluTable` (attr `class`+`align`), plugin sync align, `findPluTable`, `getTableAlign`, `applyTableAlign`
  - `extensions/horizontalRule.ts` — `ThickHorizontalRule` (thin/medium/thick + color)
  - `plu/pluTableBuilder.ts` — `createPluTable`, `addPluToExistingTable`, `renumberPluTable`
  - `letterhead.ts` — `buildLetterheadContent(branch)` (kop per-branch + logo + garis)
  - `toolbar/` — `EditorToolbar` (persisten), `EditorBubbleMenu` (saat select), `ToolbarButton`, `blockHelpers`
  - `PromoInfoModal.tsx` — modal **Info Promo** (dari tombol "Info" di lookup PLU via `infoAction` pada `GenericLookupModal`)
  - `promoInfo/` — `promoInfoShared.tsx`, `PromoMdSection.tsx`, `CashbackMemberSection.tsx`, `CashbackSection.tsx`, `GiftSection.tsx`
- **Modal Info Promo:** tombol "Info" di `GenericLookupModal` (lookup produk PLU) membuka `PromoInfoModal` yang menampilkan Cashback, Gift, Cashback Member, dan Promo MD (tabel `data-setting-harga`) secara berdampingan. Banner tengah per section; Cashback Member & Promo MD bersebelahan; Cashback/Gift di-hide bila kosong. Data dari API `data-promo-cashback`, `data-promo-gift`, `data-cashback-jenismember`, `data-setting-harga` (filter `prdcd`).
- **PDF menghormati align tabel:** `renderGridTable` di `editorPdf.ts` mengukur lebar tabel (`measureGridTableWidth`) lalu center/right via `tableHorizontalMargin` (bukan selalu full-width).
- **Export PDF (Opsi 3, JSON→jspdf):** `src/utils/exportToPdf/editorPdf.ts`
  - `buildEditorPdf`, `editorJsonToPdfBlobUrl` (preview iframe), `downloadEditorPdf`, `printEditorPdf`
- **Config kop surat:** `src/configs/input/letterheadConfig.ts` → `getLetterheadInfo(branch)`
- **Pitfalls WAJIB diingat:**
  - Class DOM editor adalah `.ProseMirror` (BUKAN `.tiptap`) → CSS di `globals.css` target `.ProseMirror`.
  - Toolbar/bubble WAJIB `useEditorState` (Tiptap v3 tidak re-render otomatis saat selection berubah).
  - `BubbleMenu` di-import dari `@tiptap/react/menus`.
  - Ukuran font pakai satuan **px** (input toolbar strip `px`); default isi surat `14.7px`.
  - Dengan tabel `resizable:true`, atribut `class`/`style` tidak diteruskan ke `<table>` → disinkron plugin di `pluTable.ts`.
  - Header cetak "PDF.js viewer" + URL = header cetak browser (bukan bug kode).

## Next.js 16 Migration (Done)
- **Status:** ✅ Selesai
- **Commits:** `5be3584`
- **Yang dilakukan:**
  - Upgrade `next@16.2.10`, `react@19.2`, `react-dom@19.2`
  - Ganti `next lint` → `eslint src/`
  - Update `eslint.config.mjs` ke flat config native (hapus `FlatCompat`)
  - Disable React Compiler rules: `set-state-in-effect`, `preserve-manual-memoization`, `purity`
- **Yang TIDAK berubah:** Semua files di `pages/`, `api/`, hooks, komponen — tidak ada perubahan karena project ini full Pages Router

## Hapus TanStack React Query (Done)
- **Status:** ✅ Selesai
- **Commit:** `5ffde02`
- **Yang dilakukan:**
  - Ganti `useQueryData` → `useFetchData` di `KartuProduk.tsx`, `TabelTrendSales.tsx`, `DependentSelectWrapper.tsx`
  - Hapus `QueryClientProvider` dari `_app.tsx`
  - Hapus `src/hooks/data/useQueryData.ts`
  - `npm uninstall @tanstack/react-query`
- **Yang hilang:** Automatic caching (5 menit), background refetch, request deduplication
- **Yang didapat:** Bundle lebih kecil, 1 dependency kurang

## Dashboard Homepage (`src/pages/index.tsx`) — Baru
- **Struktur:** Hero (judul + branch selector `SettingsDatabase` + tile KPI YTD) → Sales Hari Ini + per Divisi → 4 chart bulanan (2 line chart 3 tahun + 2 stacked per divisi)
- **Komponen:**
  - `DashboardKpi` — 4 tile KPI YTD (glass, tanpa Card), angka penuh rata tengah, di dalam hero
  - `TodaySalesCard` — section: Total, Member Merah, End User, IDM/OMI/Other; badge "kasir aktif" (lampu hijau pulse / merah); TTS "Kasir sudah tutup semua..." 3x via `speechSynthesis` saat kasir = 0
  - `TodayDivisiCard` — bar proporsi warna per divisi + total
- **Endpoint** (`api/evaluasi-sales/`): `today-by-member`, `today-by-divisi` — keduanya dari **satu base query** `queryTodaySales.ts` supaya total SELALU konsisten
- **Chart tren 3 tahun** (`api/chart/trend-tahunan` + `queryTrendTahunan.ts`):
  - Tahun berjalan: `TBTR_SALESBULANAN` — TAPI bulan berjalan kolomnya BELUM diisi job → sales live dari `TBMASTER_STOCK` (`st_sales × st_avgcost`), margin live dari transaksi MTD (`tbtr_jualdetail` + interface, formula sama dengan today-summary)
  - Tahun lalu & tahun-2: arsip `tbtr_rekapsalesbulanan_{YYYY}_12` (dinamis dari `getFullYear()`), prefix kolom `rsl_`, ada `rsl_hpp_XX` untuk margin
  - Garis tahun berjalan berhenti di bulan sekarang (NULL setelahnya); angka di-round juta
- **Query pattern penting:**
  - Filter tanggal cepat: `trjd_transactiondate::date = current_date` + `recordid IS NULL` + `quantity <> 0`
  - JANGAN pakai `DetailStruk` untuk agregat ringkas — berat (7+ JOIN + subquery scan ulang). Pakai base query slim
  - Klasifikasi member ikut query referensi PHP sales-today: khusus=MERAH, outlet 6=END USER, tokoigr sbu I/O=IDM/OMI, sisanya OTHER
- **Konvensi refetch:** JANGAN pakai `key={branch}` (remount → flicker/card dobel). Pass prop `branch` + `useEffect` panggil `refetch()`. Polling 60 detik via `setInterval`. Skeleton hanya saat initial load (`!data`)
- **Bug tercatat:**
  - `per-member.ts` lama punya bug presedens operator (`OR`/`AND`) yang bikin OTHER tak terhitung — versi baru pakai kurung eksplisit
  - **pg numeric/BIGINT balik sebagai STRING** — kalau dijumlah di client pakai `+` jadi concatenation (digit ratusan karakter). WAJIB cast `::float8`/`::int` di SQL untuk semua output agregat
  - Alias kolom SQL harus persis sama dengan yang dibaca komponen (pernah `jenis_member` vs `jenis` bikin section hilang)
- **axiosClient baseURL `/api`** — endpoint di `useFetchData` TANPA prefix `/api`

## Chat AI (Tool → API, tanpa SQL di layer AI)
- **Status:** ✅ Berjalan (FAB kanan bawah semua halaman, mount di `Layout.tsx`)
- **Arsitektur wajib:** AI → Tool → API internal → SQL (`DetailStruk` dkk) → PostgreSQL. **AI TIDAK punya akses langsung ke DB** — tool cuma memanggil endpoint yang sudah ada (yang menjalankan SQL-nya sendiri). Jangan sekali-kali taruh query DB di `tools.ts`.
- **File:**
  - `src/configs/ai/tools.ts` — registry. Tool = grup endpoint (`evaluasi_sales`, `klik`, `inventory_lpp`, `info_produk_promo`, `chart_trend`), model memilih endpoint lewat param `endpoint` (enum). Peta path di `P`, daftar pilihan di `*_ENDPOINTS`, deskripsi di `*_DESC`, `callApi()` fetch internal + meneruskan cookie (branch).
  - `src/pages/api/ai/chat.ts` — POST `/api/ai/chat`, **Vercel AI SDK v7**: `streamText` + tool dari registry (JSON Schema → zod lewat `zodFromParameters`) + `stopWhen: isStepCount(5)`, tanggal server disuntik ke system prompt, respons UI message stream (`createUIMessageStreamResponse` + `toUIMessageStream`) diapai ke `res` via `pipeResponse` (Pages Router tidak bisa `return Response`).
  - `src/components/AiChat.tsx` — FAB + panel pakai `useChat` (`@ai-sdk/react`) + `DefaultChatTransport` (`api: "/api/ai/chat"`), riwayat di localStorage (`ai-chat-history`), indikator mengetik (3 titik) saat `status` submitted/streaming, bubble error merah (`error`).
- **Env (` .env.local`):** `AI_BASE_URL` (gateway OpenAI-compatible tanpa `/v1` di belakang? — **dengan** `/v1`), `AI_API_KEY`, `AI_MODEL`.
- **Tambah endpoint baru:** tambah 1 baris di peta `P` + masuk daftar `*_ENDPOINTS` + sebut di `*_DESC`. Tanpa SQL baru.
- **Pitfalls:**
  - Grouping per-grup (bukan 1 tool per endpoint) supaya daftar tool-def kecil — 41 tool-def bikin request membengkak & model salah pilih.
  - `callApi` meneruskan cookie user (`selected_branch`) → deteksi cabang sama dengan user. Tanpa cookie → pakai IP server.
  - "hari ini"/"bulan ini" hanya benar karena tanggal server (`todayForPrompt`) disuntik ke system prompt — model tidak tahu tanggal dari dirinya sendiri.
  - Endpoint `paginated:true` (mis. `status-order`) balikin `{ paginated, data }` — sudah terbaca sebagai array, aman.
- **AI SDK v7 (hanya cocok dengan zod v4 — project sudah zod `^4`):**
  - Parameter tool dibuat dinamis dari JSON Schema → `zodFromParameters` (return `z.ZodTypeAny`); semua nilai adalah string/enum.
  - Pilihan alat tersedia: `useChat` dari `@ai-sdk/react` (listening dari `@ai-sdk/react`), `DefaultChatTransport`/`HttpChatTransport` dari `ai`, `createUIMessageStreamResponse` + `toUIMessageStream` dari `ai`.
  - Di `streamText`, batas langkah pakai `stopWhen: isStepCount(5)` (**bukan** `maxSteps` — dihapus di v7).
  - Tool milik server HARUS punya `execute` — loop berjalan sendiri di server, klien tidak perlu `sendAutomaticallyWhen`.
  - `sendMessage({ text })` untuk submit (UI message pakai `parts`, bukan `content`).

## Before Push
Gunakan `npm run push` — script yang:
1. Menjalankan `npm run lint` + `npx tsc --noEmit`
2. Jika lolos, minta input commit message
3. Tampilkan daftar branch & bisa pilih atau buat branch baru
4. `git add -A && git commit && git push` otomatis

## Push ke .32 (LAN)
Mesin .32 (`192.168.226.32`) tidak punya akses internet, jadi push langsung lewat share folder:
- Remote `lan` → `N:\` (share `\\192.168.226.32\next-cpg`, user: `AV SERVER`, pass: `123`)
- N:\ sudah di-branch `main`, `receive.denyCurrentBranch = updateInstead` sudah di-set
- **Push:** `rtk git push lan main`
- Setelah push, .32 otomatis ke-update (working tree langsung berubah)
- Jika N:\ tidak ter-mount, mount dulu: `net use N: \\192.168.226.32\next-cpg /user:"AV SERVER" 123`

## Bahasa
- Default: **Bahasa Indonesia**
- Hanya gunakan Bahasa Indonesia atau Bahasa Inggris
- Kode dan komentar pakai Bahasa Indonesia

## Utility
- **Format Tanggal:** Gunakan `FormatTanggal` dari `@/utils/formatTanggal`. Jangan buat fungsi format tanggal sendiri.

## Scripts
- `npm run dev` — `next dev --turbopack`
- `npm run build` — `next build`
- `npm run lint` — `eslint src/`
- `npm run push` — lint + tsc → input message → pilih/buat branch → add + commit + push
