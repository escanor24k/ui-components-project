import { forwardRef, type ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "ghost"
    | "danger"
    | "primary"
    | "secondary"
    | "outline"
    | "success"
    | "warning"
    | "info";
  size?: "sm" | "md" | "lg";
  tooltip?: string;
  tooltipSide?: "top" | "bottom" | "left" | "right";
  loading?: boolean;
  className?: string;
}

const base =
  "inline-flex items-center justify-center rounded-full transition-all duration-200 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent " +
  "disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

const sizes: Record<NonNullable<IconButtonProps["size"]>, string> = {
  sm: "size-7",
  md: "size-8",
  lg: "size-10",
};

const iconSizes: Record<NonNullable<IconButtonProps["size"]>, string> = {
  sm: "[&>svg]:size-3.5",
  md: "[&>svg]:size-4",
  lg: "[&>svg]:size-5",
};

const variants: Record<NonNullable<IconButtonProps["variant"]>, string> = {
  ghost:
    "text-(--text-muted) hover:text-(--text) " +
    "hover:bg-white/50 dark:hover:bg-white/8 " +
    "active:scale-[0.92]",

  primary:
    "bg-linear-to-br from-indigo-400 via-indigo-500 to-indigo-600 " +
    "text-white shadow-md shadow-indigo-500/30 border border-indigo-400/30 " +
    "hover:shadow-indigo-500/50 hover:from-indigo-300 hover:to-indigo-500 " +
    "active:scale-[0.92]",

  secondary:
    "backdrop-blur-xl bg-linear-to-br from-white/70 via-white/50 to-white/30 " +
    "dark:from-white/10 dark:via-white/6 dark:to-white/3 " +
    "border border-white/60 dark:border-white/10 " +
    "shadow-sm shadow-black/5 dark:shadow-black/20 " +
    "text-(--text-muted) hover:text-(--text) " +
    "active:scale-[0.92]",

  outline:
    "text-(--text-muted) hover:text-(--text) " +
    "border border-white/60 dark:border-white/15 " +
    "hover:bg-white/40 dark:hover:bg-white/6 " +
    "active:scale-[0.92]",

  danger:
    "bg-rose-500/10 dark:bg-rose-400/10 " +
    "text-rose-600 dark:text-rose-400 " +
    "hover:bg-rose-500/20 dark:hover:bg-rose-400/20 " +
    "active:scale-[0.92]",

  success:
    "bg-emerald-500/10 dark:bg-emerald-400/10 " +
    "text-emerald-600 dark:text-emerald-400 " +
    "hover:bg-emerald-500/20 dark:hover:bg-emerald-400/20 " +
    "active:scale-[0.92]",

  warning:
    "bg-amber-500/10 dark:bg-amber-400/10 " +
    "text-amber-600 dark:text-amber-400 " +
    "hover:bg-amber-500/20 dark:hover:bg-amber-400/20 " +
    "active:scale-[0.92]",

  info:
    "bg-blue-500/10 dark:bg-blue-400/10 " +
    "text-blue-600 dark:text-blue-400 " +
    "hover:bg-blue-500/20 dark:hover:bg-blue-400/20 " +
    "active:scale-[0.92]",
};

const tooltipPosition: Record<
  NonNullable<IconButtonProps["tooltipSide"]>,
  string
> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
  left: "right-full top-1/2 -translate-y-1/2 mr-1.5",
  right: "left-full top-1/2 -translate-y-1/2 ml-1.5",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = "ghost",
      size = "md",
      tooltip,
      tooltipSide = "top",
      loading = false,
      className = "",
      children,
      disabled,
      ...props
    },
    ref,
  ) => (
    <span className="relative inline-flex group">
      <button
        ref={ref}
        type="button"
        className={`${base} ${sizes[size]} ${iconSizes[size]} ${variants[variant]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
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
        ) : (
          children
        )}
      </button>
      {tooltip && (
        <span
          className={`absolute z-50 px-2 py-1 text-xs font-medium rounded-lg bg-slate-900 dark:bg-slate-700 text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 ${tooltipPosition[tooltipSide]}`}
        >
          {tooltip}
        </span>
      )}
    </span>
  ),
);

IconButton.displayName = "IconButton";
