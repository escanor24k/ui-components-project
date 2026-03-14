"use client";

import { useState, useRef, useEffect } from "react";

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const triggerBase =
  "w-full flex items-center justify-between rounded-xl px-4 py-2.5 text-sm transition-all duration-200 outline-none cursor-pointer select-none " +
  "backdrop-blur-sm bg-white/50 dark:bg-white/6 " +
  "border border-white/60 dark:border-white/10 " +
  "text-(--text) " +
  "focus:bg-white/70 dark:focus:bg-white/10 " +
  "focus:border-indigo-400/50 dark:focus:border-indigo-400/30 " +
  "focus:ring-2 focus:ring-indigo-400/20 dark:focus:ring-indigo-400/10 " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

const triggerError =
  "border-red-400/60 dark:border-red-400/30 bg-red-50/30 dark:bg-red-400/5 " +
  "focus:border-red-400/60 dark:focus:border-red-400/30 focus:ring-red-400/20";

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Auswählen…",
  error,
  disabled = false,
  className = "",
  id,
}: DropdownProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const selectedOption = options.find((o) => o.value === currentValue);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent): void {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function handleSelect(option: DropdownOption): void {
    if (option.disabled) return;
    if (!isControlled) setInternalValue(option.value);
    onChange?.(option.value);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>): void {
    const enabledOptions = options.filter((o) => !o.disabled);
    const currentIndex = enabledOptions.findIndex((o) => o.value === currentValue);

    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => !o);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
      } else {
        const next = enabledOptions[currentIndex + 1] ?? enabledOptions[0];
        if (next) handleSelect(next);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
      } else {
        const prev =
          enabledOptions[currentIndex - 1] ?? enabledOptions[enabledOptions.length - 1];
        if (prev) handleSelect(prev);
      }
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={error ? "true" : undefined}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        className={`${triggerBase} ${error ? triggerError : ""}`}
      >
        <span className={selectedOption ? "text-(--text)" : "text-(--text-muted)"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`size-4 opacity-50 transition-transform duration-200 shrink-0 ml-2 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-50 mt-1.5 w-full rounded-xl border border-white/60 dark:border-white/10 bg-white dark:bg-slate-800 bg-linear-to-br from-white/80 via-white/60 to-white/40 dark:from-white/12 dark:via-white/8 dark:to-white/5 shadow-xl shadow-black/10 dark:shadow-black/40 py-1 max-h-64 overflow-y-auto"
        >
          {options.map((option) => {
            const isSelected = option.value === currentValue;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled}
                onClick={() => handleSelect(option)}
                className={[
                  "flex items-center justify-between px-4 py-2.5 text-sm transition-colors",
                  option.disabled
                    ? "opacity-40 cursor-not-allowed text-(--text-muted)"
                    : isSelected
                      ? "bg-white/50 dark:bg-white/10 text-(--text) font-medium cursor-pointer"
                      : "text-(--text) hover:bg-white/50 dark:hover:bg-white/8 cursor-pointer",
                ].join(" ")}
              >
                {option.label}
                {isSelected && (
                  <svg
                    className="size-4 text-indigo-500 dark:text-indigo-400 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
