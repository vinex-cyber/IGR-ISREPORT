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

function pluText(text: string, fontSize: string = PLU_TABLE_FONT_SIZE): JSONContent {
  return {
    type: "text",
    text,
    marks: [{ type: "textStyle", attrs: { fontSize } }],
  };
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

function pluDataRowJSON(
  columns: ColumnConfig<DaftarProdukRows>[],
  row: DaftarProdukRows,
  no: number,
  fontSize: string = PLU_TABLE_FONT_SIZE,
): JSONContent {
  const noCell: JSONContent = {
    type: "tableCell",
    content: [
      {
        type: "paragraph",
        content: [pluText(String(no), fontSize)],
      },
    ],
  };

  const dataCells = columns.map(function mapCell(col) {
    const text = pluCellText(col, row);
    return {
      type: "tableCell",
      content: [
        {
          type: "paragraph",
          content: text ? [pluText(text, fontSize)] : [],
        },
      ],
    };
  });

  return {
    type: "tableRow",
    content: [noCell, ...dataCells],
  };
}

function buildPluTableNode(
  columns: typeof daftarProdukColumns,
  rows: DaftarProdukRows[],
): JSONContent {
  const visibleColumns = columns.filter(function excludeLpp(col) {
    return col.label !== "LPP";
  });

  const headerRow: JSONContent = {
    type: "tableRow",
    content: [
      {
        type: "tableHeader",
        content: [{ type: "paragraph", content: [pluText("No")] }],
      },
      ...visibleColumns.map(function mapHeader(col) {
        return {
          type: "tableHeader",
          content: [
            {
              type: "paragraph",
              content: [pluText(col.label)],
            },
          ],
        };
      }),
    ],
  };

  const dataRows = rows.map(function mapRow(row, index) {
    return pluDataRowJSON(visibleColumns, row, index + 1);
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
): void {
  const table = buildPluTableNode(daftarProdukColumns, [row]);
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

export function addPluToExistingTable(
  editor: Editor,
  row: DaftarProdukRows,
): void {
  const existing = findPluTable(editor);
  if (!existing) {
    createPluTable(editor, row);
    return;
  }
  const visibleColumns = daftarProdukColumns.filter(function excludeLpp(col) {
    return col.label !== "LPP";
  });
  const dataRowCount = existing.node.childCount - 1;
  const fontSize = findExistingPluFontSize(existing.node);
  const rowJSON = pluDataRowJSON(
    visibleColumns,
    row,
    dataRowCount + 1,
    fontSize,
  );
  const insertPos = existing.pos + existing.node.nodeSize - 1;
  editor.chain().focus().insertContentAt(insertPos, rowJSON).run();
}
