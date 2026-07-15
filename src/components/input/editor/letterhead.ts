// src/components/input/editor/letterhead.ts
import type { JSONContent } from "@tiptap/react";
import { FormatTanggal } from "@/utils/formatTanggal";
import { getLetterheadInfo } from "@/configs/input/letterheadConfig";
import { getBranchLogo } from "@/utils/getBranchTheme";

const LETTERHEAD_FONT_SIZE = "14.7px";

export function buildLetterheadContent(branch?: string): JSONContent[] {
  const tanggal = FormatTanggal(new Date());
  const info = getLetterheadInfo(branch);
  const logo = getBranchLogo(branch);
  function paragraph(
    text: string,
    align?: "left" | "center" | "right",
    fontSize: string = LETTERHEAD_FONT_SIZE,
    bold = false,
  ): JSONContent {
    const node: JSONContent = { type: "paragraph" };
    if (align) node.attrs = { textAlign: align };
    if (text) {
      const parts = text.split("\n");
      const content: JSONContent[] = [];
      parts.forEach(function appendPart(part, index) {
        if (index > 0) content.push({ type: "hardBreak" });
        if (part)
          content.push({
            type: "text",
            text: part,
            marks: [
              {
                type: "textStyle",
                attrs: { fontSize },
              },
              ...(bold ? [{ type: "bold" }] : []),
            ],
          });
      });
      node.content = content;
    }
    return node;
  }
  function infoCell(text: string): JSONContent {
    return { type: "tableCell", content: [paragraph(text)] };
  }
  function infoRow(label: string, value: string): JSONContent {
    return {
      type: "tableRow",
      content: [infoCell(label), infoCell(":"), infoCell(value)],
    };
  }
  function imageParagraph(src: string, alt: string): JSONContent {
    return {
      type: "image",
      attrs: { src, alt, class: "letterhead-logo" },
    };
  }
  return [
    {
      type: "table",
      attrs: { class: "letterhead-header" },
      content: [
        {
          type: "tableRow",
          content: [
            {
              type: "tableCell",
              attrs: { class: "letterhead-logo-cell" },
              content: [
                imageParagraph(logo, info.name),
                paragraph(info.name, "center", "18px", true),
              ],
            },
            {
              type: "tableCell",
              attrs: { class: "letterhead-company-cell" },
              content: [
                {
                  type: "heading",
                  attrs: { level: 5, textAlign: "center" },
                  content: [
                    {
                      type: "text",
                      text: info.perusahaan,
                      marks: [
                        {
                          type: "textStyle",
                          attrs: { fontSize: "20px", color: "#2563eb" },
                        },
                        { type: "bold" },
                      ],
                    },
                  ],
                },
                paragraph(info.address, "center", "13px"),
              ],
            },
          ],
        },
      ],
    },
    {
      type: "horizontalRule",
      attrs: { thickness: "thick", color: "#000000" },
    },
    {
      type: "horizontalRule",
      attrs: { thickness: "thin", color: "#000000" },
    },
    paragraph(`Jakarta, ${tanggal}`, "right"),
    {
      type: "table",
      attrs: { class: "letterhead-info" },
      content: [infoRow("Lampiran", ""), infoRow("Perihal", "")],
    },
    paragraph(""),
    paragraph("Kepada Yth."),
    paragraph("Nama / Jabatan Penerima"),
    paragraph("di Tempat"),
    paragraph(""),
    paragraph("Dengan hormat,"),
    paragraph(""),
  ];
}
