import dynamic from "next/dynamic"
import type { JSONContent } from "@tiptap/react"

import type { EditorTiptapProps } from "./EditorTiptap"

const EditorTiptapDynamic = dynamic<EditorTiptapProps>(
  function loadEditorTiptap() {
    return import("./EditorTiptap").then(function resolve(mod) {
      return mod.EditorTiptap
    })
  },
  { ssr: false, loading: function renderLoading() {
      return (
        <div className="h-40 w-full animate-pulse rounded-md border border-input bg-muted/40" />
      )
    } }
)

export { EditorTiptapDynamic as EditorTiptap, type EditorTiptapProps }
export type { JSONContent }
