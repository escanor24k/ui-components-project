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
      "backdrop-blur-sm bg-blue-500/10 dark:bg-blue-400/10 " +
      "border border-blue-500/25 dark:border-blue-400/20 text-blue-800 dark:text-blue-200",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  },
  success: {
    container:
      "backdrop-blur-sm bg-emerald-500/10 dark:bg-emerald-400/10 " +
      "border border-emerald-500/25 dark:border-emerald-400/20 text-emerald-800 dark:text-emerald-200",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  warning: {
    container:
      "backdrop-blur-sm bg-amber-500/10 dark:bg-amber-400/10 " +
      "border border-amber-500/25 dark:border-amber-400/20 text-amber-800 dark:text-amber-200",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    ),
  },
  error: {
    container:
      "backdrop-blur-sm bg-red-500/10 dark:bg-red-400/10 " +
      "border border-red-500/25 dark:border-red-400/20 text-red-800 dark:text-red-200",
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
