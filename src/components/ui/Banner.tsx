"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

interface BannerProps {
  children: ReactNode;
  variant?: "default" | "info" | "success" | "warning" | "error";
  icon?: ReactNode;
  action?: { label: string; onClick: () => void };
  onDismiss?: () => void;
  className?: string;
}

const variantStyles: Record<NonNullable<BannerProps["variant"]>, string> = {
  default:
    "backdrop-blur-xl bg-white/60 dark:bg-white/6 border-white/60 dark:border-white/10 text-(--text)",
  info:
    "backdrop-blur-xl bg-indigo-50/80 dark:bg-indigo-950/30 border-indigo-200/40 dark:border-indigo-400/15 text-indigo-900 dark:text-indigo-200",
  success:
    "backdrop-blur-xl bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200/40 dark:border-emerald-400/15 text-emerald-900 dark:text-emerald-200",
  warning:
    "backdrop-blur-xl bg-amber-50/80 dark:bg-amber-950/30 border-amber-200/40 dark:border-amber-400/15 text-amber-900 dark:text-amber-200",
  error:
    "backdrop-blur-xl bg-rose-50/80 dark:bg-rose-950/30 border-rose-200/40 dark:border-rose-400/15 text-rose-900 dark:text-rose-200",
};

export function Banner({
  children,
  variant = "default",
  icon,
  action,
  onDismiss,
  className = "",
}: BannerProps): React.ReactElement {
  return (
    <div
      role="status"
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-sm ${variantStyles[variant]} ${className}`}
    >
      {icon && <div className="shrink-0">{icon}</div>}
      <div className="flex-1 min-w-0 text-sm font-medium">{children}</div>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="shrink-0 text-sm font-semibold underline underline-offset-2 hover:no-underline cursor-pointer"
        >
          {action.label}
        </button>
      )}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-lg p-1 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
          aria-label="Schließen"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
