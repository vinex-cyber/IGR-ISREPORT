# PRD: Rich Text Editor (Tiptap) + Export PDF Surat Penawaran

## Latar Belakang
Beberapa dokumen di aplikasi Next CPG (mis. **surat penawaran harga**) butuh editor
rich text, dan hasilnya harus bisa diekspor ke PDF dengan teks **selectable**
(bisa di-copy/cari) serta **kontrol layout penuh** (kop surat, garis, tabel, page break).

## Pendekatan
- Editor: **Tiptap v3** (headless, berbasis ProseMirror).
- Output PDF: **Opsi 3** — parse JSON Tiptap → render manual via `jspdf` + `jspdf-autotable`
  (teks asli selectable, layout terkontrol penuh).
- Constraints project: Pages Router (harus `ssr: false`), React 19, tanpa `any`,
  pakai `named useEffect`, komentar & pesan Bahasa Indonesia.

## Status Dependencies
- `@tiptap/react@^3.27.3`, `@tiptap/pm@^3.27.3`, `@tiptap/starter-kit@^3.27.3`
- `@tiptap/suggestion` (slash command), `@tiptap/extension-table` (TableKit),
  `@tiptap/extension-image`, `@tiptap/extension-text-align`,
  `@tiptap/extension-text-style` (TextStyle/FontSize/Color),
  `@tiptap/extension-horizontal-rule`, `@tiptap/extensions` (Selection)
- `jspdf@^4.2.1`, `jspdf-autotable@^5.0.7` (sudah ada di project)

## Rencana Tahapan
- [x] **Tahap 1** — Install Tiptap deps.
- [x] **Tahap 2** — Scaffold `EditorTiptap` (toolbar + dynamic `ssr:false`).
- [x] **Tahap 2b** — Slash Command (`/` menu) untuk sisip blok (paragraf, heading, list,
      kutipan, garis pemisah tipis/sedang/tebal, tabel, gambar, PLU).
- [x] **Tahap 3** — Converter `editorJsonToPdf` (`src/utils/exportToPdf/editorPdf.ts`).
      Parse node: heading (H1–H5), paragraph (align + fontSize + bold/italic + warna),
      hardBreak, horizontalRule, bulletList/orderedList, tabel (kop + PLU).
      Auto page break + embed logo (image → dataURL).
- [x] **Tahap 4** — Preview + aksi di halaman (`/test-editor`): tombol Preview/Perbarui,
      Tutup, Unduh (`doc.save`), Cetak (`doc.autoPrint`). Preview via `iframe` blob URL.
- [x] **Tahap 5** — Polish:
      - Kop surat per-branch (`getLetterheadInfo`) + logo + garis biru.
      - Tabel PLU (header biru, border biru muda), align tabel (kiri/tengah/kanan),
        tambah/hapus baris + renumber otomatis kolom "No".
      - Ukuran font terbaca di toolbar (`useEditorState`), default isi surat 14.7px,
        alamat 16px, tabel PLU ikut ukuran baris sebelumnya.
      - Bubble toolbar saat teks diblok (paragraf/heading, ukuran font, bold/italic/strike, align).

## Arsitektur File
```
src/components/input/
├── EditorTiptap.tsx              # wiring useEditor + render + modal PLU
├── EditorTiptapDynamic.tsx       # wrapper dynamic(ssr:false)
├── tableRowResize.ts             # PluTableRow + TableRowResize
├── slash-command/                # extension.ts, items.ts, SlashCommandList.tsx
└── editor/
    ├── extensions/
    │   ├── pluTable.ts           # PluTable (attr class+align), plugin sync align, findPluTable, getTableAlign, applyTableAlign
    │   └── horizontalRule.ts     # ThickHorizontalRule (thin/medium/thick + color)
    ├── plu/pluTableBuilder.ts    # createPluTable, addPluToExistingTable, renumberPluTable
    ├── letterhead.ts             # buildLetterheadContent(branch)
    ├── PluDescriptionModal.tsx
    └── toolbar/
        ├── blockHelpers.ts       # HEADING_LEVELS, getCurrent/setBlockType, getCurrentFontSize, DEFAULT_FONT_SIZE
        ├── ToolbarButton.tsx     # tombol + Tooltip
        ├── EditorToolbar.tsx     # toolbar utama persisten (useEditorState)
        └── EditorBubbleMenu.tsx  # bubble toolbar saat select (useEditorState)
src/utils/exportToPdf/editorPdf.ts   # buildEditorPdf, editorJsonToPdfBlobUrl, downloadEditorPdf, printEditorPdf
src/configs/input/letterheadConfig.ts # LetterheadInfo + getLetterheadInfo(branch)
```

## Catatan Teknis (Pitfalls)
- Tiptap `useEditor` pakai `immediatelyRender: false` agar aman di client.
- Pages Router: editor HARUS di-render via `dynamic(..., { ssr: false })`.
- Konversi ke PDF di client (butuh `jsPDF` + `window.Image`/canvas untuk logo).
- **Class editor asli `.ProseMirror`, bukan `.tiptap`** — CSS harus target `.ProseMirror`.
- **Table align + `resizable:true`:** NodeView tidak meneruskan HTMLAttributes ke `<table>`.
  Solusi: plugin ProseMirror di `pluTable.ts` menyinkron `margin-left/right` + `class` ke DOM.
- **Toolbar reaktif:** WAJIB `useEditorState` (Tiptap v3 tidak re-render otomatis saat selection berubah),
  kalau tidak ukuran font/active state jadi stale.
- **BubbleMenu** di-import dari `@tiptap/react/menus` (bukan `@tiptap/react`).
- **Cetak:** header "PDF.js viewer" + URL berasal dari header cetak browser — matikan via
  print dialog (uncheck "Headers and footers"), bukan dari kode.
- Ukuran font pakai satuan **px** (input toolbar strip `px`); jangan pakai `pt` biar terbaca.
