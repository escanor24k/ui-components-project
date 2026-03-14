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
  default: "border-white/60 dark:border-white/10",
  success: "border-emerald-300/40 dark:border-emerald-400/20",
  warning: "border-amber-300/40 dark:border-amber-400/20",
  error: "border-rose-300/40 dark:border-rose-400/20",
  info: "border-indigo-300/40 dark:border-indigo-400/20",
};

const variantIcon: Record<NonNullable<ToastData["variant"]>, ReactNode> = {
  default: null,
  success: (
    <svg className="size-5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  warning: (
    <svg className="size-5 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4M12 17h.01" />
    </svg>
  ),
  error: (
    <svg className="size-5 text-rose-600 dark:text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" />
    </svg>
  ),
  info: (
    <svg className="size-5 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      className={`w-80 rounded-xl p-4 backdrop-blur-2xl bg-linear-to-br from-white/92 via-white/85 to-white/80 dark:from-white/12 dark:via-white/8 dark:to-white/5 border ${variantBorder[v]} shadow-xl shadow-black/8 dark:shadow-black/30 ring-1 ring-white/40 dark:ring-white/5 animate-[toast-in_0.3s_ease-out]`}
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
              className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="shrink-0 size-7 flex items-center justify-center rounded-lg text-(--text-muted) hover:text-(--text) hover:bg-white/40 dark:hover:bg-white/10 transition-colors cursor-pointer"
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
