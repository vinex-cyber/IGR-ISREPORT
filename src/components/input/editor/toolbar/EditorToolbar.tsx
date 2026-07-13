// src/components/input/editor/toolbar/EditorToolbar.tsx
import * as React from "react";
import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  PackageSearch,
  FileText,
  Rows3,
  Trash2,
} from "lucide-react";

import { ToolbarButton } from "./ToolbarButton";
import {
  getCurrentBlockType,
  setBlockType,
  getCurrentFontSize,
} from "./blockHelpers";
import { getTableAlign, applyTableAlign } from "../extensions/pluTable";
import { renumberPluTable } from "../plu/pluTableBuilder";
import { buildLetterheadContent } from "../letterhead";

export function EditorToolbar({
  editor,
  toolbarOffset = 0,
  branch,
  onRequestPlu,
}: {
  editor: Editor;
  toolbarOffset?: number;
  branch?: string;
  onRequestPlu: () => void;
}) {
  const state = useEditorState({
    editor,
    selector: function selectToolbarState({ editor }) {
      return {
        blockType: getCurrentBlockType(editor),
        fontSize: getCurrentFontSize(editor),
        isBold: editor.isActive("bold"),
        isItalic: editor.isActive("italic"),
        isStrike: editor.isActive("strike"),
        isBulletList: editor.isActive("bulletList"),
        isOrderedList: editor.isActive("orderedList"),
        isBlockquote: editor.isActive("blockquote"),
        alignLeft: editor.isActive({ textAlign: "left" }),
        alignCenter: editor.isActive({ textAlign: "center" }),
        alignRight: editor.isActive({ textAlign: "right" }),
        alignJustify: editor.isActive({ textAlign: "justify" }),
        isTable: editor.isActive("table"),
        tableAlign: editor.isActive("table") ? getTableAlign(editor) : null,
      };
    },
  });

  return (
    <div
      style={{ top: toolbarOffset }}
      className="sticky z-30 mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-1 rounded-2xl border border-input bg-background p-1.5 shadow-lg">
      <select
        aria-label="Jenis teks"
        className="h-8 rounded-md border border-input bg-background px-2 text-sm outline-none focus:ring-1 focus:ring-ring"
        value={state.blockType}
        onChange={function changeBlockType(e) {
          setBlockType(editor, e.target.value);
        }}>
        <option value="p">Paragraf</option>
        <option value="h1">Judul 1</option>
        <option value="h2">Judul 2</option>
        <option value="h3">Judul 3</option>
        <option value="h4">Judul 4</option>
        <option value="h5">Judul 5</option>
      </select>
      <input
        type="number"
        min={8}
        max={96}
        step={0.1}
        placeholder="Ukuran"
        aria-label="Ukuran font (px)"
        className="h-8 w-20 rounded-md border border-input bg-background px-2 text-sm outline-none focus:ring-1 focus:ring-ring"
        value={state.fontSize}
        onChange={function changeFontSize(e) {
          const val = e.target.value;
          if (!val) {
            editor.chain().unsetFontSize().run();
            return;
          }
          editor.chain().setFontSize(`${val}px`).run();
        }}
      />
      <div className="mx-1 h-5 w-px bg-border" />
      <ToolbarButton
        label="Tebal"
        active={state.isBold}
        onClick={function toggleBold() {
          editor.chain().focus().toggleBold().run();
        }}>
        <Bold />
      </ToolbarButton>
      <ToolbarButton
        label="Miring"
        active={state.isItalic}
        onClick={function toggleItalic() {
          editor.chain().focus().toggleItalic().run();
        }}>
        <Italic />
      </ToolbarButton>
      <ToolbarButton
        label="Coret"
        active={state.isStrike}
        onClick={function toggleStrike() {
          editor.chain().focus().toggleStrike().run();
        }}>
        <Strikethrough />
      </ToolbarButton>
      <ToolbarButton
        label="Daftar tidak berurut"
        active={state.isBulletList}
        onClick={function toggleBulletList() {
          editor.chain().focus().toggleBulletList().run();
        }}>
        <List />
      </ToolbarButton>
      <ToolbarButton
        label="Daftar berurut"
        active={state.isOrderedList}
        onClick={function toggleOrderedList() {
          editor.chain().focus().toggleOrderedList().run();
        }}>
        <ListOrdered />
      </ToolbarButton>
      <ToolbarButton
        label="Kutipan"
        active={state.isBlockquote}
        onClick={function toggleBlockquote() {
          editor.chain().focus().toggleBlockquote().run();
        }}>
        <Quote />
      </ToolbarButton>
      <div className="mx-1 h-5 w-px bg-border" />
      <ToolbarButton
        label="Rata kiri"
        active={state.alignLeft}
        onClick={function alignLeft() {
          editor.chain().focus().setTextAlign("left").run();
        }}>
        <AlignLeft />
      </ToolbarButton>
      <ToolbarButton
        label="Rata tengah"
        active={state.alignCenter}
        onClick={function alignCenter() {
          editor.chain().focus().setTextAlign("center").run();
        }}>
        <AlignCenter />
      </ToolbarButton>
      <ToolbarButton
        label="Rata kanan"
        active={state.alignRight}
        onClick={function alignRight() {
          editor.chain().focus().setTextAlign("right").run();
        }}>
        <AlignRight />
      </ToolbarButton>
      <ToolbarButton
        label="Rata justify"
        active={state.alignJustify}
        onClick={function alignJustify() {
          editor.chain().focus().setTextAlign("justify").run();
        }}>
        <AlignJustify />
      </ToolbarButton>
      {state.isTable && (
        <>
          <div className="mx-1 h-5 w-px bg-border" />
          <span className="px-1 text-xs font-medium text-muted-foreground">
            Tabel
          </span>
          <ToolbarButton
            label="Posisi tabel: kiri halaman"
            active={state.tableAlign === "left"}
            onClick={function tableAlignLeft() {
              applyTableAlign(editor, "left");
            }}>
            <AlignHorizontalJustifyStart />
          </ToolbarButton>
          <ToolbarButton
            label="Posisi tabel: tengah halaman"
            active={state.tableAlign === "center"}
            onClick={function tableAlignCenter() {
              applyTableAlign(editor, "center");
            }}>
            <AlignHorizontalJustifyCenter />
          </ToolbarButton>
          <ToolbarButton
            label="Posisi tabel: kanan halaman"
            active={state.tableAlign === "right"}
            onClick={function tableAlignRight() {
              applyTableAlign(editor, "right");
            }}>
            <AlignHorizontalJustifyEnd />
          </ToolbarButton>
          <ToolbarButton
            label="Hapus baris"
            onClick={function deleteRow() {
              editor.chain().focus().deleteRow().run();
              renumberPluTable(editor);
            }}>
            <Rows3 />
          </ToolbarButton>
          <ToolbarButton
            label="Hapus tabel"
            onClick={function deleteTable() {
              editor.chain().focus().deleteTable().run();
            }}>
            <Trash2 />
          </ToolbarButton>
        </>
      )}
      <div className="mx-1 h-5 w-px bg-border" />
      <ToolbarButton
        label="Sisipkan kop surat"
        onClick={function insertLetterhead() {
          editor
            .chain()
            .focus()
            .insertContentAt(0, buildLetterheadContent(branch))
            .run();
        }}>
        <FileText />
      </ToolbarButton>
      <ToolbarButton
        label="Sisipkan produk (PLU)"
        onClick={onRequestPlu}>
        <PackageSearch />
      </ToolbarButton>
      <div className="mx-1 h-5 w-px bg-border" />
      <ToolbarButton
        label="Urungkan"
        onClick={function undo() {
          editor.chain().focus().undo().run();
        }}>
        <Undo />
      </ToolbarButton>
      <ToolbarButton
        label="Ulangi"
        onClick={function redo() {
          editor.chain().focus().redo().run();
        }}>
        <Redo />
      </ToolbarButton>
    </div>
  );
}
