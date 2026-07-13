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
              content: [{ type: "image", attrs: { src: logo, alt: info.name } }],
            },
            {
              type: "tableCell",
              content: [
                {
                  type: "heading",
                  attrs: { level: 5, textAlign: "left" },
                  content: [
                    {
                      type: "text",
                      text: info.name,
                      marks: [
                        {
                          type: "textStyle",
                          attrs: { fontSize: "24px", color: "#2563eb" },
                        },
                        { type: "bold" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    paragraph(info.address, "left", "16px"),
    {
      type: "horizontalRule",
      attrs: { thickness: "medium", color: "#2563eb" },
    },
    paragraph(`Jakarta, ${tanggal}`, "right"),
    {
      type: "table",
      attrs: { class: "letterhead-info" },
      content: [
        infoRow("Lampiran", ""),
        infoRow("Perihal", "Penawaran Harga"),
      ],
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
