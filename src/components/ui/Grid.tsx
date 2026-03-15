import type { ReactNode } from "react";

type ColCount = 1 | 2 | 3 | 4 | 5;

interface ResponsiveColumns {
  default?: ColCount;
  sm?: ColCount;
  md?: ColCount;
  lg?: ColCount;
  xl?: ColCount;
}

interface GridProps {
  columns?: ColCount | ResponsiveColumns;
  gap?: "none" | "sm" | "md" | "lg" | "xl";
  children: ReactNode;
  className?: string;
}

/* Auto-responsive: scales down gracefully on smaller screens */
const autoResponsive: Record<ColCount, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
};

/* Explicit breakpoint → column-count class mapping */
const colClasses: Record<string, Record<ColCount, string>> = {
  default: { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5" },
  sm: { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4", 5: "sm:grid-cols-5" },
  md: { 1: "md:grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4", 5: "md:grid-cols-5" },
  lg: { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" },
  xl: { 1: "xl:grid-cols-1", 2: "xl:grid-cols-2", 3: "xl:grid-cols-3", 4: "xl:grid-cols-4", 5: "xl:grid-cols-5" },
};

const gapClasses: Record<NonNullable<GridProps["gap"]>, string> = {
  none: "gap-0",
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

function resolveColumns(columns: ColCount | ResponsiveColumns): string {
  if (typeof columns === "number") return autoResponsive[columns];

  const parts: string[] = [];
  for (const [bp, count] of Object.entries(columns)) {
    const map = colClasses[bp];
    if (map && count) parts.push(map[count as ColCount]);
  }
  return parts.join(" ");
}

export function Grid({
  columns = 1,
  gap = "md",
  children,
  className = "",
}: GridProps): React.ReactElement {
  return (
    <div className={`grid ${resolveColumns(columns)} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}

export type { GridProps, ResponsiveColumns, ColCount };
