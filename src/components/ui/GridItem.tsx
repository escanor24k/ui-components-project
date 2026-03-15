import type { ReactNode } from "react";

type ColSpan = 1 | 2 | 3 | 4 | 5;
type RowSpan = 1 | 2 | 3;

interface ResponsiveColSpan {
  default?: ColSpan;
  sm?: ColSpan;
  md?: ColSpan;
  lg?: ColSpan;
  xl?: ColSpan;
}

interface GridItemProps {
  colSpan?: ColSpan | ResponsiveColSpan;
  rowSpan?: RowSpan;
  children: ReactNode;
  className?: string;
}

const spanClasses: Record<string, Record<ColSpan, string>> = {
  default: { 1: "col-span-1", 2: "col-span-2", 3: "col-span-3", 4: "col-span-4", 5: "col-span-5" },
  sm: { 1: "sm:col-span-1", 2: "sm:col-span-2", 3: "sm:col-span-3", 4: "sm:col-span-4", 5: "sm:col-span-5" },
  md: { 1: "md:col-span-1", 2: "md:col-span-2", 3: "md:col-span-3", 4: "md:col-span-4", 5: "md:col-span-5" },
  lg: { 1: "lg:col-span-1", 2: "lg:col-span-2", 3: "lg:col-span-3", 4: "lg:col-span-4", 5: "lg:col-span-5" },
  xl: { 1: "xl:col-span-1", 2: "xl:col-span-2", 3: "xl:col-span-3", 4: "xl:col-span-4", 5: "xl:col-span-5" },
};

const rowSpanClasses: Record<RowSpan, string> = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
};

function resolveColSpan(colSpan: ColSpan | ResponsiveColSpan): string {
  if (typeof colSpan === "number") return spanClasses.default[colSpan];

  const parts: string[] = [];
  for (const [bp, count] of Object.entries(colSpan)) {
    const map = spanClasses[bp];
    if (map && count) parts.push(map[count as ColSpan]);
  }
  return parts.join(" ");
}

export function GridItem({
  colSpan,
  rowSpan,
  children,
  className = "",
}: GridItemProps): React.ReactElement {
  const classes = [
    colSpan ? resolveColSpan(colSpan) : "",
    rowSpan ? rowSpanClasses[rowSpan] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes || undefined}>{children}</div>;
}

export type { GridItemProps, ResponsiveColSpan, ColSpan, RowSpan };
