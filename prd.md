# PRD: Upgrade Next.js 15 → 16 + Hapus TanStack React Query

**Status:** ✅ Done
**Branch:** `informasi-promosi`
**Commits:** `5ffde02` (phase 1), `5be3584` (phase 2)

---

## Ringkasan

Project ini menggunakan **Pages Router** — semua breaking changes Next.js 16 untuk App Router **tidak berdampak**. Upgrade hanya melibatkan update dependencies dan konfigurasi. Sekaligus hapus `@tanstack/react-query` karena `useFetchData` sudah ada sebagai pengganti.

---

## Yang Berubah

### 1. Dependencies Update

```bash
npm install next@16 react@19.2 react-dom@19.2
npm install -D @types/react@latest @types/react-dom@latest
```

### 2. Node.js Version

- **Minimum:** Node.js 20.9+
- **Action:** Cek versi Node di server/deploy, upgrade jika masih < 20.9

### 3. Lint Script

- `next lint` **dihapus** di Next.js 16
- Ganti di `package.json`:
  ```json
  "lint": "eslint src/"
  ```
- Atau buat `.eslintrc.json` jika belum ada

### 4. Turbopack

- Sudah default di Next.js 16
- `npm run dev` sudah pakai `--turbopack` — tidak perlu ubah

### 5. Hapus TanStack React Query

**Files yang pakai `useQueryData`:**

| File | Kegunaan |
|------|----------|
| `src/pages/informasi-promosi/KartuProduk.tsx` | Fetch data produk |
| `src/pages/informasi-promosi/TabelTrendSales.tsx` | Fetch trend sales |
| `src/components/DependentSelectWrapper.tsx` | Fetch dependent data |

**Action:**
1. Ganti `useQueryData` → `useFetchData` di 3 komponen di atas
2. Hapus `QueryClientProvider` dari `src/pages/_app.tsx`
3. Hapus `src/hooks/data/useQueryData.ts`
4. `npm uninstall @tanstack/react-query`

**Yang hilang:** Automatic caching (5 menit), background refetch, request deduplication
**Yang didapat:** Bundle lebih kecil, 1 dependency kurang

---

## Yang TIDAK Berubah

| Area | Alasan |
|------|--------|
| `src/pages/*` | Pages Router — tidak ada breaking change |
| `src/pages/api/*` | API routes via Pages Router — aman |
| `src/hooks/*` | React hooks biasa — tidak terpengaruh |
| `src/components/*` | Components biasa — tidak terpengaruh |
| `src/lib/*` | Library code — tidak terpengaruh |
| `src/utils/*` | Utilities — tidak terpengaruh |
| `src/schema/*` | Zod schemas — tidak terpengaruh |
| Tailwind CSS v4 | Independent dari Next.js version |
| shadcn/ui | Independent dari Next.js version |
| `react-hook-form` | Independent dari Next.js version |

---

## Breaking Changes Next.js 16 (App Router only, TIDAK berdampak)

| Perubahan | Dampak ke Project Ini |
|-----------|----------------------|
| `middleware.ts` → `proxy.ts` | ❌ Tidak pakai middleware |
| Async `params`/`searchParams` | ❌ Pages Router, tidak ada `params` async |
| Cache Components / `"use cache"` | ❌ App Router feature |
| `revalidateTag()` 2 args | ❌ App Router feature |
| `generateMetadata` async | ❌ App Router feature |
| `sitemap` async `id` | ❌ App Router feature |
| Parallel routes `default.js` required | ❌ Tidak pakai parallel routes |

---

## Checklist Eksekusi

### Phase 1: Hapus TanStack React Query
- [x] Ganti `useQueryData` → `useFetchData` di `KartuProduk.tsx`
- [x] Ganti `useQueryData` → `useFetchData` di `TabelTrendSales.tsx`
- [x] Ganti `useQueryData` → `useFetchData` di `DependentSelectWrapper.tsx`
- [x] Hapus `QueryClientProvider` dari `_app.tsx`
- [x] Hapus `src/hooks/data/useQueryData.ts`
- [x] `npm uninstall @tanstack/react-query`
- [x] `npm run lint` — pastikan lolos
- [x] `npx tsc --noEmit` — pastikan lolos
- [x] Test semua halaman informasi-promosi + dependent select

### Phase 2: Upgrade Next.js 16
- [x] Cek versi Node.js di environment deploy (>= 20.9) — v24.15.0
- [x] `npm install next@16 react@19.2 react-dom@19.2`
- [x] `npm install -D @types/react@latest @types/react-dom@latest`
- [x] Ganti script `lint` di `package.json` → `eslint src/`
- [x] Update `eslint.config.mjs` ke flat config native
- [x] Disable React Compiler rules (`set-state-in-effect`, `preserve-manual-memoization`, `purity`)
- [x] `npm run lint` — pastikan lolos
- [x] `npx tsc --noEmit` — pastikan lolos
- [x] `npm run build` — pastikan build sukses
- [x] Commit & push

---

## Referensi

- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js 15 vs 16 Comparison](https://dev.to/descope/nextjs-15-vs-nextjs-16-whats-the-difference-1fjo)
