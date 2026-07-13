import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import { TableRow } from "@tiptap/extension-table"

export const PluTableRow = TableRow.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      height: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          const style = element.getAttribute("style") ?? ""
          const match = /height:\s*(\d+)px/.exec(style)
          return match ? Number(match[1]) : null
        },
        renderHTML: (attributes: Record<string, unknown>) => {
          const height = attributes.height
          if (height == null) return {}
          return { style: `height: ${height}px` }
        },
      },
    }
  },
})

function getRowPos(view: import("@tiptap/pm/view").EditorView, cell: HTMLElement): number | null {
  const pos = view.posAtDOM(cell, 0)
  const doc = view.state.doc
  if (pos < 0 || pos > doc.content.size) return null
  const $pos = doc.resolve(pos)
  for (let depth = $pos.depth; depth > 0; depth--) {
    if ($pos.node(depth).type.name === "tableRow") {
      return $pos.before(depth)
    }
  }
  return null
}

function startRowResize(
  view: import("@tiptap/pm/view").EditorView,
  cell: HTMLElement,
  startY: number
) {
  const rowPos = getRowPos(view, cell)
  if (rowPos == null) return
  const initialNode = view.state.doc.nodeAt(rowPos)
  if (!initialNode) return
  const currentHeight =
    (initialNode.attrs.height as number | null) ?? cell.offsetHeight

  document.body.style.cursor = "row-resize"

  function onMove(event: MouseEvent) {
    const delta = event.clientY - startY
    const newHeight = Math.max(20, Math.round(currentHeight + delta))
    const node = view.state.doc.nodeAt(rowPos!)
    if (!node) return
    view.dispatch(
      view.state.tr.setNodeMarkup(rowPos!, undefined, {
        ...node.attrs,
        height: newHeight,
      })
    )
  }

  function onUp() {
    document.removeEventListener("mousemove", onMove)
    document.removeEventListener("mouseup", onUp)
    document.body.style.cursor = ""
  }

  document.addEventListener("mousemove", onMove)
  document.addEventListener("mouseup", onUp)
}

export const TableRowResize = Extension.create({
  name: "tableRowResize",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("tableRowResize"),
        props: {
          handleDOMEvents: {
            mousedown(view, event) {
              const target = event.target as HTMLElement
              const cell = target.closest("td, th") as HTMLElement | null
              if (!cell) return false
              const rect = cell.getBoundingClientRect()
              const nearBottom =
                event.clientY >= rect.bottom - 6 && event.clientY <= rect.bottom + 4
              if (!nearBottom) return false
              startRowResize(view, cell, event.clientY)
              event.preventDefault()
              return true
            },
          },
        },
      }),
    ]
  },
})
