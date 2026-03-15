"use client";

import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X, Clock, Plus, Pencil, Trash2 } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
 * Types
 * ═══════════════════════════════════════════════════════════ */

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
  description?: string;
  color?: "default" | "success" | "warning" | "danger" | "info";
}

interface CalendarProps {
  events?: CalendarEvent[];
  view?: "month" | "week";
  defaultDate?: Date;
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  onEventAdd?: (date: Date) => void;
  onEventEdit?: (event: CalendarEvent) => void;
  onEventDelete?: (event: CalendarEvent) => void;
  locale?: string;
  className?: string;
}

interface CalendarDay {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
}

interface DayModalData {
  date: Date;
  events: CalendarEvent[];
}

type PickerMode = "days" | "months" | "years";

/* ═══════════════════════════════════════════════════════════
 * Constants
 * ═══════════════════════════════════════════════════════════ */

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"] as const;

const WEEKDAYS_LONG = [
  "Montag", "Dienstag", "Mittwoch", "Donnerstag",
  "Freitag", "Samstag", "Sonntag",
] as const;

const MONTHS_SHORT_DE = [
  "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
  "Jul", "Aug", "Sep", "Okt", "Nov", "Dez",
] as const;

const chipColors: Record<string, string> = {
  default:
    "bg-primary-500/20 text-primary-700 dark:bg-primary-400/20 dark:text-primary-300",
  success:
    "bg-success-500/20 text-success-700 dark:bg-success-400/20 dark:text-success-300",
  warning:
    "bg-warning-500/20 text-warning-700 dark:bg-warning-400/20 dark:text-warning-300",
  danger:
    "bg-danger-500/20 text-danger-700 dark:bg-danger-400/20 dark:text-danger-300",
  info: "bg-info-500/20 text-info-700 dark:bg-info-400/20 dark:text-info-300",
};

const dotColors: Record<string, string> = {
  default: "bg-primary-500 dark:bg-primary-400",
  success: "bg-success-500 dark:bg-success-400",
  warning: "bg-warning-500 dark:bg-warning-400",
  danger: "bg-danger-500 dark:bg-danger-400",
  info: "bg-info-500 dark:bg-info-400",
};

/* ═══════════════════════════════════════════════════════════
 * Helpers
 * ═══════════════════════════════════════════════════════════ */

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function buildMonthDays(year: number, month: number): CalendarDay[] {
  const days: CalendarDay[] = [];
  const firstDay = getFirstDayOfWeek(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ date: daysInPrevMonth - i, month: prevMonth, year: prevYear, isCurrentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ date: d, month, year, isCurrentMonth: true });
  }
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    days.push({ date: d, month: nextMonth, year: nextYear, isCurrentMonth: false });
  }
  return days;
}

function getWeekDays(date: Date): Date[] {
  const d = new Date(date);
  const dayOfWeek = d.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);

  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    week.push(day);
  }
  return week;
}

function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

function getDecadeRange(year: number): { start: number; end: number } {
  const start = Math.floor(year / 10) * 10;
  return { start, end: start + 9 };
}

function getWeekdayName(date: Date): string {
  const dayIndex = date.getDay();
  return WEEKDAYS_LONG[dayIndex === 0 ? 6 : dayIndex - 1];
}

function formatModalDate(date: Date): string {
  return `${getWeekdayName(date)}, ${date.getDate()}. ${MONTHS_SHORT_DE[date.getMonth()]} ${date.getFullYear()}`;
}

function formatTimeRange(event: CalendarEvent): string | null {
  if (!event.startTime) return null;
  if (event.endTime) return `${event.startTime} – ${event.endTime}`;
  return event.startTime;
}

function formatDateRange(event: CalendarEvent): string | null {
  if (!event.endDate || isSameDay(new Date(event.date), new Date(event.endDate))) return null;
  const end = new Date(event.endDate);
  return `bis ${end.getDate()}. ${MONTHS_SHORT_DE[end.getMonth()]}`;
}

function sortEventsByTime(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => {
    if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
    if (a.startTime) return -1;
    if (b.startTime) return 1;
    return 0;
  });
}

/* ═══════════════════════════════════════════════════════════
 * Keyframes (einmalig global)
 * ═══════════════════════════════════════════════════════════ */

let stylesInjected = false;
function ensureStyles(): void {
  if (stylesInjected || typeof document === "undefined") return;
  const style = document.createElement("style");
  style.textContent = "@keyframes cal-modal-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}";
  document.head.appendChild(style);
  stylesInjected = true;
}

/* ═══════════════════════════════════════════════════════════
 * DayDetailModal
 * ═══════════════════════════════════════════════════════════ */

function DayDetailModal({
  data,
  onClose,
  onEventClick,
  onEventAdd,
  onEventEdit,
  onEventDelete,
}: {
  data: DayModalData;
  onClose: () => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventAdd?: (date: Date) => void;
  onEventEdit?: (event: CalendarEvent) => void;
  onEventDelete?: (event: CalendarEvent) => void;
}): React.ReactElement | null {
  const panelRef = useRef<HTMLDivElement>(null);
  const sorted = useMemo(() => sortEventsByTime(data.events), [data.events]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent): void {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => { document.body.style.overflow = prev; };
  }, []);

  if (typeof document === "undefined") return null;

  const todayFlag = isToday(data.date);
  const hasActions = !!(onEventAdd || onEventEdit || onEventDelete);

  return createPortal(
    <div
      className="fixed inset-0 z-70 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />

      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={formatModalDate(data.date)}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-md mx-4 rounded-2xl border border-glass/60 dark:border-glass/10 bg-(--surface-overlay) bg-linear-to-br from-glass/80 via-glass/60 to-glass/40 dark:from-glass/12 dark:via-glass/8 dark:to-glass/5 shadow-2xl shadow-black/10 dark:shadow-black/50 overflow-hidden"
        style={{ animation: "cal-modal-in 0.15s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-glass/30 dark:border-glass/6">
          <div>
            <p className={[
              "text-sm font-semibold",
              todayFlag ? "text-primary-600 dark:text-primary-400" : "text-(--text)",
            ].join(" ")}>
              {formatModalDate(data.date)}
            </p>
            <p className="text-xs text-(--text-muted) mt-0.5">
              {sorted.length === 0
                ? "Keine Einträge"
                : `${sorted.length} ${sorted.length === 1 ? "Eintrag" : "Einträge"}`}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {onEventAdd && (
              <button
                type="button"
                onClick={() => { onEventAdd(data.date); onClose(); }}
                className="size-7 rounded-lg hover:bg-primary-500/10 dark:hover:bg-primary-400/15 flex items-center justify-center transition-colors text-primary-600 dark:text-primary-400 cursor-pointer"
                aria-label="Eintrag hinzufügen"
                title="Eintrag hinzufügen"
              >
                <Plus className="size-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="size-7 rounded-lg hover:bg-glass/50 dark:hover:bg-glass/8 flex items-center justify-center transition-colors text-(--text-muted) hover:text-(--text) cursor-pointer"
              aria-label="Schließen"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Events */}
        <div className="px-5 py-3 space-y-1 max-h-80 overflow-y-auto glass-scroll">
          {sorted.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-(--text-muted)">Keine Einträge für diesen Tag</p>
              {onEventAdd && (
                <button
                  type="button"
                  onClick={() => { onEventAdd(data.date); onClose(); }}
                  className="mt-3 text-xs px-3 py-1.5 rounded-lg bg-primary-500/10 dark:bg-primary-400/15 text-primary-600 dark:text-primary-400 hover:bg-primary-500/20 dark:hover:bg-primary-400/25 transition-colors cursor-pointer"
                >
                  Eintrag hinzufügen
                </button>
              )}
            </div>
          ) : (
            sorted.map((evt) => {
              const timeStr = formatTimeRange(evt);
              const dateRange = formatDateRange(evt);

              return (
                <div
                  key={evt.id}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-glass/50 dark:hover:bg-glass/8 transition-colors group"
                >
                  {/* Color indicator */}
                  <span className={[
                    "size-2.5 rounded-full mt-1.5 shrink-0",
                    dotColors[evt.color ?? "default"],
                  ].join(" ")} />

                  {/* Content – klickbar */}
                  <button
                    type="button"
                    onClick={() => { onEventClick?.(evt); }}
                    className="flex-1 min-w-0 text-left cursor-pointer"
                  >
                    <p className="text-sm font-medium text-(--text) group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {evt.title}
                    </p>

                    {/* Zeitangabe + Datumsbereich */}
                    {(timeStr || dateRange) && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock className="size-3 text-(--text-muted) shrink-0" />
                        <p className="text-xs text-(--text-muted)">
                          {[timeStr, dateRange].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                    )}

                    {/* Beschreibung */}
                    {evt.description && (
                      <p className="text-xs text-(--text-muted) mt-1 line-clamp-2">
                        {evt.description}
                      </p>
                    )}
                  </button>

                  {/* Action buttons (nur wenn callbacks vorhanden) */}
                  {hasActions && (
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      {onEventEdit && (
                        <button
                          type="button"
                          onClick={() => { onEventEdit(evt); onClose(); }}
                          className="size-6 rounded-md hover:bg-glass/60 dark:hover:bg-glass/10 flex items-center justify-center transition-colors text-(--text-muted) hover:text-(--text) cursor-pointer"
                          aria-label="Bearbeiten"
                          title="Bearbeiten"
                        >
                          <Pencil className="size-3" />
                        </button>
                      )}
                      {onEventDelete && (
                        <button
                          type="button"
                          onClick={() => { onEventDelete(evt); onClose(); }}
                          className="size-6 rounded-md hover:bg-danger-500/10 dark:hover:bg-danger-400/15 flex items-center justify-center transition-colors text-(--text-muted) hover:text-danger-600 dark:hover:text-danger-400 cursor-pointer"
                          aria-label="Löschen"
                          title="Löschen"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ═══════════════════════════════════════════════════════════
 * Calendar
 * ═══════════════════════════════════════════════════════════ */

function Calendar({
  events = [],
  view = "month",
  defaultDate,
  onEventClick,
  onDateClick,
  onEventAdd,
  onEventEdit,
  onEventDelete,
  locale = "de-DE",
  className = "",
}: CalendarProps): React.ReactElement {
  const [viewDate, setViewDate] = useState<Date>(defaultDate ?? new Date());
  const [currentView, setCurrentView] = useState<"month" | "week">(view);
  const [pickerMode, setPickerMode] = useState<PickerMode>("days");
  const [dayModal, setDayModal] = useState<DayModalData | null>(null);

  useEffect(() => {
    if (dayModal) ensureStyles();
  }, [dayModal]);

  const eventMap = useMemo((): Map<string, CalendarEvent[]> => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const start = new Date(event.date);
      const end = event.endDate ? new Date(event.endDate) : start;
      const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endNorm = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      while (cursor <= endNorm) {
        const key = formatDateKey(cursor);
        const existing = map.get(key);
        if (existing) existing.push(event);
        else map.set(key, [event]);
        cursor.setDate(cursor.getDate() + 1);
      }
    }
    return map;
  }, [events]);

  /* ─── Navigation ─── */

  const goToPrev = useCallback((): void => {
    if (pickerMode === "years") {
      setViewDate((p) => { const n = new Date(p); n.setFullYear(n.getFullYear() - 10); return n; });
      return;
    }
    if (pickerMode === "months") {
      setViewDate((p) => { const n = new Date(p); n.setFullYear(n.getFullYear() - 1); return n; });
      return;
    }
    setViewDate((p) => {
      const n = new Date(p);
      if (currentView === "month") n.setMonth(n.getMonth() - 1);
      else n.setDate(n.getDate() - 7);
      return n;
    });
  }, [currentView, pickerMode]);

  const goToNext = useCallback((): void => {
    if (pickerMode === "years") {
      setViewDate((p) => { const n = new Date(p); n.setFullYear(n.getFullYear() + 10); return n; });
      return;
    }
    if (pickerMode === "months") {
      setViewDate((p) => { const n = new Date(p); n.setFullYear(n.getFullYear() + 1); return n; });
      return;
    }
    setViewDate((p) => {
      const n = new Date(p);
      if (currentView === "month") n.setMonth(n.getMonth() + 1);
      else n.setDate(n.getDate() + 7);
      return n;
    });
  }, [currentView, pickerMode]);

  const goToToday = useCallback((): void => {
    setViewDate(new Date());
    setPickerMode("days");
  }, []);

  /* ─── Header ─── */

  const headerLabel = useMemo((): string => {
    if (pickerMode === "years") {
      const { start, end } = getDecadeRange(viewDate.getFullYear());
      return `${start} – ${end}`;
    }
    if (pickerMode === "months") return String(viewDate.getFullYear());
    if (currentView === "month") {
      return viewDate.toLocaleDateString(locale, { month: "long", year: "numeric" });
    }
    const wd = getWeekDays(viewDate);
    const firstStr = wd[0].toLocaleDateString(locale, { day: "numeric", month: "short" });
    const lastStr = wd[6].toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
    return `${firstStr} – ${lastStr}`;
  }, [viewDate, currentView, locale, pickerMode]);

  const handleHeaderClick = useCallback((): void => {
    if (pickerMode === "days") setPickerMode("months");
    else if (pickerMode === "months") setPickerMode("years");
  }, [pickerMode]);

  const handleMonthSelect = useCallback((month: number): void => {
    setViewDate((p) => { const n = new Date(p); n.setMonth(month); return n; });
    setPickerMode("days");
  }, []);

  const handleYearSelect = useCallback((year: number): void => {
    setViewDate((p) => { const n = new Date(p); n.setFullYear(year); return n; });
    setPickerMode("months");
  }, []);

  function handleDayClick(date: Date, dayEvents: CalendarEvent[]): void {
    onDateClick?.(date);
    setDayModal({ date, events: dayEvents });
  }

  function handleEventChipClick(e: React.MouseEvent, event: CalendarEvent): void {
    e.stopPropagation();
    onEventClick?.(event);
  }

  /* ─── Month picker ─── */
  function renderMonthPicker(): React.ReactElement {
    const now = new Date();
    const isCurrentYear = viewDate.getFullYear() === now.getFullYear();

    return (
      <div className="grid grid-cols-3 gap-2 py-2">
        {MONTHS_SHORT_DE.map((label, i) => {
          const isActive = isCurrentYear && i === now.getMonth();
          return (
            <button
              key={label}
              type="button"
              onClick={() => handleMonthSelect(i)}
              className={[
                "py-3 px-2 rounded-xl text-sm transition-colors cursor-pointer",
                isActive
                  ? "font-semibold text-primary-600 dark:text-primary-400 ring-1 ring-primary-400/40"
                  : "text-(--text)",
                "hover:bg-glass/50 dark:hover:bg-glass/8",
              ].join(" ")}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
  }

  /* ─── Year picker ─── */
  function renderYearPicker(): React.ReactElement {
    const now = new Date();
    const { start } = getDecadeRange(viewDate.getFullYear());
    const years: number[] = [];
    for (let y = start - 1; y <= start + 10; y++) years.push(y);

    return (
      <div className="grid grid-cols-3 gap-2 py-2">
        {years.map((year) => (
          <button
            key={year}
            type="button"
            onClick={() => handleYearSelect(year)}
            className={[
              "py-3 px-2 rounded-xl text-sm transition-colors cursor-pointer",
              year < start || year > start + 9 ? "opacity-40" : "",
              year === now.getFullYear()
                ? "font-semibold text-primary-600 dark:text-primary-400 ring-1 ring-primary-400/40"
                : "text-(--text)",
              "hover:bg-glass/50 dark:hover:bg-glass/8",
            ].join(" ")}
          >
            {year}
          </button>
        ))}
      </div>
    );
  }

  /* ─── Month view ─── */
  function renderMonthView(): React.ReactElement {
    const days = buildMonthDays(viewDate.getFullYear(), viewDate.getMonth());

    return (
      <div>
        <div className="grid grid-cols-7 mb-0.5">
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-xs text-(--text-muted) font-medium text-center py-2 select-none">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px">
          {days.map((day, i) => {
            const dayDate = new Date(day.year, day.month, day.date);
            const key = formatDateKey(dayDate);
            const dayEvents = eventMap.get(key) ?? [];
            const todayFlag = isToday(dayDate);
            const maxVisible = 2;
            const overflow = dayEvents.length - maxVisible;

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleDayClick(dayDate, dayEvents)}
                className={[
                  "min-h-24 p-1.5 rounded-lg text-left transition-colors cursor-pointer hover:bg-glass/40 dark:hover:bg-glass/6",
                  !day.isCurrentMonth ? "opacity-40" : "",
                  todayFlag ? "ring-1 ring-primary-400/40" : "",
                ].join(" ")}
              >
                <span className={[
                  "text-xs",
                  todayFlag ? "font-semibold text-primary-600 dark:text-primary-400" : "text-(--text)",
                ].join(" ")}>
                  {day.date}
                </span>

                {dayEvents.length > 0 && (
                  <div className="flex flex-col gap-0.5 mt-1">
                    {dayEvents.slice(0, maxVisible).map((evt) => (
                      <span
                        key={evt.id}
                        onClick={(e) => handleEventChipClick(e, evt)}
                        className={[
                          "text-[10px] leading-tight px-1 py-px rounded truncate block cursor-pointer hover:opacity-80 transition-opacity",
                          chipColors[evt.color ?? "default"],
                        ].join(" ")}
                        title={evt.title}
                      >
                        {evt.startTime && (
                          <span className="font-medium">{evt.startTime} </span>
                        )}
                        {evt.title}
                      </span>
                    ))}
                    {overflow > 0 && (
                      <span className="text-[10px] text-primary-600 dark:text-primary-400 leading-none px-1">
                        +{overflow} weitere
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ─── Week view ─── */
  function renderWeekView(): React.ReactElement {
    const weekDays = getWeekDays(viewDate);

    return (
      <div>
        <div className="grid grid-cols-7 mb-0.5">
          {weekDays.map((day, i) => {
            const todayFlag = isToday(day);
            return (
              <div key={i} className="text-center py-2 select-none">
                <div className="text-xs text-(--text-muted) font-medium">{WEEKDAYS[i]}</div>
                <div className={[
                  "text-sm mt-0.5",
                  todayFlag ? "font-semibold text-primary-600 dark:text-primary-400" : "text-(--text)",
                ].join(" ")}>
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-7 gap-px">
          {weekDays.map((day, i) => {
            const key = formatDateKey(day);
            const dayEvents = eventMap.get(key) ?? [];
            const todayFlag = isToday(day);

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleDayClick(day, dayEvents)}
                className={[
                  "min-h-32 p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-glass/40 dark:hover:bg-glass/6",
                  todayFlag ? "ring-1 ring-primary-400/40" : "",
                ].join(" ")}
              >
                <div className="flex flex-col gap-1">
                  {dayEvents.map((evt) => (
                    <span
                      key={evt.id}
                      onClick={(e) => handleEventChipClick(e, evt)}
                      className={[
                        "text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity text-left",
                        chipColors[evt.color ?? "default"],
                      ].join(" ")}
                      title={evt.title}
                    >
                      {evt.startTime && (
                        <span className="font-medium">{evt.startTime} </span>
                      )}
                      {evt.title}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ─── Body ─── */
  function renderBody(): React.ReactElement {
    if (pickerMode === "years") return renderYearPicker();
    if (pickerMode === "months") return renderMonthPicker();
    if (currentView === "month") return renderMonthView();
    return renderWeekView();
  }

  /* ─── Render ─── */
  return (
    <div
      className={[
        "rounded-2xl backdrop-blur-2xl bg-linear-to-br from-glass/70 via-glass/50 to-glass/30 dark:from-glass/10 dark:via-glass/6 dark:to-glass/3 border border-glass/60 dark:border-glass/10 shadow-xl shadow-black/5 dark:shadow-black/30 p-4",
        className,
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Zurück"
            className="size-8 rounded-lg hover:bg-glass/50 dark:hover:bg-glass/8 flex items-center justify-center transition-colors text-(--text) cursor-pointer"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            aria-label="Weiter"
            className="size-8 rounded-lg hover:bg-glass/50 dark:hover:bg-glass/8 flex items-center justify-center transition-colors text-(--text) cursor-pointer"
          >
            <ChevronRight className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleHeaderClick}
            className="text-sm font-medium text-(--text) select-none ml-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer rounded-lg px-2 py-1 hover:bg-glass/50 dark:hover:bg-glass/8"
          >
            {headerLabel}
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goToToday}
            className="text-xs px-2.5 py-1 rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-500/10 dark:hover:bg-primary-400/15 transition-colors cursor-pointer"
          >
            Heute
          </button>

          {pickerMode === "days" && (
            <div className="inline-flex items-center rounded-lg p-0.5 bg-glass/30 dark:bg-glass/5 ml-1">
              <button
                type="button"
                onClick={() => setCurrentView("month")}
                className={[
                  "text-xs font-medium w-16 text-center py-1 rounded-md cursor-pointer text-(--text)",
                  currentView === "month"
                    ? "bg-primary-500/10 dark:bg-primary-400/15 shadow-sm"
                    : "opacity-50 hover:opacity-75",
                ].join(" ")}
              >
                Monat
              </button>
              <button
                type="button"
                onClick={() => setCurrentView("week")}
                className={[
                  "text-xs font-medium w-16 text-center py-1 rounded-md cursor-pointer text-(--text)",
                  currentView === "week"
                    ? "bg-primary-500/10 dark:bg-primary-400/15 shadow-sm"
                    : "opacity-50 hover:opacity-75",
                ].join(" ")}
              >
                Woche
              </button>
            </div>
          )}
        </div>
      </div>

      {renderBody()}

      {dayModal && (
        <DayDetailModal
          data={dayModal}
          onClose={() => setDayModal(null)}
          onEventClick={onEventClick}
          onEventAdd={onEventAdd}
          onEventEdit={onEventEdit}
          onEventDelete={onEventDelete}
        />
      )}
    </div>
  );
}

export { Calendar };
export type { CalendarEvent, CalendarProps };
