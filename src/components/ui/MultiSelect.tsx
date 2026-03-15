"use client";

import { useState, useRef, useEffect, useCallback, type KeyboardEvent, type ChangeEvent } from "react";
import { createPortal } from "react-dom";
import { X, Check, ChevronDown } from "lucide-react";

interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (values: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  maxSelections?: number;
  searchable?: boolean;
  className?: string;
}

function MultiSelect({
  options,
  value: controlledValue,
  onChange,
  placeholder = "Auswählen…",
  emptyMessage = "Keine Ergebnisse.",
  maxSelections,
  searchable = true,
  className = "",
}: MultiSelectProps): React.ReactElement {
  const [internalValue, setInternalValue] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const selected = controlledValue ?? internalValue;

  const setSelected = useCallback(
    (next: string[]): void => {
      if (controlledValue === undefined) {
        setInternalValue(next);
      }
      onChange?.(next);
    },
    [controlledValue, onChange],
  );

  const atLimit =
    maxSelections !== undefined && selected.length >= maxSelections;

  const filtered = options.filter((o) => {
    if (!query) return true;
    return o.label.toLowerCase().includes(query.toLowerCase());
  });

  function updateQuery(next: string): void {
    setQuery(next);
    setHighlightIndex(-1);
  }

  useEffect(() => {
    if (!open || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 6, left: rect.left, width: rect.width });
  }, [open]);

  useEffect(() => {
    function handleClick(e: MouseEvent): void {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        (!dropdownRef.current || !dropdownRef.current.contains(e.target as Node))
      ) {
        setOpen(false);
        setQuery("");
        setHighlightIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function isSelected(val: string): boolean {
    return selected.includes(val);
  }

  function toggleOption(val: string): void {
    if (isSelected(val)) {
      setSelected(selected.filter((v) => v !== val));
    } else {
      if (atLimit) return;
      setSelected([...selected, val]);
    }
    updateQuery("");
    inputRef.current?.focus();
  }

  function removeChip(val: string): void {
    setSelected(selected.filter((v) => v !== val));
    inputRef.current?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (
      e.key === "Enter" &&
      highlightIndex >= 0 &&
      filtered[highlightIndex]
    ) {
      e.preventDefault();
      const opt = filtered[highlightIndex];
      if (!opt.disabled && (!atLimit || isSelected(opt.value))) {
        toggleOption(opt.value);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      updateQuery("");
      inputRef.current?.blur();
    } else if (
      e.key === "Backspace" &&
      !query &&
      selected.length > 0
    ) {
      removeChip(selected[selected.length - 1]);
    }
  }

  function handleContainerClick(): void {
    if (searchable && !atLimit) {
      inputRef.current?.focus();
    }
    if (!open) {
      setOpen(true);
    }
  }

  function getOptionLabel(val: string): string {
    return options.find((o) => o.value === val)?.label ?? val;
  }

  function isOptionDisabled(opt: MultiSelectOption): boolean {
    if (opt.disabled) return true;
    if (atLimit && !isSelected(opt.value)) return true;
    return false;
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input container */}
      <div
        className="flex flex-wrap items-center gap-1.5 rounded-xl px-3 py-2 min-h-11 cursor-text backdrop-blur-sm bg-glass/50 dark:bg-glass/6 border border-glass/60 dark:border-glass/10 focus-within:bg-glass/70 dark:focus-within:bg-glass/10 focus-within:border-primary-400/50 dark:focus-within:border-primary-400/30 focus-within:ring-2 focus-within:ring-primary-400/20 transition-all duration-200"
        onClick={handleContainerClick}
      >
        {/* Chips */}
        {selected.map((val) => (
          <span
            key={val}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium bg-primary-500/10 dark:bg-primary-400/15 text-primary-700 dark:text-primary-300 border border-primary-500/15 dark:border-primary-400/15"
          >
            {getOptionLabel(val)}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeChip(val);
              }}
              className="rounded-sm hover:bg-primary-500/15 dark:hover:bg-primary-400/20 transition-colors cursor-pointer"
              aria-label={`${getOptionLabel(val)} entfernen`}
            >
              <X className="size-3" />
            </button>
          </span>
        ))}

        {/* Search input */}
        {searchable && !atLimit && (
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              updateQuery(e.target.value);
              if (!open) setOpen(true);
            }}
            onFocus={() => {
              if (!open) setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={selected.length === 0 ? placeholder : ""}
            className="flex-1 min-w-20 bg-transparent outline-none text-sm text-(--text) placeholder:text-(--text-muted) py-0.5"
          />
        )}

        {/* Placeholder when not searchable and nothing selected */}
        {!searchable && selected.length === 0 && (
          <span className="flex-1 text-sm text-(--text-muted) py-0.5">
            {placeholder}
          </span>
        )}

        {/* ChevronDown toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((prev) => !prev);
            if (!open && searchable && !atLimit) {
              inputRef.current?.focus();
            }
          }}
          className="shrink-0 ml-auto size-7 flex items-center justify-center text-(--text-muted) hover:text-(--text) transition-colors cursor-pointer"
        >
          <ChevronDown
            className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Dropdown panel (portal) */}
      {open && createPortal(
        <div
          ref={dropdownRef}
          style={{ top: pos.top, left: pos.left, width: pos.width }}
          className="fixed z-50 rounded-xl py-1 max-h-56 overflow-y-auto glass-scroll border border-glass/60 dark:border-glass/10 bg-(--surface-overlay) bg-linear-to-br from-glass/80 via-glass/60 to-glass/40 dark:from-glass/12 dark:via-glass/8 dark:to-glass/5 shadow-xl shadow-black/10 dark:shadow-black/40"
        >
          {filtered.length === 0 ? (
            <p className="px-3 py-2 text-sm text-(--text-muted)">
              {emptyMessage}
            </p>
          ) : (
            filtered.map((opt, i) => {
              const disabled = isOptionDisabled(opt);
              const optSelected = isSelected(opt.value);
              const highlighted = i === highlightIndex;

              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!disabled) {
                      toggleOption(opt.value);
                    }
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                    disabled
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer"
                  } ${
                    highlighted && !disabled
                      ? "bg-primary-500/10 dark:bg-primary-400/15 text-(--text)"
                      : disabled
                        ? ""
                        : "text-(--text) hover:bg-glass/50 dark:hover:bg-glass/8"
                  }`}
                >
                  <Check
                    className={`size-3.5 shrink-0 ${
                      optSelected
                        ? "opacity-100 text-primary-500"
                        : "opacity-0"
                    }`}
                  />
                  {opt.label}
                </button>
              );
            })
          )}
        </div>,
        document.body,
      )}
    </div>
  );
}

export { MultiSelect };
export type { MultiSelectOption, MultiSelectProps };
