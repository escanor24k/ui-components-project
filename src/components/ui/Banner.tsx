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
    "backdrop-blur-xl bg-glass/60 dark:bg-glass/6 border-glass/60 dark:border-glass/10 text-(--text)",
  info:
    "backdrop-blur-xl bg-primary-50/80 dark:bg-primary-950/30 border-primary-200/40 dark:border-primary-400/15 text-primary-900 dark:text-primary-200",
  success:
    "backdrop-blur-xl bg-success-50/80 dark:bg-success-950/30 border-success-200/40 dark:border-success-400/15 text-success-900 dark:text-success-200",
  warning:
    "backdrop-blur-xl bg-warning-50/80 dark:bg-warning-950/30 border-warning-200/40 dark:border-warning-400/15 text-warning-900 dark:text-warning-200",
  error:
    "backdrop-blur-xl bg-danger-50/80 dark:bg-danger-950/30 border-danger-200/40 dark:border-danger-400/15 text-danger-900 dark:text-danger-200",
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
