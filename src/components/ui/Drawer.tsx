"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: "left" | "right" | "bottom" | "top";
  size?: "sm" | "md" | "lg" | "full";
  className?: string;
}

interface DrawerHeaderProps {
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

interface DrawerSectionProps {
  children: ReactNode;
  className?: string;
}

const sidePosition: Record<NonNullable<DrawerProps["side"]>, string> = {
  left: "inset-y-0 left-0",
  right: "inset-y-0 right-0",
  top: "inset-x-0 top-0",
  bottom: "inset-x-0 bottom-0",
};

const sideSize: Record<NonNullable<DrawerProps["side"]>, Record<NonNullable<DrawerProps["size"]>, string>> = {
  left: { sm: "w-72", md: "w-96", lg: "w-[32rem]", full: "w-full" },
  right: { sm: "w-72", md: "w-96", lg: "w-[32rem]", full: "w-full" },
  top: { sm: "h-1/4", md: "h-1/3", lg: "h-1/2", full: "h-full" },
  bottom: { sm: "h-1/4", md: "h-1/3", lg: "h-1/2", full: "h-full" },
};

const sideAnimation: Record<NonNullable<DrawerProps["side"]>, string> = {
  left: "animate-[slide-in-left_0.3s_ease-out]",
  right: "animate-[slide-in-right_0.3s_ease-out]",
  top: "animate-[slide-in-top_0.3s_ease-out]",
  bottom: "animate-[slide-in-bottom_0.3s_ease-out]",
};

const panelBase =
  "backdrop-blur-2xl bg-linear-to-br from-white/92 via-white/85 to-white/80 " +
  "dark:from-white/10 dark:via-white/6 dark:to-white/3 " +
  "border-white/60 dark:border-white/10 " +
  "shadow-2xl shadow-black/10 dark:shadow-black/40";

export function Drawer({
  open,
  onClose,
  children,
  side = "right",
  size = "md",
  className = "",
}: DrawerProps): React.ReactElement | null {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const borderSide =
    side === "left" ? "border-r" : side === "right" ? "border-l" : side === "top" ? "border-b" : "border-t";

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`fixed ${sidePosition[side]} ${sideSize[side][size]} ${borderSide} ${panelBase} ${sideAnimation[side]} flex flex-col overflow-y-auto ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function DrawerHeader({
  children,
  onClose,
  className = "",
}: DrawerHeaderProps): React.ReactElement {
  return (
    <div className={`relative px-6 pt-6 pb-0 shrink-0 ${className}`}>
      <div className="text-lg font-semibold text-(--text) pr-8">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 rounded-lg p-1.5 text-(--text-muted) hover:text-(--text) hover:bg-white/40 dark:hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Schließen"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

export function DrawerBody({
  children,
  className = "",
}: DrawerSectionProps): React.ReactElement {
  return (
    <div className={`flex-1 px-6 py-4 overflow-y-auto text-sm text-(--text-muted) ${className}`}>
      {children}
    </div>
  );
}

export function DrawerFooter({
  children,
  className = "",
}: DrawerSectionProps): React.ReactElement {
  return (
    <div className={`px-6 pb-4 pt-4 shrink-0 flex justify-end gap-3 border-t border-white/30 dark:border-white/8 ${className}`}>
      {children}
    </div>
  );
}
