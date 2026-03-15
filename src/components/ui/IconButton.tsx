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
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent " +
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
    "hover:bg-glass/50 dark:hover:bg-glass/8 " +
    "active:scale-[0.92]",

  primary:
    "bg-linear-to-br from-primary-400 via-primary-500 to-primary-600 " +
    "text-white shadow-md shadow-primary-500/30 border border-primary-400/30 " +
    "hover:shadow-primary-500/50 hover:from-primary-300 hover:to-primary-500 " +
    "active:scale-[0.92]",

  secondary:
    "backdrop-blur-xl bg-linear-to-br from-glass/70 via-glass/50 to-glass/30 " +
    "dark:from-glass/10 dark:via-glass/6 dark:to-glass/3 " +
    "border border-glass/60 dark:border-glass/10 " +
    "shadow-sm shadow-black/5 dark:shadow-black/20 " +
    "text-(--text-muted) hover:text-(--text) " +
    "active:scale-[0.92]",

  outline:
    "text-(--text-muted) hover:text-(--text) " +
    "border border-glass/60 dark:border-glass/15 " +
    "hover:bg-glass/40 dark:hover:bg-glass/6 " +
    "active:scale-[0.92]",

  danger:
    "bg-danger-500/10 dark:bg-danger-400/10 " +
    "text-danger-600 dark:text-danger-400 " +
    "hover:bg-danger-500/20 dark:hover:bg-danger-400/20 " +
    "active:scale-[0.92]",

  success:
    "bg-success-500/10 dark:bg-success-400/10 " +
    "text-success-600 dark:text-success-400 " +
    "hover:bg-success-500/20 dark:hover:bg-success-400/20 " +
    "active:scale-[0.92]",

  warning:
    "bg-warning-500/10 dark:bg-warning-400/10 " +
    "text-warning-600 dark:text-warning-400 " +
    "hover:bg-warning-500/20 dark:hover:bg-warning-400/20 " +
    "active:scale-[0.92]",

  info:
    "bg-info-500/10 dark:bg-info-400/10 " +
    "text-info-600 dark:text-info-400 " +
    "hover:bg-info-500/20 dark:hover:bg-info-400/20 " +
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
          className={`absolute z-50 px-2 py-1 text-xs font-medium rounded-lg bg-neutral-900 dark:bg-neutral-700 text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 ${tooltipPosition[tooltipSide]}`}
        >
          {tooltip}
        </span>
      )}
    </span>
  ),
);

IconButton.displayName = "IconButton";
