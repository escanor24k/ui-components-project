import type { HTMLAttributes } from "react";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  className?: string;
}

const variants: Record<
  NonNullable<AlertProps["variant"]>,
  { container: string; icon: React.ReactElement }
> = {
  info: {
    container:
      "backdrop-blur-sm bg-info-500/10 dark:bg-info-400/10 " +
      "border border-info-500/25 dark:border-info-400/20 text-info-800 dark:text-info-200",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  },
  success: {
    container:
      "backdrop-blur-sm bg-success-500/10 dark:bg-success-400/10 " +
      "border border-success-500/25 dark:border-success-400/20 text-success-800 dark:text-success-200",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  warning: {
    container:
      "backdrop-blur-sm bg-warning-500/10 dark:bg-warning-400/10 " +
      "border border-warning-500/25 dark:border-warning-400/20 text-warning-800 dark:text-warning-200",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    ),
  },
  error: {
    container:
      "backdrop-blur-sm bg-danger-500/10 dark:bg-danger-400/10 " +
      "border border-danger-500/25 dark:border-danger-400/20 text-danger-800 dark:text-danger-200",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6M9 9l6 6" />
      </svg>
    ),
  },
};

export function Alert({
  variant = "info",
  title,
  className = "",
  children,
  ...props
}: AlertProps): React.ReactElement {
  const { container, icon } = variants[variant];

  return (
    <div
      role="alert"
      className={`flex gap-3 rounded-xl p-4 ${container} ${className}`}
      {...props}
    >
      <div className="mt-0.5 size-5 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-semibold leading-tight mb-1">{title}</p>
        )}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
}
