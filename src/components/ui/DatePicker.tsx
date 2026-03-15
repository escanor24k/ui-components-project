"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  locale?: string;
}

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"] as const;

const triggerBase =
  "w-full flex items-center justify-between rounded-xl px-4 py-2.5 text-sm transition-all duration-200 outline-none cursor-pointer select-none " +
  "backdrop-blur-sm bg-glass/50 dark:bg-glass/6 " +
  "border border-glass/60 dark:border-glass/10 " +
  "text-(--text) " +
  "focus:bg-glass/70 dark:focus:bg-glass/10 " +
  "focus:border-primary-400/50 dark:focus:border-primary-400/30 " +
  "focus:ring-2 focus:ring-primary-400/20 dark:focus:ring-primary-400/10 " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

const triggerError =
  "border-danger-400/60 dark:border-danger-400/30 bg-danger-50/30 dark:bg-danger-400/5 " +
  "focus:border-danger-400/60 dark:focus:border-danger-400/30 focus:ring-danger-400/20";

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

interface CalendarDay {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
}

function buildCalendarDays(year: number, month: number): CalendarDay[] {
  const days: CalendarDay[] = [];
  const firstDay = getFirstDayOfWeek(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: daysInPrevMonth - i,
      month: prevMonth,
      year: prevYear,
      isCurrentMonth: false,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ date: d, month, year, isCurrentMonth: true });
  }

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    days.push({
      date: d,
      month: nextMonth,
      year: nextYear,
      isCurrentMonth: false,
    });
  }

  return days;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Datum auswählen…",
  error,
  disabled = false,
  className = "",
  id,
  locale = "de-DE",
}: DatePickerProps): React.ReactElement {
  const today = new Date();
  const initialMonth = value ? value.getMonth() : today.getMonth();
  const initialYear = value ? value.getFullYear() : today.getFullYear();

  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(initialMonth);
  const [viewYear, setViewYear] = useState(initialYear);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 6, left: rect.left });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent): void {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        (!calendarRef.current || !calendarRef.current.contains(e.target as Node))
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (value) {
      setViewMonth(value.getMonth());
      setViewYear(value.getFullYear());
    }
  }, [value]);

  const goToPrevMonth = useCallback((): void => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const goToNextMonth = useCallback((): void => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  function handleSelectDay(day: CalendarDay): void {
    const selected = new Date(day.year, day.month, day.date);
    onChange?.(selected);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>): void {
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => !o);
    }
  }

  const days = buildCalendarDays(viewYear, viewMonth);
  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });

  const formattedValue = value
    ? value.toLocaleDateString(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={error ? "true" : undefined}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        className={`${triggerBase} ${error ? triggerError : ""}`}
      >
        <span className={formattedValue ? "text-(--text)" : "text-(--text-muted)"}>
          {formattedValue ?? placeholder}
        </span>
        <Calendar className="size-4 opacity-50 shrink-0 ml-2" aria-hidden="true" />
      </button>

      {open && createPortal(
        <div
          ref={calendarRef}
          role="dialog"
          aria-label="Kalender"
          style={{ top: pos.top, left: pos.left }}
          className="fixed z-50 rounded-xl border border-glass/60 dark:border-glass/10 bg-(--surface-overlay) bg-linear-to-br from-glass/80 via-glass/60 to-glass/40 dark:from-glass/12 dark:via-glass/8 dark:to-glass/5 shadow-xl shadow-black/10 dark:shadow-black/40 p-3 w-72"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={goToPrevMonth}
              aria-label="Vorheriger Monat"
              className="size-8 rounded-lg hover:bg-glass/50 dark:hover:bg-glass/8 flex items-center justify-center transition-colors text-(--text)"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-sm font-medium text-(--text) select-none">
              {monthLabel}
            </span>
            <button
              type="button"
              onClick={goToNextMonth}
              aria-label="Nächster Monat"
              className="size-8 rounded-lg hover:bg-glass/50 dark:hover:bg-glass/8 flex items-center justify-center transition-colors text-(--text)"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-0.5">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="text-xs text-(--text-muted) font-medium text-center py-1 select-none"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {days.map((day, i) => {
              const dayDate = new Date(day.year, day.month, day.date);
              const isToday = isSameDay(dayDate, today);
              const isSelected = value ? isSameDay(dayDate, value) : false;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={[
                    "size-9 rounded-lg flex items-center justify-center text-sm transition-colors cursor-pointer select-none",
                    !day.isCurrentMonth
                      ? "text-(--text-muted) opacity-40"
                      : isSelected
                        ? "bg-primary-500 dark:bg-primary-400 text-white font-medium"
                        : isToday
                          ? "ring-1 ring-primary-400/40 text-(--text) hover:bg-glass/50 dark:hover:bg-glass/8"
                          : "text-(--text) hover:bg-glass/50 dark:hover:bg-glass/8",
                  ].join(" ")}
                >
                  {day.date}
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
