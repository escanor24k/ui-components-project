"use client";

import { useState, useRef, useEffect, useCallback, forwardRef, type InputHTMLAttributes, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { Search, X, Loader2 } from "lucide-react";

interface AutocompleteOption {
  value: string;
  label: string;
  description?: string;
}

interface AutocompleteInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "onSelect"> {
  options?: AutocompleteOption[];
  onSearch?: (query: string) => void;
  onChange?: (value: string) => void;
  onSelect?: (option: AutocompleteOption) => void;
  loading?: boolean;
  emptyMessage?: string;
  debounceMs?: number;
  minChars?: number;
  className?: string;
}

export const AutocompleteInput = forwardRef<HTMLInputElement, AutocompleteInputProps>(function AutocompleteInput(
  {
    options = [],
    onSearch,
    onChange,
    onSelect,
    loading = false,
    emptyMessage = "Keine Ergebnisse.",
    debounceMs = 300,
    minChars = 1,
    value: controlledValue,
    className = "",
    placeholder,
    disabled,
    ...rest
  },
  ref,
): React.ReactElement {
  const [internalValue, setInternalValue] = useState((controlledValue as string) ?? "");
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const current = controlledValue !== undefined ? (controlledValue as string) : internalValue;

  // Client-side filter for static options (when no onSearch is provided)
  const filtered = onSearch
    ? options
    : options.filter((o) =>
        current.length >= minChars &&
        o.label.toLowerCase().includes(current.toLowerCase()),
      );

  const showDropdown = open && current.length >= minChars && (filtered.length > 0 || loading || (current.length >= minChars && options.length === 0 && !loading));

  // Position calculation for portal dropdown
  useEffect(() => {
    if (!showDropdown || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 6, left: rect.left, width: rect.width });
  }, [showDropdown]);

  // Click-outside
  useEffect(() => {
    function handleClick(e: MouseEvent): void {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        (!dropdownRef.current || !dropdownRef.current.contains(e.target as Node))
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const commitSearch = useCallback(
    (query: string): void => {
      if (!onSearch || query.length < minChars) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSearch(query);
      }, debounceMs);
    },
    [onSearch, debounceMs, minChars],
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const val = e.target.value;
    if (controlledValue === undefined) setInternalValue(val);
    onChange?.(val);
    setOpen(true);
    setHighlightIndex(-1);
    commitSearch(val);
  }

  function handleSelect(option: AutocompleteOption): void {
    if (controlledValue === undefined) setInternalValue(option.label);
    onChange?.(option.label);
    onSelect?.(option);
    setOpen(false);
    setHighlightIndex(-1);
  }

  function handleClear(): void {
    if (controlledValue === undefined) setInternalValue("");
    onChange?.("");
    setOpen(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (!open || filtered.length === 0) {
      if (e.key === "Escape") setOpen(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && highlightIndex >= 0 && highlightIndex < filtered.length && filtered[highlightIndex]) {
      e.preventDefault();
      handleSelect(filtered[highlightIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className={`flex items-center rounded-xl backdrop-blur-sm bg-glass/50 dark:bg-glass/6 border border-glass/60 dark:border-glass/10 focus-within:bg-glass/70 dark:focus-within:bg-glass/10 focus-within:border-primary-400/50 dark:focus-within:border-primary-400/30 focus-within:ring-2 focus-within:ring-primary-400/20 transition-all duration-200 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
        <span className="shrink-0 pl-3 text-(--text-muted)">
          <Search className="size-4" />
        </span>
        <input
          ref={ref}
          type="text"
          value={current}
          onChange={handleChange}
          onFocus={() => { if (current.length >= minChars) setOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className="flex-1 bg-transparent outline-none text-sm text-(--text) placeholder:text-(--text-muted) px-3 py-2.5 min-w-0"
          {...rest}
        />
        {loading && (
          <span className="shrink-0 pr-1 text-(--text-muted)">
            <Loader2 className="size-4 animate-spin" />
          </span>
        )}
        {current && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 size-8 flex items-center justify-center text-(--text-muted) hover:text-(--text) transition-colors cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {showDropdown && createPortal(
        <div
          ref={dropdownRef}
          style={{ top: pos.top, left: pos.left, width: pos.width }}
          className="fixed z-50 rounded-xl border border-glass/60 dark:border-glass/10 bg-(--surface-overlay) bg-linear-to-br from-glass/80 via-glass/60 to-glass/40 dark:from-glass/12 dark:via-glass/8 dark:to-glass/5 shadow-xl shadow-black/10 dark:shadow-black/40 py-1 max-h-56 overflow-y-auto glass-scroll"
        >
          {loading && filtered.length === 0 ? (
            <div className="flex items-center justify-center gap-2 px-3 py-3 text-sm text-(--text-muted)">
              <Loader2 className="size-4 animate-spin" />
              <span>Suche läuft...</span>
            </div>
          ) : filtered.length === 0 ? (
            <p className="px-3 py-2 text-sm text-(--text-muted)">{emptyMessage}</p>
          ) : (
            filtered.map((opt, i) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`w-full flex flex-col px-3 py-2 text-left transition-colors cursor-pointer ${
                  i === highlightIndex
                    ? "bg-primary-500/10 dark:bg-primary-400/15"
                    : "hover:bg-glass/50 dark:hover:bg-glass/8"
                }`}
              >
                <span className="text-sm text-(--text)">{opt.label}</span>
                {opt.description && (
                  <span className="text-xs text-(--text-muted)">{opt.description}</span>
                )}
              </button>
            ))
          )}
        </div>,
        document.body,
      )}
    </div>
  );
});

export type { AutocompleteOption, AutocompleteInputProps };
