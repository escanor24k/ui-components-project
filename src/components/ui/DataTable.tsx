"use client";

import { useState, useMemo, useRef, useEffect, type ReactNode } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Printer,
  Download,
  FileJson,
  FileSpreadsheet,
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
  showPrint?: boolean;
  showDownload?: boolean;
  downloadFilename?: string;
}

type SortDirection = "asc" | "desc";
interface SortConfig {
  key: string;
  direction: SortDirection;
}

function triggerDownload(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  showPagination = false,
  pageSize = 10,
  emptyMessage = "Keine Einträge vorhanden.",
  className = "",
  showPrint = false,
  showDownload = false,
  downloadFilename = "data",
}: DataTableProps<T>): React.ReactElement {
  const [sort, setSort] = useState<SortConfig | null>(null);
  const [page, setPage] = useState(1);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const downloadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!downloadOpen) return;
    function handleClick(e: MouseEvent): void {
      if (
        downloadRef.current &&
        !downloadRef.current.contains(e.target as Node)
      ) {
        setDownloadOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [downloadOpen]);

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

  /* ── Download handlers ── */
  function handleDownloadJSON(): void {
    const exportData = sorted.map((row) => {
      const obj: Record<string, unknown> = {};
      for (const col of columns) {
        obj[col.key] = row[col.key];
      }
      return obj;
    });
    triggerDownload(
      JSON.stringify(exportData, null, 2),
      `${downloadFilename}.json`,
      "application/json",
    );
    setDownloadOpen(false);
  }

  function handleDownloadCSV(): void {
    const header = columns.map((c) => c.label).join(",");
    const csvRows = sorted.map((row) =>
      columns
        .map((c) => {
          const val = String(row[c.key] ?? "");
          return val.includes(",") || val.includes('"') || val.includes("\n")
            ? `"${val.replace(/"/g, '""')}"`
            : val;
        })
        .join(","),
    );
    triggerDownload(
      "\uFEFF" + [header, ...csvRows].join("\n"),
      `${downloadFilename}.csv`,
      "text/csv;charset=utf-8",
    );
    setDownloadOpen(false);
  }

  function handlePrint(): void {
    window.print();
  }

  const from = sorted.length > 0 ? (safePage - 1) * pageSize + 1 : 0;
  const to = Math.min(safePage * pageSize, sorted.length);

  const hasActions = showPrint || showDownload;
  const hasPagination = showPagination && totalPages > 1;
  const showToolbar = hasActions || hasPagination;

  const actionBtnClass =
    "size-7 flex items-center justify-center rounded-lg text-(--text-muted) hover:text-(--text) hover:bg-glass/40 dark:hover:bg-glass/10 transition-colors cursor-pointer";

  const glassClass =
    "backdrop-blur-2xl bg-linear-to-br from-glass/70 via-glass/50 to-glass/30 dark:from-glass/10 dark:via-glass/6 dark:to-glass/3 border border-glass/60 dark:border-glass/10";

  return (
    <div className={`w-full ${className}`}>
      {/* Toolbar – tabs float above table, gap between them is transparent */}
      {showToolbar && (
        <div className="relative z-10 flex items-end [--tab-solid:#ebe9f0d9] dark:[--tab-solid:#1e2230a6]">
          {/* Left: Actions tab */}
          {hasActions ? (
            <>
              <div
                className={`relative flex items-center gap-1 shrink-0 px-4 py-2 rounded-t-md ${glassClass} border-b-0`}
              >
                {showPrint && (
                  <div className="relative group">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className={actionBtnClass}
                      aria-label="Drucken"
                    >
                      <Printer className="size-4" />
                    </button>
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-2 py-1 text-xs font-medium rounded-lg bg-neutral-900 dark:bg-neutral-700 text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      Drucken
                    </span>
                  </div>
                )}
                {showDownload && (
                  <div ref={downloadRef} className="relative group">
                    <button
                      type="button"
                      onClick={() => setDownloadOpen((o) => !o)}
                      className={actionBtnClass}
                      aria-label="Download"
                    >
                      <Download className="size-4" />
                    </button>
                    {!downloadOpen && (
                      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 px-2 py-1 text-xs font-medium rounded-lg bg-neutral-900 dark:bg-neutral-700 text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        Download
                      </span>
                    )}
                    {downloadOpen && (
                      <div className="absolute left-0 bottom-full mb-1 z-50 min-w-40 rounded-xl bg-(--surface-overlay) border border-glass/60 dark:border-glass/10 shadow-lg shadow-black/10 dark:shadow-black/30 py-1">
                        <button
                          type="button"
                          onClick={handleDownloadJSON}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-(--text) hover:bg-neutral-100 dark:hover:bg-glass/5 transition-colors cursor-pointer"
                        >
                          <FileJson className="size-4 text-(--text-muted)" />
                          Als JSON
                        </button>
                        <button
                          type="button"
                          onClick={handleDownloadCSV}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-(--text) hover:bg-neutral-100 dark:hover:bg-glass/5 transition-colors cursor-pointer"
                        >
                          <FileSpreadsheet className="size-4 text-(--text-muted)" />
                          Als CSV
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div />
          )}

          <div className="flex-1" />

          {/* Right: Pagination tab */}
          {hasPagination ? (
            <>
              <div
                className={`relative flex items-center gap-3 shrink-0 px-4 py-2 rounded-t-md ${glassClass} border-b-0`}
              >
                <span className="text-xs text-(--text-muted) tabular-nums">
                  {from}–{to} von {sorted.length}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    className="size-7 flex items-center justify-center rounded-lg text-(--text-muted) hover:text-(--text) hover:bg-glass/40 dark:hover:bg-glass/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    aria-label="Vorherige Seite"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage >= totalPages}
                    className="size-7 flex items-center justify-center rounded-lg text-(--text-muted) hover:text-(--text) hover:bg-glass/40 dark:hover:bg-glass/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                    aria-label="Nächste Seite"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div />
          )}
        </div>
      )}

      {/* Table content – own glass container */}
      <div
        className={`overflow-hidden ${showToolbar ? "rounded-b-2xl" : "rounded-2xl"} ${glassClass} shadow-xl shadow-black/5 dark:shadow-black/30`}
      >
        <div className="overflow-x-auto glass-scroll-x">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-300/40 dark:border-glass/8 bg-glass/20 dark:bg-glass/3">
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

            <tbody className="divide-y divide-neutral-300/40 dark:divide-glass/6">
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
                    className="transition-colors hover:bg-glass/30 dark:hover:bg-glass/5"
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
    </div>
  );
}

export type { DataTableColumn, DataTableProps };
