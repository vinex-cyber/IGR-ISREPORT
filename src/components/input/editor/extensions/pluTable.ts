// src/components/input/editor/extensions/pluTable.ts
import type { Editor } from "@tiptap/core";
import type { Node as PMNode } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";
import { Table } from "@tiptap/extension-table";

function marginForAlign(align: unknown): { left: string; right: string } {
  if (align === "center") return { left: "auto", right: "auto" };
  if (align === "right") return { left: "auto", right: "0" };
  return { left: "0", right: "auto" };
}

const tableAlignPluginKey = new PluginKey("pluTableAlign");

export const PluTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute("class"),
        renderHTML: (attributes: Record<string, unknown>) => {
          if (!attributes.class) return {};
          return { class: attributes.class as string };
        },
      },
      align: {
        default: null,
        parseHTML: (element: HTMLElement) =>
          element.getAttribute("data-align") ?? null,
        renderHTML: (attributes: Record<string, unknown>) => {
          const { left, right } = marginForAlign(attributes.align);
          return {
            "data-align": (attributes.align as string) ?? "center",
            style: `margin-left: ${left}; margin-right: ${right};`,
          };
        },
      },
    };
  },

  addProseMirrorPlugins() {
    const parentPlugins = this.parent?.() ?? [];
    const syncPlugin = new Plugin({
      key: tableAlignPluginKey,
      view(initialView) {
        function syncTableAlign(view: EditorView) {
          view.state.doc.descendants(function applyAlign(node, pos) {
            if (node.type.name !== "table") return true;
            const dom = view.nodeDOM(pos);
            if (dom instanceof HTMLElement) {
              const table =
                dom.tagName === "TABLE"
                  ? dom
                  : dom.querySelector(":scope > table");
              if (table instanceof HTMLElement) {
                const { left, right } = marginForAlign(node.attrs.align);
                table.style.marginLeft = left;
                table.style.marginRight = right;
                const cls = node.attrs.class;
                if (typeof cls === "string" && cls) {
                  if (table.getAttribute("class") !== cls) {
                    table.setAttribute("class", cls);
                  }
                } else if (table.hasAttribute("class")) {
                  table.removeAttribute("class");
                }
              }
            }
            return false;
          });
        }
        syncTableAlign(initialView);
        return {
          update: syncTableAlign,
        };
      },
    });
    return [...parentPlugins, syncPlugin];
  },
});

export function findPluTable(
  editor: Editor,
): { node: PMNode; pos: number } | null {
  const selectionPos = editor.state.selection.from;
  let best: { node: PMNode; pos: number } | null = null;
  let bestDistance = Infinity;
  editor.state.doc.descendants(function traverse(node, pos) {
    if (node.type.name === "table" && node.attrs.class === "plu-table") {
      const start = pos;
      const end = pos + node.nodeSize;
      let distance: number;
      if (selectionPos >= start && selectionPos <= end) {
        distance = 0;
      } else if (selectionPos < start) {
        distance = start - selectionPos;
      } else {
        distance = selectionPos - end;
      }
      if (distance < bestDistance) {
        bestDistance = distance;
        best = { node, pos };
      }
    }
    return true;
  });
  return best;
}

export function getTableAlign(editor: Editor): string | null {
  const { $from } = editor.state.selection;
  for (let depth = $from.depth; depth > 0; depth--) {
    if ($from.node(depth).type.name === "table") {
      const node = editor.state.doc.nodeAt($from.before(depth));
      return (node?.attrs.align as string | null) ?? "left";
    }
  }
  return null;
}

export function applyTableAlign(
  editor: Editor,
  align: "left" | "center" | "right",
): void {
  editor
    .chain()
    .focus()
    .command(function setTableAlignCommand({ state, dispatch }) {
      const { $from } = state.selection;
      for (let depth = $from.depth; depth > 0; depth--) {
        if ($from.node(depth).type.name === "table") {
          const pos = $from.before(depth);
          const node = state.doc.nodeAt(pos);
          if (!node) return false;
          if (dispatch) {
            dispatch(
              state.tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                align,
              }),
            );
          }
          return true;
        }
      }
      return false;
    })
    .run();
}
