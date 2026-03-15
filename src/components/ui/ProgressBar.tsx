interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showInnerLabel?: boolean;
  className?: string;
}

const sizeMap: Record<NonNullable<ProgressBarProps["size"]>, string> = {
  sm: "h-3",
  md: "h-5",
  lg: "h-7",
};

const variantMap: Record<NonNullable<ProgressBarProps["variant"]>, string> = {
  default:
    "bg-linear-to-r from-primary-400 to-primary-500 shadow-sm shadow-primary-500/30",
  success:
    "bg-linear-to-r from-success-400 to-success-500 shadow-sm shadow-success-500/30",
  warning:
    "bg-linear-to-r from-warning-400 to-warning-500 shadow-sm shadow-warning-500/30",
  danger:
    "bg-linear-to-r from-danger-400 to-danger-500 shadow-sm shadow-danger-500/30",
};

export function ProgressBar({
  value,
  max = 100,
  variant = "default",
  size = "md",
  showLabel = false,
  showInnerLabel = false,
  className = "",
}: ProgressBarProps): React.ReactElement {
  const clamped = Math.min(Math.max(value, 0), max);
  const percentage = max > 0 ? Math.round((clamped / max) * 100) : 0;
  const canShowInner = showInnerLabel && size !== "sm";

  return (
    <div
      className={`w-full flex items-center gap-3 ${className}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={`flex-1 rounded-full overflow-hidden bg-glass/30 dark:bg-glass/8 border border-glass/40 dark:border-glass/10 ${sizeMap[size]}`}
      >
        <div
          className={`rounded-full h-full transition-all duration-500 ease-out ${variantMap[variant]} ${canShowInner ? "flex items-center justify-end min-w-8" : ""}`}
          style={{ width: `${percentage}%` }}
        >
          {canShowInner && (
            <span className={`font-semibold text-white drop-shadow-sm px-2 ${size === "lg" ? "text-xs" : "text-[10px]"}`}>
              {percentage}%
            </span>
          )}
        </div>
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-(--text-muted) tabular-nums">
          {percentage}%
        </span>
      )}
    </div>
  );
}
