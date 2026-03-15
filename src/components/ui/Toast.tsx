"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
  icon?: ReactNode;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToasterProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  className?: string;
}

const positions: Record<NonNullable<ToasterProps["position"]>, string> = {
  "top-right": "top-4 right-4 items-end",
  "top-left": "top-4 left-4 items-start",
  "bottom-right": "bottom-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
};

const variantBorder: Record<NonNullable<ToastData["variant"]>, string> = {
  default: "border-glass/60 dark:border-glass/10",
  success: "border-success-300/40 dark:border-success-400/20",
  warning: "border-warning-300/40 dark:border-warning-400/20",
  error: "border-danger-300/40 dark:border-danger-400/20",
  info: "border-primary-300/40 dark:border-primary-400/20",
};

const variantIcon: Record<NonNullable<ToastData["variant"]>, ReactNode> = {
  default: null,
  success: (
    <svg className="size-5 text-success-600 dark:text-success-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  warning: (
    <svg className="size-5 text-warning-600 dark:text-warning-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4M12 17h.01" />
    </svg>
  ),
  error: (
    <svg className="size-5 text-danger-600 dark:text-danger-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" />
    </svg>
  ),
  info: (
    <svg className="size-5 text-primary-600 dark:text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
};

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastData;
  onDismiss: (id: string) => void;
}): React.ReactElement {
  const v = toast.variant ?? "default";
  const icon = toast.icon !== undefined ? toast.icon : variantIcon[v];
  const duration = toast.duration ?? 5000;

  useEffect(() => {
    if (duration <= 0) return;
    const t = setTimeout(() => onDismiss(toast.id), duration);
    return () => clearTimeout(t);
  }, [toast.id, duration, onDismiss]);

  return (
    <div
      role="alert"
      className={`w-80 rounded-xl p-4 backdrop-blur-2xl bg-linear-to-br from-glass/92 via-glass/85 to-glass/80 dark:from-glass/12 dark:via-glass/8 dark:to-glass/5 border ${variantBorder[v]} shadow-xl shadow-black/8 dark:shadow-black/30 ring-1 ring-glass/40 dark:ring-glass/5 animate-[toast-in_0.3s_ease-out]`}
    >
      <div className="flex gap-3">
        {icon && <div className="mt-0.5 shrink-0">{icon}</div>}
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className="text-sm font-semibold text-(--text) leading-tight">{toast.title}</p>
          )}
          {toast.description && (
            <p className={`text-sm text-(--text-muted) ${toast.title ? "mt-1" : ""}`}>
              {toast.description}
            </p>
          )}
          {toast.action && (
            <button
              type="button"
              onClick={toast.action.onClick}
              className="mt-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline cursor-pointer"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="shrink-0 size-7 flex items-center justify-center rounded-lg text-(--text-muted) hover:text-(--text) hover:bg-glass/40 dark:hover:bg-glass/10 transition-colors cursor-pointer"
          aria-label="Schließen"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

export type { ToastData };

export function Toaster({
  toasts,
  onDismiss,
  position = "top-right",
  className = "",
}: ToasterProps): React.ReactElement | null {
  if (toasts.length === 0) return null;

  return createPortal(
    <div className={`fixed z-[100] flex flex-col gap-2 ${positions[position]} ${className}`}>
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body,
  );
}
