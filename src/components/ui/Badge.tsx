import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const base =
  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border";

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default:
    "backdrop-blur-sm bg-glass/50 dark:bg-glass/8 " +
    "border-glass/60 dark:border-glass/15 text-(--text)",

  success:
    "bg-success-500/15 dark:bg-success-400/15 border-success-500/30 dark:border-success-400/20 " +
    "text-success-700 dark:text-success-300",

  warning:
    "bg-warning-500/15 dark:bg-warning-400/15 border-warning-500/30 dark:border-warning-400/20 " +
    "text-warning-700 dark:text-warning-300",

  danger:
    "bg-danger-500/15 dark:bg-danger-400/15 border-danger-500/30 dark:border-danger-400/20 " +
    "text-danger-700 dark:text-danger-300",

  info:
    "bg-info-500/15 dark:bg-info-400/15 border-info-500/30 dark:border-info-400/20 " +
    "text-info-700 dark:text-info-300",
};

export function Badge({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps): React.ReactElement {
  return (
    <span className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
