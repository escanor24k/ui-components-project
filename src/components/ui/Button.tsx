import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  className?: string;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent " +
  "disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-linear-to-br from-primary-400 via-primary-500 to-primary-600 " +
    "text-white shadow-lg shadow-primary-500/40 border border-primary-400/30 " +
    "hover:shadow-primary-500/60 hover:from-primary-300 hover:to-primary-500 " +
    "active:scale-[0.98]",

  secondary:
    "backdrop-blur-xl bg-linear-to-br from-glass/70 via-glass/50 to-glass/30 " +
    "dark:from-glass/10 dark:via-glass/6 dark:to-glass/3 " +
    "border border-glass/60 dark:border-glass/10 " +
    "shadow-sm shadow-black/5 dark:shadow-black/20 " +
    "text-(--text) hover:from-glass/80 hover:to-glass/40 " +
    "dark:hover:from-glass/15 dark:hover:to-glass/5 active:scale-[0.98]",

  ghost:
    "text-(--text) hover:bg-glass/50 dark:hover:bg-glass/8 " +
    "border border-transparent hover:border-glass/40 dark:hover:border-glass/10 " +
    "active:scale-[0.98]",

  danger:
    "bg-linear-to-br from-danger-400/80 via-danger-500/80 to-danger-500/80 " +
    "text-white shadow-md shadow-danger-500/25 border border-danger-400/30 backdrop-blur-sm " +
    "hover:shadow-danger-500/40 hover:from-danger-300/90 hover:to-danger-500/90 " +
    "active:scale-[0.98]",

  success:
    "bg-linear-to-br from-success-400/80 via-success-500/80 to-success-500/80 " +
    "text-white shadow-md shadow-success-500/25 border border-success-400/30 backdrop-blur-sm " +
    "hover:shadow-success-500/40 hover:from-success-300/90 hover:to-success-500/90 " +
    "active:scale-[0.98]",

  outline:
    "backdrop-blur-sm bg-transparent hover:bg-glass/40 dark:hover:bg-glass/6 " +
    "text-(--text) border border-glass/60 dark:border-glass/15 " +
    "active:scale-[0.98]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin size-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  )
);

Button.displayName = "Button";
