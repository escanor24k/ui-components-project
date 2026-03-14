"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

interface ModalHeaderProps {
  children: ReactNode;
  className?: string;
  onClose?: () => void;
}

interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

const sizeMap: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

const panelBase =
  "relative w-full rounded-2xl overflow-hidden " +
  "backdrop-blur-2xl bg-linear-to-br from-white/92 via-white/85 to-white/80 " +
  "dark:from-white/10 dark:via-white/6 dark:to-white/3 " +
  "border border-white/70 dark:border-white/10 " +
  "shadow-2xl shadow-black/10 dark:shadow-black/40 " +
  "ring-1 ring-white/50 dark:ring-white/5";

export function Modal({
  open,
  onClose,
  children,
  className = "",
  size = "md",
}: ModalProps): React.ReactElement | null {
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

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`${panelBase} ${sizeMap[size]} ${className}`}>
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function ModalHeader({
  children,
  className = "",
  onClose,
}: ModalHeaderProps): React.ReactElement {
  return (
    <div className={`relative px-6 pt-6 pb-0 ${className}`}>
      <div className="text-lg font-semibold text-(--text) pr-8">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 rounded-lg p-1.5 text-(--text-muted) hover:text-(--text) hover:bg-white/40 dark:hover:bg-white/10 transition-colors"
          aria-label="Schließen"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

export function ModalBody({
  children,
  className = "",
}: ModalBodyProps): React.ReactElement {
  return (
    <div className={`px-6 py-4 text-sm text-(--text-muted) ${className}`}>
      {children}
    </div>
  );
}

export function ModalFooter({
  children,
  className = "",
}: ModalFooterProps): React.ReactElement {
  return (
    <div className={`px-6 pb-6 pt-0 flex justify-end gap-3 ${className}`}>
      {children}
    </div>
  );
}
