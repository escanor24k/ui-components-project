import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  className?: string;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent " +
  "disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-linear-to-br from-indigo-400 via-indigo-500 to-indigo-600 " +
    "text-white shadow-lg shadow-indigo-500/40 border border-indigo-400/30 " +
    "hover:shadow-indigo-500/60 hover:from-indigo-300 hover:to-indigo-500 " +
    "active:scale-[0.98]",

  secondary:
    "backdrop-blur-xl bg-linear-to-br from-white/70 via-white/50 to-white/30 " +
    "dark:from-white/10 dark:via-white/6 dark:to-white/3 " +
    "border border-white/60 dark:border-white/10 " +
    "shadow-sm shadow-black/5 dark:shadow-black/20 " +
    "text-(--text) hover:from-white/80 hover:to-white/40 " +
    "dark:hover:from-white/15 dark:hover:to-white/5 active:scale-[0.98]",

  ghost:
    "text-(--text) hover:bg-white/50 dark:hover:bg-white/8 " +
    "border border-transparent hover:border-white/40 dark:hover:border-white/10 " +
    "active:scale-[0.98]",

  danger:
    "bg-linear-to-br from-rose-400/80 via-rose-500/80 to-red-500/80 " +
    "text-white shadow-md shadow-rose-500/25 border border-rose-400/30 backdrop-blur-sm " +
    "hover:shadow-rose-500/40 hover:from-rose-300/90 hover:to-red-500/90 " +
    "active:scale-[0.98]",

  success:
    "bg-linear-to-br from-emerald-400/80 via-emerald-500/80 to-teal-500/80 " +
    "text-white shadow-md shadow-emerald-500/25 border border-emerald-400/30 backdrop-blur-sm " +
    "hover:shadow-emerald-500/40 hover:from-emerald-300/90 hover:to-teal-500/90 " +
    "active:scale-[0.98]",

  outline:
    "backdrop-blur-sm bg-transparent hover:bg-white/40 dark:hover:bg-white/6 " +
    "text-(--text) border border-white/60 dark:border-white/15 " +
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
