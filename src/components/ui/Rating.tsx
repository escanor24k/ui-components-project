"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface RatingProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  allowHalf?: boolean;
  showValue?: boolean;
  className?: string;
}

const sizes: Record<NonNullable<RatingProps["size"]>, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-7",
};

const filledClass =
  "fill-warning-400 text-warning-400 drop-shadow-[0_1px_2px_rgba(251,191,36,0.4)]";
const emptyClass = "fill-transparent text-white/40 dark:text-white/15";

type StarFill = "full" | "half" | "empty";

function getStarFill(starIndex: number, displayValue: number): StarFill {
  if (starIndex <= displayValue) return "full";
  if (starIndex - 0.5 <= displayValue) return "half";
  return "empty";
}

export function Rating({
  value = 0,
  onChange,
  max = 5,
  size = "md",
  readonly = false,
  allowHalf = false,
  showValue = false,
  className = "",
}: RatingProps): React.ReactElement {
  const [hoverValue, setHoverValue] = useState(0);

  const displayValue = hoverValue || value;

  function handleClick(starIndex: number): void {
    onChange?.(starIndex);
  }

  function handleHalf(starIndex: number): void {
    onChange?.(starIndex - 0.5);
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: max }, (_, i) => {
        const starIndex = i + 1;
        const fill = getStarFill(starIndex, displayValue);

        return (
          <span
            key={starIndex}
            className={`relative inline-flex transition-all duration-150 ${
              readonly
                ? "cursor-default"
                : "cursor-pointer hover:scale-110 active:scale-95"
            }`}
          >
            {/* Base empty star */}
            <Star className={`${sizes[size]} transition-colors duration-150 ${fill === "full" ? filledClass : emptyClass}`} />

            {/* Half-star overlay */}
            {fill === "half" && (
              <Star
                className={`${sizes[size]} absolute inset-0 ${filledClass}`}
                style={{ clipPath: "inset(0 50% 0 0)" }}
              />
            )}

            {/* Interactive overlays */}
            {!readonly && (
              allowHalf ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleHalf(starIndex)}
                    onMouseEnter={() => setHoverValue(starIndex - 0.5)}
                    onMouseLeave={() => setHoverValue(0)}
                    className="absolute inset-0 w-1/2 cursor-pointer"
                    aria-label={`${starIndex - 0.5} von ${max} Sternen`}
                  />
                  <button
                    type="button"
                    onClick={() => handleClick(starIndex)}
                    onMouseEnter={() => setHoverValue(starIndex)}
                    onMouseLeave={() => setHoverValue(0)}
                    className="absolute inset-0 left-1/2 w-1/2 cursor-pointer"
                    aria-label={`${starIndex} von ${max} Sternen`}
                  />
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => handleClick(starIndex)}
                  onMouseEnter={() => setHoverValue(starIndex)}
                  onMouseLeave={() => setHoverValue(0)}
                  className="absolute inset-0 cursor-pointer"
                  aria-label={`${starIndex} von ${max} Sternen`}
                />
              )
            )}
          </span>
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
