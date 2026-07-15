// src/components/input/editor/letterheadHelpers.ts
import type { JSONContent } from "@tiptap/react";

export type TextAlign = "left" | "center" | "right" | "justify";

export function buildLetterheadParagraph(
  text: string,
  align?: TextAlign,
  fontSize = "14.7px",
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
            { type: "textStyle", attrs: { fontSize } },
            ...(bold ? [{ type: "bold" }] : []),
          ],
        });
    });
    node.content = content;
  }
  return node;
}
