// src/components/input/editor/toolbar/TableToolbarMenu.tsx
import * as React from "react";
import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TableProperties,
  Columns2,
  Columns3,
  Rows2,
  Rows3,
  TableCellsMerge,
  TableCellsSplit,
  Merge,
  ArrowRight,
  ArrowLeft,
  Trash2,
  PaintBucket,
  Wrench,
} from "lucide-react";
import { renumberPluTable } from "../plu/pluTableBuilder";

const CELL_COLORS: { label: string; value: string | null }[] = [
  { label: "Biru muda", value: "#dbeafe" },
  { label: "Kuning muda", value: "#fef9c3" },
  { label: "Hijau muda", value: "#dcfce7" },
  { label: "Merah muda", value: "#fee2e2" },
  { label: "Abu-abu", value: "#f3f4f6" },
  { label: "Hapus warna", value: null },
];

export function TableToolbarMenu({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: function selectTableMenuState({ editor }) {
      return {
        isInTable: editor.isActive("table"),
        canMergeCells: editor.can().mergeCells(),
        canSplitCell: editor.can().splitCell(),
      };
    },
  });

  if (!state.isInTable) return null;

  function runTableCommand(fn: (e: Editor) => void) {
    fn(editor);
  }

  return (
    <DropdownMenu modal={true}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 cursor-pointer"
          aria-label="Menu tabel">
          <TableProperties />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="bottom"
        sideOffset={6}
        collisionPadding={12}
        className="max-h-[var(--radix-dropdown-menu-content-available-height)] overflow-y-auto">
        <DropdownMenuLabel className="font-bold">Tabel</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Kolom
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={function addColumnBefore() {
              runTableCommand((e) =>
                e.chain().focus().addColumnBefore().run(),
              );
            }}>
            <Columns3 />
            <span>Tambah kolom sebelum</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={function addColumnAfter() {
              runTableCommand((e) => e.chain().focus().addColumnAfter().run());
            }}>
            <Columns3 />
            <span>Tambah kolom sesudah</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={function deleteColumn() {
              runTableCommand((e) => e.chain().focus().deleteColumn().run());
            }}>
            <Columns2 />
            <span>Hapus kolom</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Baris
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={function addRowBefore() {
              runTableCommand((e) => {
                e.chain().focus().addRowBefore().run();
                renumberPluTable(e);
              });
            }}>
            <Rows3 />
            <span>Tambah baris sebelum</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={function addRowAfter() {
              runTableCommand((e) => {
                e.chain().focus().addRowAfter().run();
                renumberPluTable(e);
              });
            }}>
            <Rows3 />
            <span>Tambah baris sesudah</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={function deleteRow() {
              runTableCommand((e) => {
                e.chain().focus().deleteRow().run();
                renumberPluTable(e);
              });
            }}>
            <Rows2 />
            <span>Hapus baris</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Sel
          </DropdownMenuLabel>
          <DropdownMenuItem
            disabled={!state.canMergeCells}
            onClick={function mergeCells() {
              runTableCommand((e) => e.chain().focus().mergeCells().run());
            }}>
            <TableCellsMerge />
            <span>Gabung sel</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!state.canSplitCell}
            onClick={function splitCell() {
              runTableCommand((e) => e.chain().focus().splitCell().run());
            }}>
            <TableCellsSplit />
            <span>Pisah sel</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={function mergeOrSplit() {
              runTableCommand((e) => e.chain().focus().mergeOrSplit().run());
            }}>
            <Merge />
            <span>Gabung / pisah</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={function toggleHeaderColumn() {
              runTableCommand((e) =>
                e.chain().focus().toggleHeaderColumn().run(),
              );
            }}>
            <Columns3 />
            <span>Toggle header kolom</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={function toggleHeaderRow() {
              runTableCommand((e) => e.chain().focus().toggleHeaderRow().run());
            }}>
            <Rows3 />
            <span>Toggle header baris</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={function toggleHeaderCell() {
              runTableCommand((e) =>
                e.chain().focus().toggleHeaderCell().run(),
              );
            }}>
            <TableProperties />
            <span>Toggle header sel</span>
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2">
              <PaintBucket />
              <span>Warna latar sel</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {CELL_COLORS.map((color) => (
                <DropdownMenuItem
                  key={color.label}
                  onClick={function setCellBackground() {
                    runTableCommand((e) =>
                      e
                        .chain()
                        .focus()
                        .setCellAttribute(
                          "backgroundColor",
                          color.value as string | null,
                        )
                        .run(),
                    );
                  }}>
                  <span
                    aria-hidden
                    className="inline-block size-4 rounded border border-border"
                    style={{
                      backgroundColor: color.value ?? "transparent",
                    }}
                  />
                  <span>{color.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Lainnya
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={function fixTables() {
              runTableCommand((e) => e.chain().focus().fixTables().run());
            }}>
            <Wrench />
            <span>Perbaiki tabel</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={function goToNextCell() {
              runTableCommand((e) => e.chain().focus().goToNextCell().run());
            }}>
            <ArrowRight />
            <span>Pindah sel berikutnya</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={function goToPreviousCell() {
              runTableCommand((e) =>
                e.chain().focus().goToPreviousCell().run(),
              );
            }}>
            <ArrowLeft />
            <span>Pindah sel sebelumnya</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={function deleteTable() {
              runTableCommand((e) => e.chain().focus().deleteTable().run());
            }}>
            <Trash2 />
            <span>Hapus tabel</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
