"use client";

import { useState, useCallback, useMemo, type ReactNode } from "react";
import { Section, DemoRow } from "./Section";
import { ContextMenu, type ContextMenuItem } from "@/components/ui/ContextMenu";
import { SortableList, type SortableItem } from "@/components/ui/SortableList";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { KanbanBoard, type KanbanColumn } from "@/components/ui/KanbanBoard";
import { Calendar, type CalendarEvent } from "@/components/ui/Calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Copy, Trash2, Edit3, Share2, FolderPlus, Download, Star, GripVertical } from "lucide-react";

/* ── JSON Data Imports ── */
import contextMenuData from "@/data/context-menu.json";
import sortableTasksData from "@/data/sortable-tasks.json";
import multiselectData from "@/data/multiselect-options.json";
import kanbanData from "@/data/kanban-columns.json";
import calendarData from "@/data/calendar-events.json";

/* ── Icon Mapping (JSON → React) ── */

const iconMap: Record<string, ReactNode> = {
  Edit3: <Edit3 className="size-4" />,
  Copy: <Copy className="size-4" />,
  Share2: <Share2 className="size-4" />,
  Star: <Star className="size-4" />,
  Download: <Download className="size-4" />,
  Trash2: <Trash2 className="size-4" />,
};

interface RawMenuItem {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  separator?: boolean;
  disabled?: boolean;
  children?: RawMenuItem[];
}

function mapMenuItems(raw: RawMenuItem[]): ContextMenuItem[] {
  return raw.map((item) => ({
    ...item,
    icon: item.icon ? iconMap[item.icon] : undefined,
    children: item.children ? mapMenuItems(item.children) : undefined,
  }));
}

/* ── SortableList Types ── */

interface TaskItem extends SortableItem {
  title: string;
  priority: "high" | "medium" | "low";
}

/* ── Calendar Builder ── */

interface RawCalendarEvent {
  id: string;
  title: string;
  day?: number;
  endDay?: number;
  startTime?: string;
  endTime?: string;
  description?: string;
  color?: "default" | "success" | "warning" | "danger" | "info";
}

function buildCalendarEvents(): CalendarEvent[] {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const d = today.getDate();

  const fixed = (calendarData.fixed as RawCalendarEvent[]).map((evt) => ({
    id: evt.id,
    title: evt.title,
    date: new Date(y, m, evt.day!),
    endDate: evt.endDay ? new Date(y, m, evt.endDay) : undefined,
    startTime: evt.startTime,
    endTime: evt.endTime,
    description: evt.description,
    color: evt.color,
  }));

  const todayEvents = (calendarData.today as RawCalendarEvent[]).map((evt) => ({
    id: evt.id,
    title: evt.title,
    date: new Date(y, m, d),
    startTime: evt.startTime,
    endTime: evt.endTime,
    description: evt.description,
    color: evt.color,
  }));

  return [...fixed, ...todayEvents];
}

/* ── Component ── */

export function AdvancedComponentsDemo(): React.ReactElement {
  // ContextMenu
  const [lastAction, setLastAction] = useState<string>("");
  const contextMenuItems = useMemo(() => mapMenuItems(contextMenuData as RawMenuItem[]), []);

  // SortableList
  const initialTasks = sortableTasksData.tasks as TaskItem[];
  const priorityColors = sortableTasksData.priorityColors as Record<string, string>;
  const priorityLabels = sortableTasksData.priorityLabels as Record<string, string>;
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [tasksHandle, setTasksHandle] = useState<TaskItem[]>([...initialTasks]);

  // MultiSelect
  const [selectedLangs, setSelectedLangs] = useState<string[]>(["ts"]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // KanbanBoard
  const [kanbanColumns, setKanbanColumns] = useState<KanbanColumn[]>(kanbanData as KanbanColumn[]);

  const handleKanbanMove = useCallback(
    (itemId: string, fromColumnId: string, toColumnId: string, newIndex: number): void => {
      setKanbanColumns((prev) => {
        const next = prev.map((col) => ({ ...col, items: [...col.items] }));
        const fromCol = next.find((c) => c.id === fromColumnId);
        const toCol = next.find((c) => c.id === toColumnId);
        if (!fromCol || !toCol) return prev;

        const itemIndex = fromCol.items.findIndex((i) => i.id === itemId);
        if (itemIndex === -1) return prev;

        const [item] = fromCol.items.splice(itemIndex, 1);
        const adjustedIndex = fromColumnId === toColumnId && itemIndex < newIndex
          ? newIndex - 1
          : newIndex;
        toCol.items.splice(adjustedIndex, 0, item);
        return next;
      });
    },
    [],
  );

  // Calendar
  const calendarEvents = useMemo(() => buildCalendarEvents(), []);

  return (
    <>
      {/* ── ContextMenu ── */}
      <Section title="Context Menu">
        <DemoRow label="Rechtsklick auf die Karte">
          <ContextMenu
            items={contextMenuItems}
            onAction={(id) => setLastAction(id)}
            trigger={
              <Card className="p-6 select-none w-full max-w-sm">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-primary-500/10 dark:bg-primary-400/15 flex items-center justify-center text-primary-500 dark:text-primary-400">
                    <FolderPlus className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-(--text)">Projekt-Ordner</p>
                    <p className="text-xs text-(--text-muted)">Rechtsklick für Optionen</p>
                  </div>
                </div>
                {lastAction && (
                  <p className="mt-3 text-xs text-(--text-muted)">
                    Letzte Aktion: <span className="font-medium text-(--text)">{lastAction}</span>
                  </p>
                )}
              </Card>
            }
          />
        </DemoRow>
      </Section>

      {/* ── SortableList ── */}
      <Section title="Sortable List">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Drag & Drop (ganze Zeile)</CardTitle>
            </CardHeader>
            <CardContent>
              <SortableList
                items={tasks}
                onReorder={setTasks}
                renderItem={(item, _index, _dragHandleProps) => (
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <span className="text-sm text-(--text)">{item.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-md ${priorityColors[item.priority]}`}>
                      {priorityLabels[item.priority]}
                    </span>
                  </div>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mit Drag-Handle</CardTitle>
            </CardHeader>
            <CardContent>
              <SortableList
                items={tasksHandle}
                onReorder={setTasksHandle}
                handle
                renderItem={(item, _index, dragHandleProps) => (
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    <span {...dragHandleProps} className="text-(--text-muted) hover:text-(--text) transition-colors">
                      <GripVertical className="size-4" />
                    </span>
                    <span className="flex-1 text-sm text-(--text)">{item.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-md ${priorityColors[item.priority]}`}>
                      {priorityLabels[item.priority]}
                    </span>
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* ── MultiSelect ── */}
      <Section title="Multi Select">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sprachen (Max 4)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-(--text-muted)">Mehrfachauswahl mit Limit</p>
              <MultiSelect
                options={multiselectData.languages}
                value={selectedLangs}
                onChange={setSelectedLangs}
                placeholder="Sprache wählen…"
                maxSelections={4}
              />
              {selectedLangs.length > 0 && (
                <p className="text-xs text-(--text-muted)">
                  Gewählt: <span className="font-medium text-(--text)">{selectedLangs.length}/4</span>
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags (unbegrenzt)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-(--text-muted)">Ohne Limit, durchsuchbar</p>
              <MultiSelect
                options={multiselectData.tags}
                value={selectedTags}
                onChange={setSelectedTags}
                placeholder="Tags hinzufügen…"
                emptyMessage="Kein Tag gefunden."
              />
              {selectedTags.length > 0 && (
                <p className="text-xs text-(--text-muted)">
                  {selectedTags.length} Tag{selectedTags.length > 1 ? "s" : ""} gewählt
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* ── KanbanBoard ── */}
      <Section title="Kanban Board">
        <DemoRow label="Drag & Drop zwischen Spalten">
          <div className="w-full overflow-x-auto">
            <KanbanBoard
              columns={kanbanColumns}
              onMove={handleKanbanMove}
            />
          </div>
        </DemoRow>
      </Section>

      {/* ── Calendar ── */}
      <Section title="Calendar">
        <DemoRow label="Monats- & Wochenansicht mit Events">
          <div className="w-full">
            <Calendar
              events={calendarEvents}
              view="month"
            />
          </div>
        </DemoRow>
      </Section>
    </>
  );
}
