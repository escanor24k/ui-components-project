"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

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
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const selectedOption = options.find((o) => o.value === currentValue);

  useEffect(() => {
    if (!open || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 6, left: rect.left, width: rect.width });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent): void {
      if (
        containerRef.current && !containerRef.current.contains(e.target as Node) &&
        listRef.current && !listRef.current.contains(e.target as Node)
      ) {
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

      {open && createPortal(
        <ul
          ref={listRef}
          role="listbox"
          style={{ top: pos.top, left: pos.left, width: pos.width }}
          className="fixed z-50 rounded-xl border border-glass/60 dark:border-glass/10 bg-(--surface-overlay) bg-linear-to-br from-glass/80 via-glass/60 to-glass/40 dark:from-glass/12 dark:via-glass/8 dark:to-glass/5 shadow-xl shadow-black/10 dark:shadow-black/40 py-1 max-h-64 overflow-y-auto glass-scroll"
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
                      ? "bg-glass/50 dark:bg-glass/10 text-(--text) font-medium cursor-pointer"
                      : "text-(--text) hover:bg-glass/50 dark:hover:bg-glass/8 cursor-pointer",
                ].join(" ")}
              >
                {option.label}
                {isSelected && (
                  <svg
                    className="size-4 text-primary-500 dark:text-primary-400 shrink-0"
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
        </ul>,
        document.body,
      )}
    </div>
  );
}
