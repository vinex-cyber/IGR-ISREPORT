import * as React from "react"

import { cn } from "@/lib/utils"
import type { SlashCommandItem } from "./items"

export interface SlashCommandListHandle {
  onKeyDown: (event: KeyboardEvent) => boolean
}

interface SlashCommandListProps {
  items: SlashCommandItem[]
  command: (item: SlashCommandItem) => void
}

export const SlashCommandList = React.forwardRef<SlashCommandListHandle, SlashCommandListProps>(
  function SlashCommandList({ items, command }, ref) {
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const containerRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(function resetSelection() {
      setSelectedIndex(0)
    }, [items])

    React.useEffect(function scrollIntoView() {
      const container = containerRef.current
      if (!container) return
      const active = container.querySelector<HTMLElement>("[data-active='true']")
      active?.scrollIntoView({ block: "nearest" })
    }, [selectedIndex])

    function selectItem(index: number) {
      const item = items[index]
      if (item) command(item)
    }

    React.useImperativeHandle(ref, function buildHandle() {
      return {
        onKeyDown(event: KeyboardEvent) {
          if (items.length === 0) return false
          if (event.key === "ArrowUp") {
            setSelectedIndex(function prev(i) {
              return (i + items.length - 1) % items.length
            })
            return true
          }
          if (event.key === "ArrowDown") {
            setSelectedIndex(function prev(i) {
              return (i + 1) % items.length
            })
            return true
          }
          if (event.key === "Enter") {
            selectItem(selectedIndex)
            return true
          }
          return false
        },
      }
    })

    if (items.length === 0) {
      return (
        <div className="w-64 rounded-md border border-input bg-popover p-2 text-sm text-muted-foreground shadow-md">
          Tidak ada hasil
        </div>
      )
    }

    return (
      <div
        ref={containerRef}
        className="max-h-72 w-64 overflow-y-auto rounded-md border border-input bg-popover p-1 shadow-md"
      >
        {items.map(function renderItem(item, index) {
          const Icon = item.icon
          const active = index === selectedIndex
          return (
            <button
              key={item.title}
              type="button"
              data-active={active}
              className={cn(
                "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm transition-colors",
                active ? "bg-accent text-accent-foreground" : "text-popover-foreground"
              )}
              onMouseEnter={function setHover() {
                setSelectedIndex(index)
              }}
              onClick={function handleClick() {
                selectItem(index)
              }}
            >
              <Icon className="size-4 shrink-0" />
              <span className="flex flex-col">
                <span className="font-medium">{item.title}</span>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </span>
            </button>
          )
        })}
      </div>
    )
  }
)
