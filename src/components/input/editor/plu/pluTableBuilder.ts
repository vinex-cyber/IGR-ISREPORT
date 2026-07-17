// src/components/input/editor/plu/pluTableBuilder.ts
import type { Editor } from "@tiptap/core";
import type { Node as PMNode } from "@tiptap/pm/model";
import type { JSONContent } from "@tiptap/react";
import {
  daftarProdukColumns,
  type DaftarProdukRows,
} from "@/configs/input/daftar-produkConfig";
import type { ColumnConfig } from "@/types/report";
import { formatNumber } from "@/utils/formatNumber";
import { findPluTable } from "../extensions/pluTable";

const PLU_TABLE_FONT_SIZE = "10.4px";
const QTY_LABEL = "Qty";
const TOTAL_LABEL = "Total Harga";

function pluText(text: string, fontSize: string = PLU_TABLE_FONT_SIZE): JSONContent {
  return {
    type: "text",
    text,
    marks: [{ type: "textStyle", attrs: { fontSize } }],
  };
}

function getVisibleColumns(): ColumnConfig<DaftarProdukRows>[] {
  return daftarProdukColumns.filter(function excludeLpp(col) {
    return col.label !== "LPP";
  });
}

function findExistingPluFontSize(node: PMNode): string {
  let found: string | null = null;
  node.descendants(function traverse(child) {
    if (found) return false;
    if (child.isText) {
      const mark = child.marks.find(function isTextStyle(m) {
        return m.type.name === "textStyle";
      });
      const size = mark?.attrs.fontSize;
      if (typeof size === "string" && size) {
        found = size;
        return false;
      }
    }
    return true;
  });
  return found ?? PLU_TABLE_FONT_SIZE;
}

function pluCellText(
  col: ColumnConfig<DaftarProdukRows>,
  row: DaftarProdukRows,
): string {
  const raw = row[col.field];
  return col.isNumeric ? formatNumber(Number(raw ?? 0)) : String(raw ?? "");
}

function cell(text: string, fontSize: string): JSONContent {
  return {
    type: "tableCell",
    content: [
      {
        type: "paragraph",
        content: text ? [pluText(text, fontSize)] : [],
      },
    ],
  };
}

function headerCell(text: string): JSONContent {
  return {
    type: "tableHeader",
    content: [{ type: "paragraph", content: [pluText(text)] }],
  };
}

function pluDataRowJSON(
  columns: ColumnConfig<DaftarProdukRows>[],
  row: DaftarProdukRows,
  no: number,
  qty: number | null,
  withQtyColumns: boolean,
  fontSize: string = PLU_TABLE_FONT_SIZE,
): JSONContent {
  const noCell = cell(String(no), fontSize);
  const dataCells = columns.map(function mapCell(col) {
    return cell(pluCellText(col, row), fontSize);
  });

  const cells: JSONContent[] = [noCell, ...dataCells];

  if (withQtyColumns) {
    const hasQty = typeof qty === "number" && qty > 0;
    const total = hasQty ? qty * Number(row.harga ?? 0) : null;
    cells.push(cell(hasQty ? formatNumber(qty) : "", fontSize));
    cells.push(cell(total !== null ? formatNumber(total) : "", fontSize));
  }

  return {
    type: "tableRow",
    content: cells,
  };
}

function buildPluTableNode(
  rows: DaftarProdukRows[],
  qtys: (number | null)[],
): JSONContent {
  const visibleColumns = getVisibleColumns();
  const withQtyColumns = qtys.some(function hasQty(q) {
    return typeof q === "number" && q > 0;
  });

  const headerCells: JSONContent[] = [
    headerCell("No"),
    ...visibleColumns.map(function mapHeader(col) {
      return headerCell(col.label);
    }),
  ];
  if (withQtyColumns) {
    headerCells.push(headerCell(QTY_LABEL));
    headerCells.push(headerCell(TOTAL_LABEL));
  }

  const headerRow: JSONContent = {
    type: "tableRow",
    content: headerCells,
  };

  const dataRows = rows.map(function mapRow(row, index) {
    return pluDataRowJSON(
      visibleColumns,
      row,
      index + 1,
      qtys[index] ?? null,
      withQtyColumns,
    );
  });

  return {
    type: "table",
    attrs: { class: "plu-table" },
    content: [headerRow, ...dataRows],
  };
}

export function createPluTable(
  editor: Editor,
  row: DaftarProdukRows,
  description?: string,
  qty?: number | null,
): void {
  const table = buildPluTableNode([row], [qty ?? null]);
  if (description && description.trim()) {
    const descriptionNode: JSONContent = {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: description.trim() }],
    };
    editor.chain().focus().insertContent([descriptionNode, table]).run();
  } else {
    editor.chain().focus().insertContent(table).run();
  }
}

export function renumberPluTable(editor: Editor): void {
  const existing = findPluTable(editor);
  if (!existing) return;
  const { node, pos } = existing;

  type NoEdit = { from: number; to: number; current: string; marks: PMNode["marks"] };
  const edits: NoEdit[] = [];
  let acc = 0;
  let dataNo = 0;

  node.forEach(function eachRow(rowNode) {
    const rowStartAbs = pos + 1 + acc;
    acc += rowNode.nodeSize;
    const firstCell = rowNode.firstChild;
    if (!firstCell || firstCell.type.name !== "tableCell") return;
    dataNo += 1;
    const targetNo = dataNo;
    const cellStartAbs = rowStartAbs + 1;
    let handled = false;
    firstCell.descendants(function findText(child, relPos) {
      if (handled) return false;
      if (child.isText) {
        const from = cellStartAbs + 1 + relPos;
        handled = true;
        if (child.text !== String(targetNo)) {
          edits.push({
            from,
            to: from + child.nodeSize,
            current: String(targetNo),
            marks: child.marks,
          });
        }
        return false;
      }
      return true;
    });
  });

  if (edits.length === 0) return;
  const tr = editor.state.tr;
  edits
    .sort(function byPosDesc(a, b) {
      return b.from - a.from;
    })
    .forEach(function applyEdit(edit) {
      const textNode = editor.schema.text(edit.current, edit.marks);
      tr.replaceWith(edit.from, edit.to, textNode);
    });
  editor.view.dispatch(tr);
}

// ============================================================
// Baca isi tabel PLU existing menjadi baris teks mentah
// (dipakai saat perlu rebuild tabel untuk menambah kolom qty)
// ============================================================
function tableToTextRows(node: PMNode): string[][] {
  const rows: string[][] = [];
  node.forEach(function eachRow(rowNode) {
    const cells: string[] = [];
    rowNode.forEach(function eachCell(cellNode) {
      cells.push(cellNode.textContent);
    });
    rows.push(cells);
  });
  return rows;
}

// Deteksi apakah tabel existing sudah punya kolom Qty & Total Harga
function existingHasQtyColumns(node: PMNode): boolean {
  const headerRow = node.firstChild;
  if (!headerRow) return false;
  const labels: string[] = [];
  headerRow.forEach(function eachHeader(cellNode) {
    labels.push(cellNode.textContent.trim());
  });
  return labels.includes(QTY_LABEL) && labels.includes(TOTAL_LABEL);
}

// Bangun ulang node tabel dari baris teks + tambahkan kolom qty
function rebuildTableWithQty(
  existingRows: string[][],
  fontSize: string,
  newRow: DaftarProdukRows,
  newQty: number | null,
): JSONContent {
  const visibleColumns = getVisibleColumns();
  const baseColCount = 1 + visibleColumns.length; // No + kolom data

  const headerCells: JSONContent[] = [
    headerCell("No"),
    ...visibleColumns.map(function mapHeader(col) {
      return headerCell(col.label);
    }),
    headerCell(QTY_LABEL),
    headerCell(TOTAL_LABEL),
  ];

  // Baris data lama (skip header), qty & total dikosongkan
  const dataRows: JSONContent[] = existingRows
    .slice(1)
    .map(function mapOldRow(textCells, index) {
      const cells: JSONContent[] = [];
      cells.push(cell(String(index + 1), fontSize));
      for (let i = 1; i < baseColCount; i += 1) {
        cells.push(cell(textCells[i] ?? "", fontSize));
      }
      cells.push(cell("", fontSize));
      cells.push(cell("", fontSize));
      return { type: "tableRow", content: cells } as JSONContent;
    });

  // Baris baru
  const newNo = dataRows.length + 1;
  const newRowJSON = pluDataRowJSON(
    visibleColumns,
    newRow,
    newNo,
    newQty,
    true,
    fontSize,
  );

  return {
    type: "table",
    attrs: { class: "plu-table" },
    content: [
      { type: "tableRow", content: headerCells } as JSONContent,
      ...dataRows,
      newRowJSON,
    ],
  };
}

export function addPluToExistingTable(
  editor: Editor,
  row: DaftarProdukRows,
  qty?: number | null,
): void {
  const existing = findPluTable(editor);
  if (!existing) {
    createPluTable(editor, row, undefined, qty);
    return;
  }

  const fontSize = findExistingPluFontSize(existing.node);
  const hasQtyCol = existingHasQtyColumns(existing.node);
  const wantQty = typeof qty === "number" && qty > 0;

  // Perlu rebuild tabel bila PLU baru punya qty tapi tabel lama belum ada kolomnya
  if (wantQty && !hasQtyCol) {
    const textRows = tableToTextRows(existing.node);
    const rebuilt = rebuildTableWithQty(textRows, fontSize, row, qty ?? null);
    editor
      .chain()
      .focus()
      .insertContentAt(
        { from: existing.pos, to: existing.pos + existing.node.nodeSize },
        rebuilt,
      )
      .run();
    return;
  }

  // Tabel sudah punya kolom qty (atau PLU baru tanpa qty) -> cukup tambah baris
  const visibleColumns = getVisibleColumns();
  const dataRowCount = existing.node.childCount - 1;
  const rowJSON = pluDataRowJSON(
    visibleColumns,
    row,
    dataRowCount + 1,
    qty ?? null,
    hasQtyCol,
    fontSize,
  );
  const insertPos = existing.pos + existing.node.nodeSize - 1;
  editor.chain().focus().insertContentAt(insertPos, rowJSON).run();
}
