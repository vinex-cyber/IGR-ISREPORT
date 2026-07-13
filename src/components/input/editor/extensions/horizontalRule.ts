// src/components/input/editor/extensions/horizontalRule.ts
import HorizontalRule from "@tiptap/extension-horizontal-rule";

export const HR_THICKNESS: Record<string, string> = {
  thin: "1px",
  medium: "2px",
  thick: "4px",
};

export const ThickHorizontalRule = HorizontalRule.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      thickness: {
        default: "medium",
        parseHTML: (element: HTMLElement) =>
          element.getAttribute("data-thickness") ?? "medium",
        renderHTML: (attributes: Record<string, unknown>) => {
          const key = (attributes.thickness as string) ?? "medium";
          const width = HR_THICKNESS[key] ?? HR_THICKNESS.medium;
          return {
            "data-thickness": key,
            style: `border-top-width: ${width};`,
          };
        },
      },
      color: {
        default: null,
        parseHTML: (element: HTMLElement) =>
          element.style.borderTopColor || null,
        renderHTML: (attributes: Record<string, unknown>) => {
          if (!attributes.color) return {};
          return { style: `border-top-color: ${attributes.color as string};` };
        },
      },
    };
  },
});
