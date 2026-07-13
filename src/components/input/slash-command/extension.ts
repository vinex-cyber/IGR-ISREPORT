import { Extension, type Editor, type Range } from "@tiptap/core";
import Suggestion, { type SuggestionOptions } from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";

import {
  SlashCommandList,
  type SlashCommandListHandle,
} from "./SlashCommandList";
import { slashCommandItems, type SlashCommandItem } from "./items";

export const SlashCommand = Extension.create({
  name: "slashCommand",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: function runCommand({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: SlashCommandItem;
        }) {
          props.command({ editor, range });
        },
      } as Partial<SuggestionOptions<SlashCommandItem>>,
      onRequestPlu: undefined as
        | ((ctx: { editor: Editor; range: Range }) => void)
        | undefined,
    };
  },

  addProseMirrorPlugins() {
    const onRequestPlu = this.options.onRequestPlu;
    return [
      Suggestion<SlashCommandItem>({
        editor: this.editor,
        char: this.options.suggestion.char,
        command: function runCommand({ editor, range, props }) {
          if (props.openModal === "plu") {
            onRequestPlu?.({ editor, range });
            return;
          }
          props.command({ editor, range });
        },
        items: function filterItems({ query }) {
          const q = query.toLowerCase();
          return slashCommandItems.filter(function match(item) {
            return (
              item.title.toLowerCase().includes(q) ||
              item.searchTerms.some(function matchTerm(term) {
                return term.includes(q);
              })
            );
          });
        },
        render: function renderPopup() {
          let component: ReactRenderer<
            SlashCommandListHandle,
            {
              items: SlashCommandItem[];
              command: (item: SlashCommandItem) => void;
            }
          >;
          let popup: HTMLDivElement | null = null;
          let anchorEl: HTMLElement | null = null;

          function getAnchorRect(): DOMRect | null {
            return anchorEl?.getBoundingClientRect() ?? null;
          }

          function updatePosition() {
            if (!popup) return;
            const rect = getAnchorRect();
            if (!rect) return;
            const menuHeight = popup.offsetHeight || 320;
            const margin = 6;
            const spaceBelow = window.innerHeight - rect.bottom;
            const placeAbove =
              spaceBelow < menuHeight + margin && rect.top > spaceBelow;
            if (placeAbove) {
              const top = Math.max(margin, rect.top - menuHeight - margin);
              popup.style.top = `${top}px`;
            } else {
              popup.style.top = `${rect.bottom + margin}px`;
            }
            popup.style.left = `${rect.left}px`;
          }

          function handleScroll() {
            updatePosition();
          }

          return {
            onStart: function onStart(props) {
              component = new ReactRenderer(SlashCommandList, {
                props,
                editor: props.editor,
              });
              anchorEl = (props.decorationNode as HTMLElement) ?? null;
              popup = document.createElement("div");
              popup.style.position = "fixed";
              popup.style.zIndex = "9999";
              popup.appendChild(component.element);
              document.body.appendChild(popup);
              updatePosition();
              requestAnimationFrame(updatePosition);
              window.addEventListener("scroll", handleScroll, true);
            },
            onUpdate: function onUpdate(props) {
              component.updateProps(props);
              anchorEl = (props.decorationNode as HTMLElement) ?? anchorEl;
              updatePosition();
              requestAnimationFrame(updatePosition);
            },
            onKeyDown: function onKeyDown(props) {
              if (props.event.key === "Escape") {
                popup?.remove();
                return true;
              }
              return component.ref?.onKeyDown(props.event) ?? false;
            },
            onExit: function onExit() {
              window.removeEventListener("scroll", handleScroll, true);
              popup?.remove();
              popup = null;
              component.destroy();
            },
          };
        },
      }),
    ];
  },
});
