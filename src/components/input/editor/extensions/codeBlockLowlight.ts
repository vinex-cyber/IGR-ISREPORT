// src/components/input/editor/extensions/codeBlockLowlight.ts
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";

const lowlight = createLowlight(common);

export { lowlight };

export const PluCodeBlock = CodeBlockLowlight.configure({
  lowlight,
  defaultLanguage: "plaintext",
  HTMLAttributes: {
    class: "plu-code-block",
  },
});
