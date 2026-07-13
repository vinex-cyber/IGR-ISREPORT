// src/components/input/editor/toolbar/blockHelpers.ts
import type { Editor } from "@tiptap/core";

export const HEADING_LEVELS = [1, 2, 3, 4, 5] as const;

export function getCurrentBlockType(editor: Editor): string {
  for (const level of HEADING_LEVELS) {
    if (editor.isActive("heading", { level })) return `h${level}`;
  }
  return "p";
}

export function setBlockType(editor: Editor, value: string): void {
  if (value === "p") {
    editor.chain().focus().setParagraph().run();
    return;
  }
  const level = Number(
    value.replace("h", ""),
  ) as (typeof HEADING_LEVELS)[number];
  editor.chain().focus().setHeading({ level }).run();
}

export const DEFAULT_FONT_SIZE = "14.7";

export function getCurrentFontSize(editor: Editor): string {
  const size = editor.getAttributes("textStyle").fontSize;
  if (typeof size === "string") return size.replace("px", "");
  return DEFAULT_FONT_SIZE;
}
