"use client";

import { useState, useMemo, type ReactNode } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface DataTableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey?: keyof T & string;
  showPagination?: boolean;
  pageSize?: number;
  emptyMessage?: string;
  className?: string;
}

type SortDirection = "asc" | "desc";
interface SortConfig {
  key: string;
  direction: SortDirection;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  showPagination = false,
  pageSize = 10,
  emptyMessage = "Keine Einträge vorhanden.",
  className = "",
}: DataTableProps<T>): React.ReactElement {
  const [sort, setSort] = useState<SortConfig | null>(null);
  const [page, setPage] = useState(1);

  /* ── Sorting ── */
  const sorted = useMemo(() => {
    if (!sort) return data;
    return [...data].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      const dir = sort.direction === "asc" ? 1 : -1;
      if (av == null && bv == null) return 0;
      if (av == null) return dir;
      if (bv == null) return -dir;
      if (typeof av === "number" && typeof bv === "number")
        return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [data, sort]);

  /* ── Pagination ── */
  const totalPages = showPagination
    ? Math.max(1, Math.ceil(sorted.length / pageSize))
    : 1;
  const safePage = Math.min(page, totalPages);
  const rows = showPagination
    ? sorted.slice((safePage - 1) * pageSize, safePage * pageSize)
    : sorted;

  function toggleSort(key: string): void {
    setSort((prev) =>
      prev?.key === key
        ? prev.direction === "asc"
          ? { key, direction: "desc" }
          : null
        : { key, direction: "asc" },
    );
    setPage(1);
  }

  const from = sorted.length > 0 ? (safePage - 1) * pageSize + 1 : 0;
  const to = Math.min(safePage * pageSize, sorted.length);

  return (
    <div
      className={`w-full overflow-hidden rounded-2xl backdrop-blur-2xl bg-linear-to-br from-white/70 via-white/50 to-white/30 dark:from-white/10 dark:via-white/6 dark:to-white/3 border border-white/60 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/30 ${className}`}
    >
      {/* Pagination bar – flush above header */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-end gap-3 px-4 py-2 border-b border-slate-300/40 dark:border-white/8">
          <span className="text-xs text-(--text-muted) tabular-nums">
            {from}–{to} von {sorted.length}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="size-7 flex items-center justify-center rounded-lg text-(--text-muted) hover:text-(--text) hover:bg-white/40 dark:hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              aria-label="Vorherige Seite"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="size-7 flex items-center justify-center rounded-lg text-(--text-muted) hover:text-(--text) hover:bg-white/40 dark:hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              aria-label="Nächste Seite"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-300/40 dark:border-white/8 bg-white/20 dark:bg-white/3">
            <tr>
              {columns.map((col) => {
                const active = sort?.key === col.key;
                return (
                  <th
                    key={col.key}
                    onClick={
                      col.sortable ? () => toggleSort(col.key) : undefined
                    }
                    className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--text-muted) ${
                      col.sortable
                        ? "cursor-pointer select-none hover:text-(--text) transition-colors"
                        : ""
                    } ${col.headerClassName ?? ""}`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {col.label}
                      {col.sortable &&
                        (active && sort ? (
                          sort.direction === "asc" ? (
                            <ChevronUp className="size-3.5" />
                          ) : (
                            <ChevronDown className="size-3.5" />
                          )
                        ) : (
                          <ChevronsUpDown className="size-3.5 opacity-40" />
                        ))}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-300/40 dark:divide-white/6">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-(--text-muted)"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={rowKey ? String(row[rowKey]) : i}
                  className="transition-colors hover:bg-white/30 dark:hover:bg-white/5"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3.5 text-(--text) ${col.className ?? ""}`}
                    >
                      {col.render
                        ? col.render(row)
                        : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export type { DataTableColumn, DataTableProps };
