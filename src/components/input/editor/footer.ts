// src/components/input/editor/footer.ts
import type { JSONContent } from "@tiptap/react";
import { buildLetterheadParagraph as paragraph } from "./letterheadHelpers";

const FOOTER_FONT_SIZE = "14.7px";

export function buildFooterContent(): JSONContent[] {
  return [
    paragraph("", "left", FOOTER_FONT_SIZE),
    paragraph("Catatan :", "left", FOOTER_FONT_SIZE, true),
    paragraph(
      "Harga yang tercantum dalam surat penawaran ini sudah termasuk Pajak Pertambahan Nilai (PPN) 11%, berlaku pada tanggal surat ini diterbitkan",
      "justify",
      FOOTER_FONT_SIZE,
    ),
    paragraph("", "left", FOOTER_FONT_SIZE),
    paragraph(
      "Demikian surat penawaran ini kami sampaikan. Atas perhatian dan kerja sama Bapak/Ibu, kami ucapkan terima kasih.",
      "justify",
      FOOTER_FONT_SIZE,
    ),
    paragraph("", "left", FOOTER_FONT_SIZE),
    {
      type: "table",
      attrs: { class: "letterhead-signature", align: "right" },
      content: [
        {
          type: "tableRow",
          content: [
            { type: "tableCell", content: [paragraph("")] },
            {
              type: "tableCell",
              content: [
                paragraph("Hormat kami,", "center", FOOTER_FONT_SIZE),
                paragraph("", "left", FOOTER_FONT_SIZE),
                paragraph("", "left", FOOTER_FONT_SIZE),
                paragraph("", "left", FOOTER_FONT_SIZE),
                paragraph("(Nama PIC)", "center", FOOTER_FONT_SIZE, true),
              ],
            },
          ],
        },
      ],
    },
  ];
}
