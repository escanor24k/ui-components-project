"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface RatingProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  showValue?: boolean;
  className?: string;
}

const sizes: Record<NonNullable<RatingProps["size"]>, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-7",
};

export function Rating({
  value = 0,
  onChange,
  max = 5,
  size = "md",
  readonly = false,
  showValue = false,
  className = "",
}: RatingProps): React.ReactElement {
  const [hoverValue, setHoverValue] = useState(0);

  const displayValue = hoverValue || value;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: max }, (_, i) => {
        const starIndex = i + 1;
        const isFilled = starIndex <= displayValue;

        return (
          <button
            key={starIndex}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(starIndex)}
            onMouseEnter={() => !readonly && setHoverValue(starIndex)}
            onMouseLeave={() => !readonly && setHoverValue(0)}
            className={`transition-all duration-150 ${
              readonly
                ? "cursor-default"
                : "cursor-pointer hover:scale-110 active:scale-95"
            }`}
            aria-label={`${starIndex} von ${max} Sternen`}
          >
            <Star
              className={`${sizes[size]} transition-colors duration-150 ${
                isFilled
                  ? "fill-amber-400 text-amber-400 drop-shadow-[0_1px_2px_rgba(251,191,36,0.4)]"
                  : "fill-transparent text-white/40 dark:text-white/15"
              }`}
            />
          </button>
        );
      })}
      {showValue && (
        <span className="text-sm font-medium text-(--text-muted) ml-1.5 tabular-nums">
          {value}/{max}
        </span>
      )}
    </div>
  );
}
