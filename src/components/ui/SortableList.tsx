"use client"

import { type ReactNode, useState, useCallback, useRef } from "react"

interface SortableItem {
  id: string
}

interface DragHandleProps {
  draggable: boolean
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: (e: React.DragEvent) => void
  "aria-roledescription": string
  style: { cursor: string }
}

interface SortableListProps<T extends SortableItem> {
  items: T[]
  onReorder: (items: T[]) => void
  renderItem: (item: T, index: number, dragHandleProps: DragHandleProps) => ReactNode
  handle?: boolean
  className?: string
}

function SortableListInner<T extends SortableItem>(
  props: SortableListProps<T>
): React.ReactElement {
  const { items, onReorder, renderItem, handle = false, className = "" } = props

  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  const getDropPosition = useCallback(
    (e: React.DragEvent, hoveredIndex: number): number => {
      const el = itemRefs.current.get(hoveredIndex)
      if (!el) return hoveredIndex

      const rect = el.getBoundingClientRect()
      const midpoint = rect.top + rect.height / 2

      if (e.clientY < midpoint) {
        return hoveredIndex
      }
      return hoveredIndex + 1
    },
    []
  )

  const handleDragStart = useCallback(
    (index: number, e: React.DragEvent): void => {
      e.dataTransfer.setData("text/plain", String(index))
      e.dataTransfer.effectAllowed = "move"
      setDragIndex(index)
    },
    []
  )

  const handleDragOver = useCallback(
    (index: number, e: React.DragEvent): void => {
      e.preventDefault()
      e.dataTransfer.dropEffect = "move"
      const position = getDropPosition(e, index)
      setOverIndex(position)
    },
    [getDropPosition]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent): void => {
      e.preventDefault()
      const fromIndex = dragIndex
      const toIndex = overIndex

      if (fromIndex === null || toIndex === null) {
        setDragIndex(null)
        setOverIndex(null)
        return
      }

      const newItems = [...items]
      const [movedItem] = newItems.splice(fromIndex, 1)

      const adjustedIndex = toIndex > fromIndex ? toIndex - 1 : toIndex
      newItems.splice(adjustedIndex, 0, movedItem)

      setDragIndex(null)
      setOverIndex(null)
      onReorder(newItems)
    },
    [dragIndex, overIndex, items, onReorder]
  )

  const handleDragEnd = useCallback((): void => {
    setDragIndex(null)
    setOverIndex(null)
  }, [])

  const setItemRef = useCallback(
    (index: number, el: HTMLDivElement | null): void => {
      if (el) {
        itemRefs.current.set(index, el)
      } else {
        itemRefs.current.delete(index)
      }
    },
    []
  )

  const dropIndicator = (
    <div className="h-0.5 bg-indigo-500/50 dark:bg-indigo-400/50 rounded-full mx-2 my-0.5" />
  )

  return (
    <div
      className={[
        "rounded-2xl backdrop-blur-2xl bg-linear-to-br from-white/70 via-white/50 to-white/30 dark:from-white/10 dark:via-white/6 dark:to-white/3 border border-white/60 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/30 p-2 space-y-1",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {items.map((item, index) => {
        const isDragging = dragIndex === index

        const dragHandleProps: DragHandleProps = {
          draggable: true,
          onDragStart: (e: React.DragEvent) => handleDragStart(index, e),
          onDragEnd: handleDragEnd,
          "aria-roledescription": "sortable",
          style: { cursor: "grab" },
        }

        const rowDragProps = handle
          ? {}
          : {
              draggable: true,
              onDragStart: (e: React.DragEvent) => handleDragStart(index, e),
              onDragEnd: handleDragEnd,
              style: { cursor: "grab" } as React.CSSProperties,
            }

        return (
          <div key={item.id}>
            {overIndex === index && dragIndex !== null && dragIndex !== index && dropIndicator}
            <div
              ref={(el) => setItemRef(index, el)}
              onDragOver={(e: React.DragEvent) => handleDragOver(index, e)}
              onDrop={handleDrop}
              className={[
                "rounded-xl bg-white/30 dark:bg-white/5 border border-white/40 dark:border-white/8 transition-all duration-200",
                isDragging ? "opacity-50 scale-[0.98]" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              {...rowDragProps}
            >
              {renderItem(item, index, dragHandleProps)}
            </div>
            {overIndex === index + 1 &&
              dragIndex !== null &&
              dragIndex !== index + 1 &&
              index === items.length - 1 &&
              dropIndicator}
          </div>
        )
      })}
    </div>
  )
}

export const SortableList = SortableListInner as <T extends SortableItem>(
  props: SortableListProps<T>
) => React.ReactElement

export type { SortableItem, SortableListProps, DragHandleProps }
