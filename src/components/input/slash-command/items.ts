import type { ComponentType } from "react"

import type { Editor, Range } from "@tiptap/core"
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Type,
  List,
  ListOrdered,
  Quote,
  Minus,
  Image as ImageIcon,
  Table as TableIcon,
  Code as CodeIcon,
  Barcode,
} from "lucide-react"

export interface SlashCommandItem {
  title: string
  description: string
  icon: ComponentType<{ className?: string }>
  searchTerms: string[]
  command: (props: { editor: Editor; range: Range }) => void
  openModal?: "plu"
}

export const slashCommandItems: SlashCommandItem[] = [
  {
    title: "Paragraf",
    description: "Teks biasa",
    icon: Type,
    searchTerms: ["paragraf", "text", "p"],
    command: function insertParagraph({ editor, range }) {
      editor.chain().focus().deleteRange(range).setParagraph().run()
    },
  },
  {
    title: "Heading 1",
    description: "Judul besar",
    icon: Heading1,
    searchTerms: ["h1", "judul", "heading", "title"],
    command: function insertH1({ editor, range }) {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run()
    },
  },
  {
    title: "Heading 2",
    description: "Sub judul",
    icon: Heading2,
    searchTerms: ["h2", "subjudul", "heading"],
    command: function insertH2({ editor, range }) {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run()
    },
  },
  {
    title: "Heading 3",
    description: "Sub judul kecil",
    icon: Heading3,
    searchTerms: ["h3", "heading"],
    command: function insertH3({ editor, range }) {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run()
    },
  },
  {
    title: "Heading 4",
    description: "Sub judul lebih kecil",
    icon: Heading4,
    searchTerms: ["h4", "heading"],
    command: function insertH4({ editor, range }) {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 4 }).run()
    },
  },
  {
    title: "Heading 5",
    description: "Sub judul terkecil",
    icon: Heading5,
    searchTerms: ["h5", "heading"],
    command: function insertH5({ editor, range }) {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 5 }).run()
    },
  },
  {
    title: "Heading 6",
    description: "Sub judul paling kecil",
    icon: Heading6,
    searchTerms: ["h6", "heading"],
    command: function insertH6({ editor, range }) {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 6 }).run()
    },
  },
  {
    title: "Daftar Tidak Berurut",
    description: "Bulet list",
    icon: List,
    searchTerms: ["bullet", "list", "daftar", "ul"],
    command: function insertBulletList({ editor, range }) {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
  },
  {
    title: "Daftar Berurut",
    description: "Angka list",
    icon: ListOrdered,
    searchTerms: ["ordered", "list", "daftar", "ol", "nomor"],
    command: function insertOrderedList({ editor, range }) {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  {
    title: "Kutipan",
    description: "Blok kutipan",
    icon: Quote,
    searchTerms: ["quote", "kutipan", "blockquote"],
    command: function insertBlockquote({ editor, range }) {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run()
    },
  },
  {
    title: "Garis Pemisah Tipis",
    description: "Garis horizontal tipis (1px)",
    icon: Minus,
    searchTerms: ["garis", "hr", "pemisah", "divider", "horizontal", "tipis"],
    command: function insertHrThin({ editor, range }) {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({ type: "horizontalRule", attrs: { thickness: "thin" } })
        .run()
    },
  },
  {
    title: "Garis Pemisah Sedang",
    description: "Garis horizontal sedang (2px)",
    icon: Minus,
    searchTerms: ["garis", "hr", "pemisah", "divider", "horizontal", "sedang"],
    command: function insertHrMedium({ editor, range }) {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: "horizontalRule",
          attrs: { thickness: "medium" },
        })
        .run()
    },
  },
  {
    title: "Garis Pemisah Tebal",
    description: "Garis horizontal tebal (4px)",
    icon: Minus,
    searchTerms: ["garis", "hr", "pemisah", "divider", "horizontal", "tebal"],
    command: function insertHrThick({ editor, range }) {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: "horizontalRule",
          attrs: { thickness: "thick" },
        })
        .run()
    },
  },
  {
    title: "Tabel",
    description: "Buat tabel 3x3",
    icon: TableIcon,
    searchTerms: ["table", "tabel", "grid"],
    command: function insertTable({ editor, range }) {
      const input = window.prompt("Jumlah baris dan kolom (misal 3,4)", "3,3")
      if (!input) return
      const parts = input.split(",").map(function parse(part) {
        return parseInt(part.trim(), 10)
      })
      let rows = parts[0]
      let cols = parts[1]
      if (!rows || rows < 1) rows = 3
      if (!cols || cols < 1) cols = 3
      rows = Math.min(rows, 50)
      cols = Math.min(cols, 20)
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows, cols, withHeaderRow: true })
        .run()
    },
  },
  {
    title: "Tabel (HTML)",
    description: "Buat tabel dari HTML",
    icon: CodeIcon,
    searchTerms: ["table", "tabel", "html", "grid"],
    command: function insertHtmlTable({ editor, range }) {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent(
          `<table><tbody><tr><th>Kolom 1</th><th>Kolom 2</th></tr><tr><td>Sel 1</td><td>Sel 2</td></tr><tr><td>Sel 3</td><td>Sel 4</td></tr></tbody></table>`,
        )
        .run()
    },
  },
  {
    title: "Gambar",
    description: "Sisipkan gambar dari URL",
    icon: ImageIcon,
    searchTerms: ["image", "gambar", "img", "foto"],
    command: function insertImage({ editor, range }) {
      const url = window.prompt("URL gambar")
      if (url) {
        editor.chain().focus().deleteRange(range).setImage({ src: url }).run()
      }
    },
  },
  {
    title: "PLU",
    description: "Cari & sisipkan kode produk",
    icon: Barcode,
    searchTerms: ["plu", "produk", "prdcd", "barang", "kode"],
    openModal: "plu",
    command: function openPlu() {
      // pembukaan modal ditangani di extension SlashCommand (onRequestPlu)
    },
  },
]
