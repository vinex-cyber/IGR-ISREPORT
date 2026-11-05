# Rencana Docker

**Status:** belum dikerjakan. Belum ada satu pun file Docker di repo (`Dockerfile`, `docker-compose.yml`, `.dockerignore` tidak ada).

**Tanggal cek:** 2026-10-21. Basis: Next.js 16.2.10 Pages Router, React 19.2, Node host v24.15.0.

---

## Sudah siap (tidak perlu diubah)

| Fakta | Lokasi |
|---|---|
| `next start -H 0.0.0.0 -p 5000` sudah bind 0.0.0.0 | `package.json:8` |
| Semua halaman pakai `getServerSideProps`, **tidak ada `getStaticProps`** → `next build` tidak butuh akses DB | `src/pages/**` |
| Tidak ada `middleware.ts`, tidak ada `app/` → murni Pages Router | — |
| Tidak ada dependensi Windows-only | `package.json` |
| Pool DB dibuat lazy per-request (bukan saat boot) | `src/lib/db.ts:25` |

---

## Blockers

### 1. Fitur struk (`/api/struk`) Windows-only — satu-satunya code change wajib

```ts
// src/pages/api/struk.ts:55   UNC path, Linux tidak bisa baca
process.env.STRUK_DIRECTORY_IGR ?? "\\\\192.168.226.194\\d\\GROSIR\\STRUK"

// src/pages/api/struk.ts:117, 124   path pakai backslash -> fs.readFile ENOENT
path.win32.join(...)
```

- UNC `\\192.168.226.194\...` tidak terbaca di container Linux.
- `path.win32.join` hasilkan `dir\sub\file`, `fs.readFile` di Linux gagal walaupun file ada.

**Fix:**
1. Mount share via CIFS ke path lokal, contoh `//192.168.226.194/d/GROSIR/STRUK` → `/mnt/struk`.
2. Ganti `path.win32.join` → `path.join` di 2 tempat.
3. Set `STRUK_DIRECTORY_IGR` (dan `STRUK_DIRECTORY_<BRANCH>` untuk branch lain) ke path mount.

Catatan dari kode: saat ini hanya IGR yang punya env `STRUK_DIRECTORY_*`; branch lain fallback ke IGR (`src/pages/api/struk.ts:57-66`).

### 2. `.env.local` tidak ikut ke image

- `.gitignore:35` mengabaikan `.env*`, jadi file ini tidak ikut context build.
- Wajib pakai `env_file:` (compose) atau `-e`.
- `src/lib/db.ts:9` melempar `Environment variable X belum diatur` kalau kosong. Var yang **wajib lengkap untuk 4 branch**:

```
PG_USER, PG_PASSWORD, PG_PORT
DB_HOST_IGRCPG  DB_NAME_IGRCPG
DB_HOST_ICMCPG  DB_NAME_ICMCPG
DB_HOST_SPICPG1I  DB_NAME_SPICPG1I
DB_HOST_SPICPG4L  DB_NAME_SPICPG4L
```

Var lain (opsional, ada fallback): `STRUK_DIRECTORY_*`, `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_DATABASE_OPTIONS`, `BRANCH_NETWORK_MAP`, `NEXT_PUBLIC_LETTERHEAD_BRANCHES`, `DEBUG_CLIENT_IP`, `MEMBER_MDIH`, `AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL`.

Penting: `NEXT_PUBLIC_*` dibakar saat **build**, bukan runtime → harus tersedia sebagai build arg.

### 3. Jaringan container → DB

`DB_HOST_*` kemungkinan subnet `192.168.226.x`. Container harus bisa mencapai subnet itu: `network_mode: host` atau pastikan routing kebuka. Di Docker Desktop Windows ini perlu diverifikasi, bukan diasumsikan.

### 4. Deteksi branch dari IP client

`src/utils/server/getBranchFomRequest.ts`:
- Baca `X-Real-IP` → `X-Forwarded-For` → `socket.remoteAddress`.
- Kalau ada Nginx/reverse proxy di depan, header itu **wajib** diset, kalau tidak IP terbaca = IP container, bukan IP pengguna → jatuh ke `getDefaultBranch()`.
- Selamatnya: cookie `selected_branch` menang duluan (baris 85), jadi aman selama user memilih branch manual di `SettingsDatabase`.
- `BRANCH_NETWORK_MAP` di `.env.local` (baris 30) dipakai `src/configs/branch-network-map.ts:146` untuk petakan IP → branch.

---

## Opsional

`next.config.ts` belum punya `output: "standalone"` → image bawa `node_modules` penuh. Ditambah, image jauh lebih kecil. Tanpa ini pun tetap jalan.

---

## Bukan blocker

- `remote.lan.url = N:/` adalah git remote (push ke `192.168.226.32`), tidak masuk `docker build`.
- Dev server lambat (~2,24s/request termasuk 404) = khas `next dev`, bukan masalah kode. Sudah diukur terpisah.

---

## Daftar kerja

- [ ] `Dockerfile` (multi-stage: build → runner, Node 22 atau 24)
- [ ] `docker-compose.yml` (`env_file: .env.local`, port 5000, volume mount struk, network ke DB)
- [ ] `.dockerignore` (`node_modules`, `.next`, `.git`, `.env*`)
- [ ] Ganti `path.win32.join` → `path.join` di `src/pages/api/struk.ts`
- [ ] Tentukan & uji mount CIFS untuk folder struk
- [ ] Uji koneksi container → 4 `DB_HOST_*`
- [ ] (Opsional) `output: "standalone"` di `next.config.ts`
- [ ] Uji deteksi branch di belakang proxy / tanpa proxy
