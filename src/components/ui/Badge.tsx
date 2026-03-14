import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const base =
  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border";

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default:
    "backdrop-blur-sm bg-white/50 dark:bg-white/8 " +
    "border-white/60 dark:border-white/15 text-(--text)",

  success:
    "bg-emerald-500/15 dark:bg-emerald-400/15 border-emerald-500/30 dark:border-emerald-400/20 " +
    "text-emerald-700 dark:text-emerald-300",

  warning:
    "bg-amber-500/15 dark:bg-amber-400/15 border-amber-500/30 dark:border-amber-400/20 " +
    "text-amber-700 dark:text-amber-300",

  danger:
    "bg-red-500/15 dark:bg-red-400/15 border-red-500/30 dark:border-red-400/20 " +
    "text-red-700 dark:text-red-300",

  info:
    "bg-blue-500/15 dark:bg-blue-400/15 border-blue-500/30 dark:border-blue-400/20 " +
    "text-blue-700 dark:text-blue-300",
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
