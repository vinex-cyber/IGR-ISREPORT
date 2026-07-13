// src/utils/exportToPdf/editorPdf.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { JSONContent } from "@tiptap/react";

type AutoTableDoc = jsPDF & {
  lastAutoTable?: { finalY: number };
};

type RGB = [number, number, number];

const PX_TO_PT = 0.75;
const DEFAULT_PX = 14.7;
const MARGIN = 40;
const LINE_HEIGHT = 1.3;
const BLUE: RGB = [37, 99, 235];
const BORDER_BLUE: RGB = [147, 197, 253];

const HEADING_PX: Record<number, number> = {
  1: 32,
  2: 24,
  3: 18.72,
  4: 16,
  5: 13.28,
};

function hexToRgb(hex?: string): RGB | null {
  if (!hex) return null;
  const m = hex.replace("#", "");
  if (m.length !== 6) return null;
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  if ([r, g, b].some(Number.isNaN)) return null;
  return [r, g, b];
}

function findMark(marks: JSONContent["marks"], name: string) {
  return marks?.find(function matchMark(mark) {
    return mark.type === name;
  });
}

function runSizePx(marks: JSONContent["marks"]): number | null {
  const style = findMark(marks, "textStyle");
  const raw = style?.attrs?.fontSize;
  if (typeof raw === "string") {
    const value = parseFloat(raw);
    return Number.isNaN(value) ? null : value;
  }
  return null;
}

function runColor(marks: JSONContent["marks"]): RGB | null {
  const style = findMark(marks, "textStyle");
  const raw = style?.attrs?.color;
  return typeof raw === "string" ? hexToRgb(raw) : null;
}

function plainText(node?: JSONContent): string {
  if (!node) return "";
  if (node.type === "text") return node.text ?? "";
  if (node.type === "hardBreak") return " ";
  if (!node.content) return "";
  return node.content.map(plainText).join("");
}

function splitByHardBreak(content?: JSONContent[]): JSONContent[][] {
  const lines: JSONContent[][] = [[]];
  (content ?? []).forEach(function distribute(child) {
    if (child.type === "hardBreak") {
      lines.push([]);
      return;
    }
    lines[lines.length - 1].push(child);
  });
  return lines;
}

function loadImageAsDataUrl(
  src: string,
): Promise<{ dataUrl: string; w: number; h: number }> {
  return new Promise(function executor(resolve, reject) {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = function onLoad() {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context tidak tersedia"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve({
        dataUrl: canvas.toDataURL("image/png"),
        w: img.naturalWidth,
        h: img.naturalHeight,
      });
    };
    img.onerror = function onError() {
      reject(new Error(`Gagal memuat gambar: ${src}`));
    };
    img.src = src;
  });
}

export async function buildEditorPdf(
  content: JSONContent | null,
): Promise<jsPDF> {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - MARGIN * 2;
  let y = MARGIN;

  function ensureSpace(height: number): void {
    if (y + height > pageHeight - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  }

  function applyFont(sizePx: number, bold: boolean, italic: boolean): void {
    const style =
      bold && italic ? "bolditalic" : bold ? "bold" : italic ? "italic" : "normal";
    doc.setFont("helvetica", style);
    doc.setFontSize(sizePx * PX_TO_PT);
  }

  function renderTextBlock(
    node: JSONContent,
    options: {
      defaultSizePx: number;
      forceBold?: boolean;
      x?: number;
      width?: number;
    },
  ): void {
    const x = options.x ?? MARGIN;
    const width = options.width ?? contentWidth;
    const align =
      (node.attrs?.textAlign as "left" | "center" | "right" | "justify") ??
      "left";
    const lines = splitByHardBreak(node.content);

    lines.forEach(function renderLine(runs) {
      const firstRun = runs.find(function isText(run) {
        return run.type === "text";
      });
      const sizePx = runSizePx(firstRun?.marks) ?? options.defaultSizePx;
      const bold = Boolean(options.forceBold) || Boolean(findMark(firstRun?.marks, "bold"));
      const italic = Boolean(findMark(firstRun?.marks, "italic"));
      const color = runColor(firstRun?.marks) ?? [0, 0, 0];
      const text = runs
        .filter(function isText(run) {
          return run.type === "text";
        })
        .map(function toText(run) {
          return run.text ?? "";
        })
        .join("");

      applyFont(sizePx, bold, italic);
      doc.setTextColor(color[0], color[1], color[2]);
      const lineHeight = sizePx * PX_TO_PT * LINE_HEIGHT;
      const wrapped = doc.splitTextToSize(text || " ", width);

      wrapped.forEach(function renderWrapped(segment: string) {
        ensureSpace(lineHeight);
        let drawX = x;
        if (align === "center") drawX = x + width / 2;
        else if (align === "right") drawX = x + width;
        doc.text(segment, drawX, y, {
          align: align === "justify" ? "left" : align,
        });
        y += lineHeight;
      });
    });
    doc.setTextColor(0, 0, 0);
  }

  function renderHeading(node: JSONContent): void {
    const level = Number(node.attrs?.level ?? 1);
    renderTextBlock(node, {
      defaultSizePx: HEADING_PX[level] ?? DEFAULT_PX,
      forceBold: true,
    });
  }

  function renderHorizontalRule(node: JSONContent): void {
    const thicknessMap: Record<string, number> = {
      thin: 1,
      medium: 2,
      thick: 4,
    };
    const thickness =
      thicknessMap[(node.attrs?.thickness as string) ?? "medium"] ?? 2;
    const color = hexToRgb(node.attrs?.color as string) ?? [150, 150, 150];
    ensureSpace(thickness + 8);
    y += 4;
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(thickness);
    doc.line(MARGIN, y, pageWidth - MARGIN, y);
    y += thickness + 16;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
  }

  async function renderLetterheadHeader(node: JSONContent): Promise<void> {
    const row = node.content?.[0];
    const cells = row?.content ?? [];
    const imageNode = cells[0]?.content?.find(function isImage(child) {
      return child.type === "image";
    });
    const textCell = cells[1];
    const yStart = y;
    let imgH = 0;
    let textX = MARGIN;

    if (imageNode?.attrs?.src) {
      try {
        const src = String(imageNode.attrs.src);
        const abs = src.startsWith("http") ? src : window.location.origin + src;
        const { dataUrl, w, h } = await loadImageAsDataUrl(abs);
        const displayW = 90;
        const displayH = (h / w) * displayW;
        imgH = displayH;
        doc.addImage(dataUrl, "PNG", MARGIN, yStart, displayW, displayH);
        textX = MARGIN + displayW + 14;
      } catch {
        textX = MARGIN;
      }
    }

    const textWidth = pageWidth - MARGIN - textX;
    if (imgH > 0) {
      const nameSizePx =
        runSizePx(
          textCell?.content?.[0]?.content?.[0]?.marks,
        ) ?? HEADING_PX[5];
      const nameLineHeight = nameSizePx * PX_TO_PT * LINE_HEIGHT;
      y = yStart + imgH / 2 - nameLineHeight / 2 + nameSizePx * PX_TO_PT * 0.8;
    }
    (textCell?.content ?? []).forEach(function renderTextCell(child) {
      if (child.type === "heading") {
        renderTextBlock(child, {
          defaultSizePx: HEADING_PX[Number(child.attrs?.level ?? 5)] ?? DEFAULT_PX,
          forceBold: true,
          x: textX,
          width: textWidth,
        });
      } else if (child.type === "paragraph") {
        renderTextBlock(child, {
          defaultSizePx: DEFAULT_PX,
          x: textX,
          width: textWidth,
        });
      }
    });

    if (yStart + imgH > y) y = yStart + imgH;
    y += 6;
  }

  function renderLetterheadInfo(node: JSONContent): void {
    const labelX = MARGIN;
    const colonX = MARGIN + 70;
    const valueX = MARGIN + 82;
    (node.content ?? []).forEach(function renderInfoRow(row) {
      const cells = row.content ?? [];
      const label = plainText(cells[0]);
      const value = plainText(cells[2]);
      applyFont(DEFAULT_PX, false, false);
      const lineHeight = DEFAULT_PX * PX_TO_PT * LINE_HEIGHT;
      ensureSpace(lineHeight);
      doc.setTextColor(0, 0, 0);
      doc.text(label, labelX, y);
      doc.text(":", colonX, y);
      doc.text(value, valueX, y);
      y += lineHeight;
    });
    y += 4;
  }

  function renderGridTable(node: JSONContent): void {
    const rows = node.content ?? [];
    if (rows.length === 0) return;
    const firstRowCells = rows[0].content ?? [];
    const isHeaderFirst = firstRowCells.some(function isHeader(cell) {
      return cell.type === "tableHeader";
    });
    const head = isHeaderFirst
      ? [firstRowCells.map(plainText)]
      : undefined;
    const bodyRows = isHeaderFirst ? rows.slice(1) : rows;
    const body = bodyRows.map(function toBodyRow(row) {
      return (row.content ?? []).map(plainText);
    });

    autoTable(doc, {
      startY: y,
      head,
      body,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2, lineColor: BORDER_BLUE },
      headStyles: { fillColor: BLUE, textColor: 255, fontStyle: "bold" },
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: "wrap",
    });
    y = (doc as AutoTableDoc).lastAutoTable?.finalY ?? y;
    y += 10;
  }

  async function renderNode(node: JSONContent): Promise<void> {
    switch (node.type) {
      case "heading":
        renderHeading(node);
        break;
      case "paragraph":
        renderTextBlock(node, { defaultSizePx: DEFAULT_PX });
        break;
      case "horizontalRule":
        renderHorizontalRule(node);
        break;
      case "bulletList":
      case "orderedList":
        (node.content ?? []).forEach(function renderItem(item, index) {
          const bullet =
            node.type === "orderedList" ? `${index + 1}. ` : "\u2022 ";
          const text = plainText(item);
          applyFont(DEFAULT_PX, false, false);
          const lineHeight = DEFAULT_PX * PX_TO_PT * LINE_HEIGHT;
          const wrapped = doc.splitTextToSize(
            bullet + text,
            contentWidth - 12,
          );
          wrapped.forEach(function renderWrapped(segment: string) {
            ensureSpace(lineHeight);
            doc.text(segment, MARGIN + 12, y);
            y += lineHeight;
          });
        });
        y += 4;
        break;
      case "table": {
        const cls = String(node.attrs?.class ?? "");
        if (cls === "letterhead-header") {
          await renderLetterheadHeader(node);
        } else if (cls === "letterhead-info") {
          renderLetterheadInfo(node);
        } else {
          renderGridTable(node);
        }
        break;
      }
      default:
        break;
    }
  }

  const nodes = content?.content ?? [];
  for (const node of nodes) {
    await renderNode(node);
  }

  return doc;
}

export async function editorJsonToPdfBlobUrl(
  content: JSONContent | null,
): Promise<string> {
  const doc = await buildEditorPdf(content);
  const blob = doc.output("blob");
  return URL.createObjectURL(blob);
}

export async function downloadEditorPdf(
  content: JSONContent | null,
  fileName = "dokumen.pdf",
): Promise<void> {
  const doc = await buildEditorPdf(content);
  doc.save(fileName);
}

export async function printEditorPdf(
  content: JSONContent | null,
): Promise<void> {
  const doc = await buildEditorPdf(content);
  doc.autoPrint();
  const url = doc.output("bloburl");
  const win = window.open(url, "_blank");
  if (!win) URL.revokeObjectURL(url as unknown as string);
}
