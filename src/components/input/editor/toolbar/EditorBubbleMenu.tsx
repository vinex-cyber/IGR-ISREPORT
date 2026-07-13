// src/components/input/editor/toolbar/EditorBubbleMenu.tsx
import * as React from "react";
import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  Bold,
  Italic,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

import { ToolbarButton } from "./ToolbarButton";
import {
  getCurrentBlockType,
  setBlockType,
  getCurrentFontSize,
} from "./blockHelpers";

export function EditorBubbleMenu({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: function selectBubbleState({ editor }) {
      return {
        blockType: getCurrentBlockType(editor),
        fontSize: getCurrentFontSize(editor),
        isBold: editor.isActive("bold"),
        isItalic: editor.isActive("italic"),
        isStrike: editor.isActive("strike"),
        alignLeft: editor.isActive({ textAlign: "left" }),
        alignCenter: editor.isActive({ textAlign: "center" }),
        alignRight: editor.isActive({ textAlign: "right" }),
      };
    },
  });

  return (
    <BubbleMenu
      editor={editor}
      updateDelay={80}
      shouldShow={function shouldShow({ editor, from, to }) {
        return editor.isEditable && from !== to && !editor.isActive("image");
      }}
      className="flex items-center gap-1 rounded-xl border border-input bg-background p-1 shadow-lg">
      <select
        aria-label="Jenis teks"
        className="h-8 rounded-md border border-input bg-background px-2 text-sm outline-none focus:ring-1 focus:ring-ring"
        value={state.blockType}
        onChange={function changeBlockType(e) {
          setBlockType(editor, e.target.value);
        }}>
        <option value="p">Paragraf</option>
        <option value="h1">Judul 1</option>
        <option value="h2">Judul 2</option>
        <option value="h3">Judul 3</option>
        <option value="h4">Judul 4</option>
        <option value="h5">Judul 5</option>
      </select>
      <input
        type="number"
        min={8}
        max={96}
        step={0.1}
        placeholder="Ukuran"
        aria-label="Ukuran font (px)"
        className="h-8 w-16 rounded-md border border-input bg-background px-2 text-sm outline-none focus:ring-1 focus:ring-ring"
        value={state.fontSize}
        onChange={function changeFontSize(e) {
          const val = e.target.value;
          if (!val) {
            editor.chain().unsetFontSize().run();
            return;
          }
          editor.chain().setFontSize(`${val}px`).run();
        }}
      />
      <div className="mx-0.5 h-5 w-px bg-border" />
      <ToolbarButton
        label="Tebal"
        active={state.isBold}
        onClick={function toggleBold() {
          editor.chain().focus().toggleBold().run();
        }}>
        <Bold />
      </ToolbarButton>
      <ToolbarButton
        label="Miring"
        active={state.isItalic}
        onClick={function toggleItalic() {
          editor.chain().focus().toggleItalic().run();
        }}>
        <Italic />
      </ToolbarButton>
      <ToolbarButton
        label="Coret"
        active={state.isStrike}
        onClick={function toggleStrike() {
          editor.chain().focus().toggleStrike().run();
        }}>
        <Strikethrough />
      </ToolbarButton>
      <div className="mx-0.5 h-5 w-px bg-border" />
      <ToolbarButton
        label="Rata kiri"
        active={state.alignLeft}
        onClick={function alignLeft() {
          editor.chain().focus().setTextAlign("left").run();
        }}>
        <AlignLeft />
      </ToolbarButton>
      <ToolbarButton
        label="Rata tengah"
        active={state.alignCenter}
        onClick={function alignCenter() {
          editor.chain().focus().setTextAlign("center").run();
        }}>
        <AlignCenter />
      </ToolbarButton>
      <ToolbarButton
        label="Rata kanan"
        active={state.alignRight}
        onClick={function alignRight() {
          editor.chain().focus().setTextAlign("right").run();
        }}>
        <AlignRight />
      </ToolbarButton>
    </BubbleMenu>
  );
}
