"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { ChevronDown, Check, X } from "lucide-react";

interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Auswählen…",
  emptyMessage = "Keine Ergebnisse.",
  className = "",
}: ComboboxProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter(
    (o) => !o.disabled && o.label.toLowerCase().includes(query.toLowerCase()),
  );

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClick(e: MouseEvent): void {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setHighlightIndex(-1);
  }, [query]);

  function handleSelect(val: string): void {
    onChange?.(val);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  }

  function handleClear(): void {
    onChange?.("");
    setQuery("");
    inputRef.current?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && highlightIndex >= 0 && filtered[highlightIndex]) {
      e.preventDefault();
      handleSelect(filtered[highlightIndex].value);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex items-center rounded-xl backdrop-blur-sm bg-white/50 dark:bg-white/6 border border-white/60 dark:border-white/10 focus-within:bg-white/70 dark:focus-within:bg-white/10 focus-within:border-indigo-400/50 dark:focus-within:border-indigo-400/30 focus-within:ring-2 focus-within:ring-indigo-400/20 transition-all duration-200">
        <input
          ref={inputRef}
          type="text"
          value={open ? query : selected?.label ?? ""}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm text-(--text) placeholder:text-(--text-muted) px-3 py-2.5 min-w-0"
        />
        {value && (
          <button type="button" onClick={handleClear} className="shrink-0 size-7 flex items-center justify-center text-(--text-muted) hover:text-(--text) transition-colors cursor-pointer">
            <X className="size-3.5" />
          </button>
        )}
        <button type="button" onClick={() => { setOpen(!open); if (!open) inputRef.current?.focus(); }} className="shrink-0 size-9 flex items-center justify-center text-(--text-muted) hover:text-(--text) transition-colors cursor-pointer">
          <ChevronDown className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-white/60 dark:border-white/10 bg-white dark:bg-slate-800 bg-linear-to-br from-white/80 via-white/60 to-white/40 dark:from-white/12 dark:via-white/8 dark:to-white/5 shadow-xl shadow-black/10 dark:shadow-black/40 py-1 max-h-56 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-3 py-2 text-sm text-(--text-muted)">{emptyMessage}</p>
          ) : (
            filtered.map((opt, i) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors cursor-pointer ${
                  i === highlightIndex
                    ? "bg-indigo-500/10 dark:bg-indigo-400/15 text-(--text)"
                    : "text-(--text) hover:bg-white/50 dark:hover:bg-white/8"
                }`}
              >
                <Check className={`size-3.5 shrink-0 ${opt.value === value ? "opacity-100 text-indigo-500" : "opacity-0"}`} />
                {opt.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export type { ComboboxOption };
