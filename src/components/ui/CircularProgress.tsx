interface CircularProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "danger";
  showValue?: boolean;
  strokeWidth?: number;
  className?: string;
}

const sizeMap: Record<NonNullable<CircularProgressProps["size"]>, number> = {
  sm: 48,
  md: 64,
  lg: 96,
};

const textSizeMap: Record<NonNullable<CircularProgressProps["size"]>, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-xl",
};

const colorMap: Record<NonNullable<CircularProgressProps["variant"]>, string> = {
  default: "stroke-primary-500 dark:stroke-primary-400",
  success: "stroke-success-500 dark:stroke-success-400",
  warning: "stroke-warning-500 dark:stroke-warning-400",
  danger: "stroke-danger-500 dark:stroke-danger-400",
};

export function CircularProgress({
  value,
  max = 100,
  size = "md",
  variant = "default",
  showValue = false,
  strokeWidth = 4,
  className = "",
}: CircularProgressProps): React.ReactElement {
  const clamped = Math.min(Math.max(value, 0), max);
  const percentage = max > 0 ? Math.round((clamped / max) * 100) : 0;
  const dim = sizeMap[size];
  const radius = (dim - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={max}>
      <svg width={dim} height={dim} className="-rotate-90">
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-glass/30 dark:stroke-glass/10"
        />
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`transition-all duration-500 ease-out ${colorMap[variant]}`}
        />
      </svg>
      {showValue && (
        <span className={`absolute font-semibold text-(--text) ${textSizeMap[size]}`}>
          {percentage}%
        </span>
      )}
    </div>
  );
}
