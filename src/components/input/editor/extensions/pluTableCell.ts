// src/components/input/editor/extensions/pluTableCell.ts
import { TableCell } from "@tiptap/extension-table/cell";
import { TableHeader } from "@tiptap/extension-table/header";

const backgroundAttribute = {
  backgroundColor: {
    default: null as string | null,
    parseHTML: (element: HTMLElement) =>
      element.getAttribute("data-background-color") ??
      element.style.backgroundColor ??
      null,
    renderHTML: (attributes: Record<string, unknown>) => {
      const color = attributes.backgroundColor;
      if (!color) return {};
      return { style: `background-color: ${color as string};` };
    },
  },
};

export const PluTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...backgroundAttribute,
    };
  },
});

export const PluTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...backgroundAttribute,
    };
  },
});
