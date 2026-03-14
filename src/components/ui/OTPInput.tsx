"use client";

import { useState, useRef, useCallback, type ClipboardEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Delete } from "lucide-react";

interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  masked?: boolean;
  showNumpad?: boolean;
  className?: string;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  masked = false,
  showNumpad = false,
  className = "",
}: OTPInputProps): React.ReactElement {
  const [internalValue, setInternalValue] = useState(() => value ?? "");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = value !== undefined ? value : internalValue;
  const digits = Array.from({ length }, (_, i) => current[i] ?? "");

  const commit = useCallback(
    (next: string): void => {
      const clamped = next.slice(0, length);
      if (value === undefined) setInternalValue(clamped);
      onChange?.(clamped);
    },
    [onChange, value, length],
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const raw = e.target.value.replace(/\D/g, "").slice(0, length);
    commit(raw);
  }

  function handleKeyDown(e: ReactKeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Backspace" && current.length > 0) {
      e.preventDefault();
      commit(current.slice(0, -1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>): void {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pasted) commit(pasted);
  }

  function handleCellClick(index: number): void {
    inputRef.current?.focus();
    const pos = Math.min(index, current.length);
    inputRef.current?.setSelectionRange(pos, pos);
  }

  function insertDigitViaNumpad(digit: string): void {
    if (current.length >= length) return;
    commit(current + digit);
    inputRef.current?.focus();
  }

  function deleteDigitViaNumpad(): void {
    if (current.length === 0) return;
    commit(current.slice(0, -1));
    inputRef.current?.focus();
  }

  const activeIndex = current.length;

  return (
    <div className={className}>
      <div className="relative flex gap-2">
        {/* Single hidden input – password managers see only one field */}
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={current}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          maxLength={length}
          autoComplete="off"
          data-1p-ignore=""
          data-lpignore="true"
          data-bwignore=""
          data-form-type="other"
          aria-label={`${length}-stelliger Code`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ caretColor: "transparent" }}
        />

        {/* Visual cells */}
        {digits.map((digit, i) => (
          <div
            key={i}
            onClick={() => handleCellClick(i)}
            className={`relative size-12 rounded-xl flex items-center justify-center text-lg font-semibold transition-all duration-200 backdrop-blur-sm border shadow-sm shadow-black/5 dark:shadow-black/15 select-none ${
              digit
                ? "bg-white/60 dark:bg-white/8 border-indigo-400/40 dark:border-indigo-400/25 text-(--text)"
                : isFocused && i === activeIndex
                  ? "bg-white/50 dark:bg-white/6 border-indigo-400/30 dark:border-indigo-400/20 text-(--text-muted) ring-2 ring-indigo-400/20"
                  : "bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 text-(--text-muted)"
            }`}
          >
            {digit ? (masked ? "•" : digit) : (
              isFocused && i === activeIndex ? (
                <span className="w-px h-5 bg-(--text-muted) animate-pulse" />
              ) : (
                <span className="size-2 rounded-full bg-white/40 dark:bg-white/10" />
              )
            )}
          </div>
        ))}
      </div>

      {showNumpad && (
        <div className="mt-4 grid grid-cols-3 gap-2 max-w-42">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => insertDigitViaNumpad(String(n))}
              className="h-11 rounded-xl text-base font-semibold backdrop-blur-sm bg-white/50 dark:bg-white/6 border border-white/60 dark:border-white/10 text-(--text) hover:bg-white/70 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              {n}
            </button>
          ))}
          <div />
          <button
            type="button"
            onClick={() => insertDigitViaNumpad("0")}
            className="h-11 rounded-xl text-base font-semibold backdrop-blur-sm bg-white/50 dark:bg-white/6 border border-white/60 dark:border-white/10 text-(--text) hover:bg-white/70 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={deleteDigitViaNumpad}
            className="h-11 rounded-xl flex items-center justify-center backdrop-blur-sm bg-white/50 dark:bg-white/6 border border-white/60 dark:border-white/10 text-(--text-muted) hover:bg-white/70 dark:hover:bg-white/10 hover:text-(--text) active:scale-95 transition-all cursor-pointer"
            aria-label="Löschen"
          >
            <Delete className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}
