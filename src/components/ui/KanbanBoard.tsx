"use client";

import { useState, useCallback, useRef, type ReactNode, type DragEvent } from "react";
import { GripVertical } from "lucide-react";

interface KanbanItem {
  id: string;
  title: string;
  [key: string]: unknown;
}

interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanItem[];
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onMove?: (itemId: string, fromColumnId: string, toColumnId: string, newIndex: number) => void;
  renderCard?: (item: KanbanItem, columnId: string) => ReactNode;
  className?: string;
}

interface DragState {
  itemId: string;
  fromColumnId: string;
}

function calculateDropIndex(
  e: DragEvent<HTMLDivElement>,
  columnBodyRef: HTMLDivElement | null
): number {
  if (!columnBodyRef) return 0;

  const cards = Array.from(
    columnBodyRef.querySelectorAll<HTMLElement>("[data-kanban-card]")
  );

  if (cards.length === 0) return 0;

  for (let i = 0; i < cards.length; i++) {
    const rect = cards[i].getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    if (e.clientY < midY) {
      return i;
    }
  }

  return cards.length;
}

function DefaultCard({ item }: { item: KanbanItem }): React.ReactElement {
  return (
    <div className="flex items-start gap-2">
      <GripVertical className="size-4 shrink-0 mt-0.5 text-(--text-muted) opacity-50" />
      <span className="min-w-0 break-words">{item.title}</span>
    </div>
  );
}

function KanbanColumnComponent({
  column,
  dragState,
  overColumnId,
  overIndex,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  renderCard,
}: {
  column: KanbanColumn;
  dragState: DragState | null;
  overColumnId: string | null;
  overIndex: number | null;
  onDragStart: (e: DragEvent<HTMLDivElement>, itemId: string, columnId: string) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>, columnId: string, bodyRef: HTMLDivElement | null) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>, columnId: string) => void;
  onDrop: (e: DragEvent<HTMLDivElement>, columnId: string, bodyRef: HTMLDivElement | null) => void;
  onDragEnd: () => void;
  renderCard?: (item: KanbanItem, columnId: string) => ReactNode;
}): React.ReactElement {
  const bodyRef = useRef<HTMLDivElement>(null);

  const isOver = overColumnId === column.id && dragState !== null;
  const isDraggedFromThis = dragState?.fromColumnId === column.id;

  const visibleItems = column.items.filter((item) => {
    if (dragState && dragState.itemId === item.id && isDraggedFromThis) {
      return true;
    }
    return true;
  });

  return (
    <div
      className={`w-72 shrink-0 flex flex-col rounded-xl bg-glass/20 dark:bg-glass/3 border border-glass/30 dark:border-glass/6 transition-all duration-200 ${
        isOver ? "ring-2 ring-primary-400/20" : ""
      }`}
    >
      <div className="px-3 py-2.5 text-sm font-semibold text-(--text) border-b border-glass/30 dark:border-glass/6 flex items-center justify-between">
        <span>{column.title}</span>
        <span className="text-xs px-1.5 py-0.5 rounded-md bg-glass/40 dark:bg-glass/8 text-(--text-muted)">
          {column.items.length}
        </span>
      </div>

      <div
        ref={bodyRef}
        className="flex-1 p-2 space-y-2 min-h-24"
        onDragOver={(e) => onDragOver(e, column.id, bodyRef.current)}
        onDragLeave={(e) => onDragLeave(e, column.id)}
        onDrop={(e) => onDrop(e, column.id, bodyRef.current)}
      >
        {visibleItems.length === 0 && !isOver ? (
          <div className="flex items-center justify-center min-h-24 rounded-xl border-2 border-dashed border-glass/30 dark:border-glass/8 text-sm text-(--text-muted)">
            Hierhin ziehen
          </div>
        ) : (
          visibleItems.map((item, index) => {
            const isDragged = dragState?.itemId === item.id;
            const showIndicatorBefore =
              isOver && overIndex !== null && overIndex === index;

            return (
              <div key={item.id}>
                {showIndicatorBefore && (
                  <div className="h-0.5 bg-primary-500/50 dark:bg-primary-400/50 rounded-full mx-2 mb-2" />
                )}
                <div
                  data-kanban-card
                  draggable
                  onDragStart={(e) => onDragStart(e, item.id, column.id)}
                  onDragEnd={onDragEnd}
                  className={`rounded-xl p-3 backdrop-blur-sm bg-glass/40 dark:bg-glass/5 border border-glass/50 dark:border-glass/8 shadow-sm text-sm text-(--text) cursor-grab active:cursor-grabbing transition-all duration-200 ${
                    isDragged ? "opacity-50 scale-[0.97]" : ""
                  }`}
                >
                  {renderCard ? renderCard(item, column.id) : <DefaultCard item={item} />}
                </div>
              </div>
            );
          })
        )}
        {isOver &&
          overIndex !== null &&
          overIndex >= visibleItems.length &&
          visibleItems.length > 0 && (
            <div className="h-0.5 bg-primary-500/50 dark:bg-primary-400/50 rounded-full mx-2" />
          )}
        {isOver && visibleItems.length === 0 && (
          <div className="flex items-center justify-center min-h-24 rounded-xl border-2 border-dashed border-primary-400/30 dark:border-primary-400/20 text-sm text-(--text-muted)">
            Hierhin ziehen
          </div>
        )}
      </div>
    </div>
  );
}

function KanbanBoard({
  columns,
  onMove,
  renderCard,
  className = "",
}: KanbanBoardProps): React.ReactElement {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback(
    (e: DragEvent<HTMLDivElement>, itemId: string, fromColumnId: string): void => {
      e.dataTransfer.setData("text/plain", JSON.stringify({ itemId, fromColumnId }));
      e.dataTransfer.effectAllowed = "move";
      setDragState({ itemId, fromColumnId });
    },
    []
  );

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>, columnId: string, bodyRef: HTMLDivElement | null): void => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setOverColumnId(columnId);
      const index = calculateDropIndex(e, bodyRef);
      setOverIndex(index);
    },
    []
  );

  const handleDragLeave = useCallback(
    (e: DragEvent<HTMLDivElement>, columnId: string): void => {
      const relatedTarget = e.relatedTarget as HTMLElement | null;
      const currentTarget = e.currentTarget as HTMLElement;

      if (relatedTarget && currentTarget.contains(relatedTarget)) {
        return;
      }

      if (overColumnId === columnId) {
        setOverColumnId(null);
        setOverIndex(null);
      }
    },
    [overColumnId]
  );

  const resetDragState = useCallback((): void => {
    setDragState(null);
    setOverColumnId(null);
    setOverIndex(null);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>, columnId: string, bodyRef: HTMLDivElement | null): void => {
      e.preventDefault();

      let itemId: string;
      let fromColumnId: string;

      if (dragState) {
        itemId = dragState.itemId;
        fromColumnId = dragState.fromColumnId;
      } else {
        try {
          const data = JSON.parse(e.dataTransfer.getData("text/plain")) as {
            itemId: string;
            fromColumnId: string;
          };
          itemId = data.itemId;
          fromColumnId = data.fromColumnId;
        } catch {
          resetDragState();
          return;
        }
      }

      const dropIndex = calculateDropIndex(e, bodyRef);

      if (onMove) {
        onMove(itemId, fromColumnId, columnId, dropIndex);
      }

      resetDragState();
    },
    [dragState, onMove, resetDragState]
  );

  const handleDragEnd = useCallback((): void => {
    resetDragState();
  }, [resetDragState]);

  return (
    <div
      className={`rounded-2xl backdrop-blur-2xl bg-linear-to-br from-glass/70 via-glass/50 to-glass/30 dark:from-glass/10 dark:via-glass/6 dark:to-glass/3 border border-glass/60 dark:border-glass/10 shadow-xl shadow-black/5 dark:shadow-black/30 p-4 ${className}`}
    >
      <div className="flex overflow-x-auto glass-scroll-x gap-4 p-4">
        {columns.map((column) => (
          <KanbanColumnComponent
            key={column.id}
            column={column}
            dragState={dragState}
            overColumnId={overColumnId}
            overIndex={overIndex}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            renderCard={renderCard}
          />
        ))}
      </div>
    </div>
  );
}

export { KanbanBoard };
export type { KanbanItem, KanbanColumn, KanbanBoardProps };
