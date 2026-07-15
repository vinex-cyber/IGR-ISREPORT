// src/components/input/editor/letterhead.ts
import type { JSONContent } from "@tiptap/react";
import { FormatTanggal } from "@/utils/formatTanggal";
import { getLetterheadInfo } from "@/configs/input/letterheadConfig";
import { getBranchLogo } from "@/utils/getBranchTheme";
import { buildLetterheadParagraph as paragraph } from "./letterheadHelpers";

export function buildLetterheadContent(branch?: string): JSONContent[] {
  const tanggal = FormatTanggal(new Date());
  const info = getLetterheadInfo(branch);
  const logo = getBranchLogo(branch);
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
      content: [infoRow("Perihal", "Surat penawaran harga barang")],
    },
    paragraph(""),
    paragraph("Kepada Yth."),
    paragraph("Nama / Jabatan Penerima"),
    paragraph("di Tempat"),
    paragraph(""),
    paragraph(""),
    paragraph("Dengan hormat,"),
    paragraph(""),
    paragraph(
      "Berikut kami sampaikan penawaran harga barang sebagai berikut :",
    ),
  ];
}
