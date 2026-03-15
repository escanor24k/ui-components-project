"use client";

import { useState, forwardRef, type InputHTMLAttributes } from "react";
import { Minus, Plus } from "lucide-react";

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange" | "size"> {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap: Record<NonNullable<NumberInputProps["size"]>, { input: string; button: string; icon: string }> = {
  sm: { input: "h-9 text-sm px-2", button: "size-9", icon: "size-3.5" },
  md: { input: "h-11 text-sm px-3", button: "size-11", icon: "size-4" },
  lg: { input: "h-13 text-base px-4", button: "size-13", icon: "size-4.5" },
};

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  {
    value: controlledValue,
    onChange,
    min,
    max,
    step = 1,
    size = "md",
    className = "",
    disabled,
    ...rest
  },
  ref,
): React.ReactElement {
  const [internal, setInternal] = useState(controlledValue ?? 0);
  const current = controlledValue !== undefined ? controlledValue : internal;

  function commit(next: number): void {
    let clamped = next;
    if (min !== undefined) clamped = Math.max(min, clamped);
    if (max !== undefined) clamped = Math.min(max, clamped);
    if (controlledValue === undefined) setInternal(clamped);
    onChange?.(clamped);
  }

  const s = sizeMap[size];
  const canDecrement = min === undefined || current > min;
  const canIncrement = max === undefined || current < max;

  return (
    <div className={`inline-flex items-center rounded-xl backdrop-blur-sm bg-glass/50 dark:bg-glass/6 border border-glass/60 dark:border-glass/10 focus-within:bg-glass/70 dark:focus-within:bg-glass/10 focus-within:border-primary-400/50 dark:focus-within:border-primary-400/30 focus-within:ring-2 focus-within:ring-primary-400/20 transition-all duration-200 ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`}>
      <button
        type="button"
        onClick={() => commit(current - step)}
        disabled={disabled || !canDecrement}
        className={`${s.button} flex items-center justify-center shrink-0 text-(--text-muted) hover:text-(--text) hover:bg-glass/40 dark:hover:bg-glass/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer rounded-l-xl`}
        aria-label="Verringern"
      >
        <Minus className={s.icon} />
      </button>
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={current}
        onChange={(e) => {
          const parsed = Number(e.target.value);
          if (!Number.isNaN(parsed)) commit(parsed);
        }}
        disabled={disabled}
        className={`${s.input} bg-transparent outline-none text-center tabular-nums text-(--text) border-x border-glass/40 dark:border-glass/10 min-w-12`}
        {...rest}
      />
      <button
        type="button"
        onClick={() => commit(current + step)}
        disabled={disabled || !canIncrement}
        className={`${s.button} flex items-center justify-center shrink-0 text-(--text-muted) hover:text-(--text) hover:bg-glass/40 dark:hover:bg-glass/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer rounded-r-xl`}
        aria-label="Erhöhen"
      >
        <Plus className={s.icon} />
      </button>
    </div>
  );
});
