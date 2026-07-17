// src/components/input/EditorTiptap.tsx
import * as React from "react";
import type { Editor, Range } from "@tiptap/core";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";

const ImageWithClass = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => {
          if (!attributes.class) {
            return {};
          }
          return { class: attributes.class };
        },
      },
    };
  },
});
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle, FontSize, Color } from "@tiptap/extension-text-style";
import { Selection } from "@tiptap/extensions";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SlashCommand } from "./slash-command/extension";
import { PluTableRow, TableRowResize } from "./tableRowResize";
import { GenericLookupModal } from "@/components/modal/GenericLookupModal";
import Modal from "@/components/modal";
import {
  daftarProdukColumns,
  type DaftarProdukRows,
} from "@/configs/input/daftar-produkConfig";

import { ThickHorizontalRule } from "./editor/extensions/horizontalRule";
import { PluTable, findPluTable } from "./editor/extensions/pluTable";
import { PluTableCell, PluTableHeader } from "./editor/extensions/pluTableCell";
import { PluCodeBlock } from "./editor/extensions/codeBlockLowlight";
import {
  createPluTable,
  addPluToExistingTable,
} from "./editor/plu/pluTableBuilder";
import { PluDescriptionModal } from "./editor/PluDescriptionModal";
import { EditorToolbar } from "./editor/toolbar/EditorToolbar";
import { EditorBubbleMenu } from "./editor/toolbar/EditorBubbleMenu";
import { PromoInfoModal } from "./editor/PromoInfoModal";

export interface EditorTiptapProps {
  value?: JSONContent | null;
  onChange?: (json: JSONContent) => void;
  editable?: boolean;
  className?: string;
  toolbarOffset?: number;
  contentMaxHeight?: number | string;
  branch?: string;
}

export function EditorTiptap({
  value,
  onChange,
  editable = true,
  className,
  toolbarOffset = 0,
  contentMaxHeight = "60vh",
  branch,
}: EditorTiptapProps) {
  const [pluRequest, setPluRequest] = React.useState<{
    editor: Editor;
  } | null>(null);

  const [pluRelated, setPluRelated] = React.useState<{
    editor: Editor;
    prdcd: string;
  } | null>(null);

  const [pluChoice, setPluChoice] = React.useState<{
    editor: Editor;
    row: DaftarProdukRows;
  } | null>(null);

  const [pluDescription, setPluDescription] = React.useState<{
    editor: Editor;
    row: DaftarProdukRows;
  } | null>(null);

  const [promoInfo, setPromoInfo] = React.useState<{ prdcd: string } | null>(
    null,
  );

  const handleRequestPlu = React.useCallback(function openPlu(ctx: {
    editor: Editor;
    range: Range;
  }) {
    ctx.editor.chain().focus().deleteRange(ctx.range).run();
    setPluRequest({ editor: ctx.editor });
  }, []);

  const handleSelectFinalPlu = React.useCallback(function selectFinalPlu(
    editor: Editor,
    row: DaftarProdukRows,
  ) {
    const existing = findPluTable(editor);
    if (existing) {
      setPluChoice({ editor, row });
    } else {
      setPluDescription({ editor, row });
    }
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ horizontalRule: false, codeBlock: false }),
      ThickHorizontalRule,
      ImageWithClass,
      Selection,
      TextStyle,
      FontSize,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph", "tableCell", "tableHeader"],
      }),
      TableKit.configure({
        table: false,
        tableRow: false,
        tableCell: false,
        tableHeader: false,
      }),
      PluTableRow,
      TableRowResize,
      PluTableCell,
      PluTableHeader,
      PluTable.configure({ resizable: true }),
      PluCodeBlock,
      SlashCommand.configure({ onRequestPlu: handleRequestPlu }),
    ],
    content: value ?? undefined,
    editable,
    immediatelyRender: false,
    onUpdate: function handleUpdate({ editor }) {
      onChange?.(editor.getJSON());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      <EditorToolbar
        editor={editor}
        toolbarOffset={toolbarOffset}
        branch={branch}
        onRequestPlu={function openPluFromToolbar() {
          setPluRequest({ editor });
        }}
      />
      <EditorBubbleMenu editor={editor} />
      <div
        style={{ maxHeight: contentMaxHeight }}
        className="overflow-y-auto rounded-md border border-input bg-background">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none p-3 focus:outline-none"
        />
      </div>

      {pluRequest && (
        <GenericLookupModal<DaftarProdukRows>
          show={true}
          title="Pilih Produk"
          endpoint="/api/daftar-produk"
          columns={daftarProdukColumns}
          onClose={function closePluModal() {
            setPluRequest(null);
          }}
          onSelect={function selectPlu(row) {
            const editor = pluRequest.editor;
            setPluRequest(null);
            setPluRelated({ editor, prdcd: String(row.prd_prdcd) });
          }}
          infoAction={{
            label: "Info",
            onInfo: function openPromoInfo(row) {
              setPromoInfo({ prdcd: String(row.prd_prdcd) });
            },
          }}
        />
      )}

      {pluRelated && (
        <GenericLookupModal<DaftarProdukRows>
          show={true}
          title={`Pilih PLU Terkait (${pluRelated.prdcd})`}
          endpoint={`/api/daftar-produk-terkait?prdcd=${encodeURIComponent(
            pluRelated.prdcd,
          )}`}
          columns={daftarProdukColumns}
          onClose={function closeRelatedModal() {
            setPluRelated(null);
          }}
          onSelect={function selectRelatedPlu(row) {
            const editor = pluRelated.editor;
            setPluRelated(null);
            handleSelectFinalPlu(editor, row);
          }}
          infoAction={{
            label: "Info",
            onInfo: function openPromoInfo(row) {
              setPromoInfo({ prdcd: String(row.prd_prdcd) });
            },
          }}
        />
      )}

      {pluDescription && (
        <PluDescriptionModal
          onCancel={function cancelDescription() {
            setPluDescription(null);
          }}
          onConfirm={function confirmDescription(description) {
            createPluTable(
              pluDescription.editor,
              pluDescription.row,
              description.trim(),
            );
            setPluDescription(null);
          }}
        />
      )}

      {pluChoice && (
        <Modal
          show={true}
          zIndex={60}
          onClose={function cancelChoice() {
            setPluChoice(null);
          }}>
          <div className="w-72 space-y-3 p-1">
            <h2 className="text-base font-semibold">Tambahkan PLU ke tabel?</h2>
            <p className="text-sm text-muted-foreground">
              Sudah ada tabel PLU. Pilih salah satu:
            </p>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                onClick={function addToExisting() {
                  addPluToExistingTable(pluChoice.editor, pluChoice.row);
                  setPluChoice(null);
                }}>
                Tambah ke tabel yang ada
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={function makeNew() {
                  setPluDescription({
                    editor: pluChoice.editor,
                    row: pluChoice.row,
                  });
                  setPluChoice(null);
                }}>
                Buat tabel baru
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <PromoInfoModal
        show={!!promoInfo}
        prdcd={promoInfo?.prdcd ?? null}
        onClose={function closePromoInfo() {
          setPromoInfo(null);
        }}
      />
    </div>
  );
}
