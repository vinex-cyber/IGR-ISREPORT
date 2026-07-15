// src/utils/exportToPdf/editorPdf.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { JSONContent } from "@tiptap/react";
import { lowlight } from "@/components/input/editor/extensions/codeBlockLowlight";

type AutoTableDoc = jsPDF & {
  lastAutoTable?: { finalY: number };
};

type RGB = [number, number, number];

const PX_TO_PT = 0.75;
const DEFAULT_PX = 14.7;
const MARGIN = 54;
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

function codeText(node?: JSONContent): string {
  if (!node) return "";
  if (node.type === "text") return node.text ?? "";
  if (!node.content) return "";
  return node.content.map(codeText).join("");
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

  function applyFont(
    sizePx: number,
    bold: boolean,
    italic: boolean,
    family = "helvetica",
  ): void {
    const style =
      bold && italic ? "bolditalic" : bold ? "bold" : italic ? "italic" : "normal";
    doc.setFont(family, style);
    doc.setFontSize(sizePx * PX_TO_PT);
  }

  function renderTextBlock(
    node: JSONContent,
    options: {
      defaultSizePx: number;
      forceBold?: boolean;
      x?: number;
      width?: number;
      family?: string;
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

      applyFont(sizePx, bold, italic, options.family);
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

  function renderHeading(
    node: JSONContent,
    family = "helvetica",
    trailingGap = 12,
  ): void {
    const level = Number(node.attrs?.level ?? 1);
    renderTextBlock(node, {
      defaultSizePx: HEADING_PX[level] ?? DEFAULT_PX,
      forceBold: true,
      family,
    });
    y += trailingGap;
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
    ensureSpace(thickness + 4);
    y += 1;
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(thickness);
    doc.line(MARGIN, y, pageWidth - MARGIN, y);
    const trailingGap = thickness <= 1 ? 34 : 1;
    y += thickness + trailingGap;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
  }

  async function renderLetterheadHeader(node: JSONContent): Promise<void> {
    const row = node.content?.[0];
    const cells = row?.content ?? [];
    const logoCell = cells[0];
    const companyCell = cells[1];
    const yStart = y;
    const logoW = 170;
    let imgH = 0;

    const imageNode = logoCell?.content?.find(function isImage(child) {
      return child.type === "image";
    });
    if (imageNode?.attrs?.src) {
      try {
        const src = String(imageNode.attrs.src);
        const abs = src.startsWith("http")
          ? src
          : window.location.origin + src;
        const { dataUrl, w, h } = await loadImageAsDataUrl(abs);
        const displayH = (h / w) * logoW;
        imgH = displayH;
        doc.addImage(dataUrl, "PNG", MARGIN, yStart, logoW, displayH);
      } catch {
        /* abaikan bila logo gagal dimuat */
      }
    }

    // nama singkat di bawah logo (sel kiri)
    const nameBelow = logoCell?.content?.find(function isParagraph(child) {
      return child.type === "paragraph";
    });
    if (nameBelow) {
      y = yStart + imgH + 16;
      renderTextBlock(nameBelow, {
        defaultSizePx: 18,
        forceBold: true,
        family: "times",
        x: MARGIN,
        width: logoW,
      });
    }
    const leftEnd = y;

    // perusahaan + alamat di sel kanan
    const textX = MARGIN + logoW + 14;
    const textWidth = pageWidth - MARGIN - textX;
    const nameNode = companyCell?.content?.find(function isHeading(child) {
      return child.type === "heading";
    });
    const addrNode = companyCell?.content?.find(function isParagraph(child) {
      return child.type === "paragraph";
    });

    y = yStart;
    if (nameNode) {
      renderTextBlock(nameNode, {
        defaultSizePx: 20,
        forceBold: true,
        family: "times",
        x: textX,
        width: textWidth,
      });
    }
    y += 4;
    if (addrNode) {
      renderTextBlock(addrNode, {
        defaultSizePx: 14,
        x: textX,
        width: textWidth,
      });
    }
    const rightEnd = y;

    y = Math.max(leftEnd, rightEnd) + 4;
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

  function renderLetterheadSignature(node: JSONContent): void {
    const rows = node.content ?? [];
    if (rows.length === 0) return;
    const cells = rows[0].content ?? [];
    const signCell = cells[cells.length - 1];
    const blockWidth = (pageWidth - MARGIN * 2) / 2;
    const startX = MARGIN + (pageWidth - MARGIN * 2) / 2;
    (signCell?.content ?? []).forEach(function renderSignLine(child) {
      if (child.type === "paragraph") {
        const text = plainText(child);
        const lineHeight = DEFAULT_PX * PX_TO_PT * LINE_HEIGHT;
        if (text) {
          applyFont(DEFAULT_PX, false, false);
          ensureSpace(lineHeight);
          doc.setTextColor(0, 0, 0);
          doc.text(text, startX + blockWidth / 2, y, { align: "center" });
          y += lineHeight;
        } else {
          ensureSpace(lineHeight);
          y += lineHeight;
        }
      }
    });
    y += 6;
  }

  function measureGridTableWidth(node: JSONContent): number {
    const rows = node.content ?? [];
    if (rows.length === 0) return 0;
    const colCount = rows.reduce(function maxCols(max, r) {
      return Math.max(max, (r.content ?? []).length);
    }, 0);
    const colWidths = new Array(colCount).fill(0);
    const padX = 2 * 2;
    rows.forEach(function measureRow(r) {
      (r.content ?? []).forEach(function measureCell(cell, ci) {
        if (ci >= colWidths.length) return;
        const isHeader = cell.type === "tableHeader";
        doc.setFont("helvetica", isHeader ? "bold" : "normal");
        doc.setFontSize(8);
        const w = doc.getTextWidth(plainText(cell));
        colWidths[ci] = Math.max(colWidths[ci], w + padX);
      });
    });
    return colWidths.reduce(function sum(a, b) {
      return a + b;
    }, 0);
  }

  function tableHorizontalMargin(
    align: string,
    naturalWidth: number,
  ): { left: number; right: number } {
    const available = pageWidth - MARGIN * 2;
    if (align === "center") {
      return { left: MARGIN + Math.max(0, (available - naturalWidth) / 2), right: MARGIN };
    }
    if (align === "right") {
      return { left: MARGIN + Math.max(0, available - naturalWidth), right: MARGIN };
    }
    return { left: MARGIN, right: MARGIN };
  }

  function cellHalign(cell: JSONContent): "left" | "center" | "right" {
    const paragraph = (cell.content ?? []).find(function isParagraph(child) {
      return child.type === "paragraph";
    });
    const align = paragraph?.attrs?.textAlign as string | undefined;
    if (align === "center" || align === "right") return align;
    return "left";
  }

  function toAutoTableCell(cell: JSONContent) {
    return {
      content: plainText(cell),
      styles: { halign: cellHalign(cell) },
    };
  }

  function renderGridTable(node: JSONContent): void {
    const rows = node.content ?? [];
    if (rows.length === 0) return;
    const firstRowCells = rows[0].content ?? [];
    const isHeaderFirst = firstRowCells.some(function isHeader(cell) {
      return cell.type === "tableHeader";
    });
    const head = isHeaderFirst
      ? [firstRowCells.map(toAutoTableCell)]
      : undefined;
    const bodyRows = isHeaderFirst ? rows.slice(1) : rows;
    const body = bodyRows.map(function toBodyRow(row) {
      return (row.content ?? []).map(toAutoTableCell);
    });

    const align = (node.attrs?.align as string) ?? "left";
    const naturalWidth = measureGridTableWidth(node);
    const margins = tableHorizontalMargin(align, naturalWidth);

    autoTable(doc, {
      startY: y,
      head,
      body,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2, lineColor: BORDER_BLUE },
      headStyles: { fillColor: BLUE, textColor: 255, fontStyle: "bold" },
      margin: margins,
      tableWidth: "wrap",
    });
    y = (doc as AutoTableDoc).lastAutoTable?.finalY ?? y;
    y += 10;
  }

  function hljsColor(classes: unknown): RGB {
    const list = Array.isArray(classes) ? (classes as string[]) : [];
    const has = function check(c: string): boolean {
      return list.includes(c);
    };
    if (has("hljs-comment") || has("hljs-quote")) return [106, 153, 85];
    if (
      has("hljs-keyword") ||
      has("hljs-selector-tag") ||
      has("hljs-literal") ||
      has("hljs-type") ||
      has("hljs-built_in") ||
      has("hljs-tag")
    )
      return [86, 156, 214];
    if (
      has("hljs-string") ||
      has("hljs-attr") ||
      has("hljs-meta") ||
      has("hljs-symbol") ||
      has("hljs-regexp")
    )
      return [206, 145, 120];
    if (has("hljs-number") || has("hljs-link")) return [181, 206, 168];
    if (
      has("hljs-title") ||
      has("hljs-section") ||
      has("hljs-name") ||
      has("hljs-selector-id") ||
      has("hljs-selector-class") ||
      has("hljs-function") ||
      has("hljs-class") ||
      has("hljs-property") ||
      has("hljs-params") ||
      has("hljs-title.function_")
    )
      return [220, 220, 170];
    if (
      has("hljs-attribute") ||
      has("hljs-variable") ||
      has("hljs-template-variable")
    )
      return [156, 220, 254];
    return [201, 209, 217];
  }

  type ColoredRun = { text: string; color: RGB };

  function flattenHast(
    node: unknown,
    color: RGB | null,
    out: ColoredRun[],
  ): void {
    const n = node as {
      type: string;
      value?: string;
      properties?: { className?: unknown };
      children?: unknown[];
    };
    if (n.type === "text") {
      if (typeof n.value === "string") {
        out.push({ text: n.value, color: color ?? [201, 209, 217] });
      }
      return;
    }
    const nextColor =
      n.type === "element" ? hljsColor(n.properties?.className) : color;
    (n.children ?? []).forEach(function walk(child) {
      flattenHast(child, nextColor, out);
    });
  }

  function renderCodeBlock(node: JSONContent): void {
    const code = codeText(node);
    const sizePx = 10.5;
    const lineHeight = sizePx * PX_TO_PT * 1.35;
    const padding = 8;
    const innerW = contentWidth - padding * 2;
    doc.setFont("courier", "normal");
    doc.setFontSize(sizePx * PX_TO_PT);

    const language = (node.attrs?.language as string) ?? "plaintext";
    let runs: ColoredRun[] = [];
    if (language && language !== "plaintext") {
      try {
        const tree = lowlight.registered(language)
          ? lowlight.highlight(language, code)
          : lowlight.highlightAuto(code);
        flattenHast(tree, null, runs);
      } catch {
        runs = [{ text: code, color: [201, 209, 217] }];
      }
    } else {
      runs = [{ text: code, color: [201, 209, 217] }];
    }

    type Item = { text: string; color: RGB; nl?: boolean };
    const items: Item[] = [];
    runs.forEach(function buildItems(run) {
      const parts = run.text.split(/(\n)/);
      parts.forEach(function eachPart(part, i) {
        if (i % 2 === 1) {
          items.push({ text: "\n", color: run.color, nl: true });
          return;
        }
        if (part === "") return;
        part.split(/(\s+)/).forEach(function eachSub(s) {
          if (s === "") return;
          items.push({ text: s, color: run.color });
        });
      });
    });

    const lines: Item[][] = [[]];
    let lineWidth = 0;
    items.forEach(function layout(item) {
      if (item.nl) {
        lines.push([]);
        lineWidth = 0;
        return;
      }
      const w = doc.getTextWidth(item.text);
      if (lineWidth + w > innerW && lines[lines.length - 1].length > 0) {
        lines.push([]);
        lineWidth = 0;
      }
      lines[lines.length - 1].push(item);
      lineWidth += w;
    });

    const blockHeight = lines.length * lineHeight + padding * 2;
    ensureSpace(blockHeight);
    const startY = y;
    doc.setFillColor(13, 17, 23);
    doc.rect(MARGIN, startY, contentWidth, blockHeight, "F");
    doc.setDrawColor(48, 54, 61);
    doc.setLineWidth(0.5);
    doc.rect(MARGIN, startY, contentWidth, blockHeight);
    let drawY = startY + padding + sizePx * PX_TO_PT;
    lines.forEach(function drawLine(lineItems) {
      let x = MARGIN + padding;
      lineItems.forEach(function drawItem(it) {
        doc.setTextColor(it.color[0], it.color[1], it.color[2]);
        doc.text(it.text, x, drawY);
        x += doc.getTextWidth(it.text);
      });
      drawY += lineHeight;
    });
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    y = startY + blockHeight + 10;
  }

  async function renderNode(
    node: JSONContent,
    nextNode?: JSONContent,
  ): Promise<void> {
    switch (node.type) {
      case "paragraph":
        renderTextBlock(node, { defaultSizePx: DEFAULT_PX });
        break;
      case "horizontalRule":
        renderHorizontalRule(node);
        break;
      case "codeBlock":
        renderCodeBlock(node);
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
      case "heading":
        if (nextNode?.type === "table") {
          y += 10;
          renderHeading(node, "helvetica", -6);
        } else {
          renderHeading(node, "helvetica", 12);
        }
        break;
      case "table": {
        const cls = String(node.attrs?.class ?? "");
        if (cls === "letterhead-header") {
          await renderLetterheadHeader(node);
        } else if (cls === "letterhead-info") {
          renderLetterheadInfo(node);
        } else if (cls === "letterhead-signature") {
          renderLetterheadSignature(node);
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
  for (let i = 0; i < nodes.length; i += 1) {
    await renderNode(nodes[i], nodes[i + 1]);
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
