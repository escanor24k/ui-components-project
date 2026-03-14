import type { ReactNode } from "react";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

const positionMap: Record<NonNullable<TooltipProps["side"]>, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const tooltipBase =
  "absolute z-50 px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap " +
  "bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs " +
  "opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150";

export function Tooltip({
  content,
  children,
  side = "top",
  className = "",
}: TooltipProps): React.ReactElement {
  return (
    <span className={`relative inline-flex group ${className}`}>
      {children}
      <span className={`${tooltipBase} ${positionMap[side]}`}>{content}</span>
    </span>
  );
}
