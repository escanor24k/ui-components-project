"use client";

import { forwardRef, useState, useRef, useCallback, useEffect, type InputHTMLAttributes } from "react";

interface RangeSliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  showLabel?: boolean;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  haptic?: boolean;
  className?: string;
}

export const RangeSlider = forwardRef<HTMLInputElement, RangeSliderProps>(
  (
    {
      showLabel = false,
      showValue = false,
      formatValue,
      haptic = true,
      className = "",
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue,
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(
      Number(value ?? defaultValue ?? min)
    );
    const trackRef = useRef<HTMLDivElement>(null);
    const [isActive, setIsActive] = useState(false);

    const currentValue = value !== undefined ? Number(value) : internalValue;
    const minNum = Number(min);
    const maxNum = Number(max);
    const percentage =
      maxNum > minNum ? ((currentValue - minNum) / (maxNum - minNum)) * 100 : 0;

    const displayValue = formatValue
      ? formatValue(currentValue)
      : String(currentValue);

    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(Number(value));
      }
    }, [value]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>): void => {
        const newVal = Number(e.target.value);
        if (value === undefined) setInternalValue(newVal);
        onChange?.(e);
      },
      [value, onChange]
    );

    return (
      <div className={`w-full ${className}`}>
        {(showLabel || showValue) && (
          <div className="flex items-center justify-between mb-2">
            {showLabel && props["aria-label"] && (
              <span className="text-xs font-medium text-(--text-muted)">
                {props["aria-label"]}
              </span>
            )}
            {showValue && (
              <span className="text-xs font-medium text-(--text) tabular-nums ml-auto">
                {displayValue}
              </span>
            )}
          </div>
        )}
        <div className="relative" ref={trackRef}>
          {/* Track background */}
          <div className="h-2 rounded-full bg-glass/30 dark:bg-glass/8 border border-glass/40 dark:border-glass/10 shadow-inner">
            {/* Fill */}
            <div
              className={`h-full rounded-full transition-all ${isActive ? "duration-0" : "duration-150"} bg-linear-to-r from-primary-400 to-primary-500 shadow-sm shadow-primary-500/30`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Thumb indicator (visual overlay for haptic feedback) */}
          {haptic && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-transform ${isActive ? "scale-125 duration-100" : "scale-100 duration-200"}`}
              style={{ left: `${percentage}%` }}
            >
              <div
                className={`size-5 rounded-full bg-(--surface-overlay) border-2 border-primary-400 dark:border-primary-400 shadow-md shadow-primary-500/20 transition-shadow ${isActive ? "shadow-lg shadow-primary-500/40 ring-4 ring-primary-400/15" : ""}`}
              />
            </div>
          )}

          {/* Native range input (invisible, on top) */}
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentValue}
            onChange={handleChange}
            onMouseDown={() => setIsActive(true)}
            onMouseUp={() => setIsActive(false)}
            onTouchStart={() => setIsActive(true)}
            onTouchEnd={() => setIsActive(false)}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            {...props}
          />
        </div>
      </div>
    );
  }
);

RangeSlider.displayName = "RangeSlider";
