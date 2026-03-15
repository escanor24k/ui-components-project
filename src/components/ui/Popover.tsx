"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
  className?: string;
}

const panelBase =
  "fixed z-50 min-w-48 p-4 rounded-2xl " +
  "bg-(--surface-overlay) bg-linear-to-br from-glass/90 via-glass/80 to-glass/70 " +
  "dark:from-glass/12 dark:via-glass/8 dark:to-glass/5 " +
  "border border-glass/60 dark:border-glass/10 " +
  "shadow-xl shadow-black/5 dark:shadow-black/30 " +
  "ring-1 ring-glass/40 dark:ring-glass/5";

export function Popover({
  trigger,
  children,
  align = "center",
  side = "bottom",
  className = "",
}: PopoverProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    let top: number;
    let left: number;

    top = side === "bottom" ? rect.bottom + 8 : rect.top - 8;

    if (align === "start") {
      left = rect.left;
    } else if (align === "end") {
      left = rect.right;
    } else {
      left = rect.left + rect.width / 2;
    }

    setPos({ top, left });
  }, [open, side, align]);

  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent): void {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        (!panelRef.current || !panelRef.current.contains(e.target as Node))
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

      {open && createPortal(
        <div
          ref={panelRef}
          style={(() => {
            const s: React.CSSProperties = {};
            if (side === "bottom") {
              s.top = pos.top;
            } else {
              s.bottom = window.innerHeight - pos.top;
            }
            if (align === "start") {
              s.left = pos.left;
            } else if (align === "end") {
              s.right = window.innerWidth - pos.left;
            } else {
              s.left = pos.left;
              s.transform = "translateX(-50%)";
            }
            return s;
          })()}
          className={panelBase}
        >
          {children}
        </div>,
        document.body
      )}
    </div>
  );
}
