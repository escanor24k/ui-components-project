"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";

interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
  className?: string;
}

const alignMap: Record<NonNullable<PopoverProps["align"]>, string> = {
  start: "left-0",
  center: "left-1/2 -translate-x-1/2",
  end: "right-0",
};

const sideMap: Record<NonNullable<PopoverProps["side"]>, string> = {
  bottom: "top-full mt-2",
  top: "bottom-full mb-2",
};

const panelBase =
  "absolute z-50 min-w-48 p-4 rounded-2xl " +
  "bg-white dark:bg-slate-800 bg-linear-to-br from-white/90 via-white/80 to-white/70 " +
  "dark:from-white/12 dark:via-white/8 dark:to-white/5 " +
  "border border-white/60 dark:border-white/10 " +
  "shadow-xl shadow-black/5 dark:shadow-black/30 " +
  "ring-1 ring-white/40 dark:ring-white/5";

export function Popover({
  trigger,
  children,
  align = "center",
  side = "bottom",
  className = "",
}: PopoverProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent): void {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={containerRef} className={`relative inline-flex ${className}`}>
      <div
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {open && (
        <div className={`${panelBase} ${sideMap[side]} ${alignMap[align]}`}>
          {children}
        </div>
      )}
    </div>
  );
}
