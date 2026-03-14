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
    "bg-linear-to-r from-indigo-400 to-indigo-500 shadow-sm shadow-indigo-500/30",
  success:
    "bg-linear-to-r from-emerald-400 to-emerald-500 shadow-sm shadow-emerald-500/30",
  warning:
    "bg-linear-to-r from-amber-400 to-amber-500 shadow-sm shadow-amber-500/30",
  danger:
    "bg-linear-to-r from-rose-400 to-rose-500 shadow-sm shadow-rose-500/30",
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
        className={`flex-1 rounded-full overflow-hidden bg-white/30 dark:bg-white/8 border border-white/40 dark:border-white/10 ${sizeMap[size]}`}
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
