import type { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: { value: number; label?: string };
  icon?: ReactNode;
  className?: string;
}

function TrendDisplay({ trend }: { trend: NonNullable<StatCardProps["trend"]> }): React.ReactElement {
  const isPositive = trend.value > 0;
  const isNegative = trend.value < 0;

  const colorClass = isPositive
    ? "text-emerald-600 dark:text-emerald-400"
    : isNegative
      ? "text-rose-600 dark:text-rose-400"
      : "text-(--text-muted)";

  return (
    <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${colorClass}`}>
      {isPositive && <TrendingUp className="size-4" aria-hidden="true" />}
      {isNegative && <TrendingDown className="size-4" aria-hidden="true" />}
      <span>
        {isPositive ? "+" : ""}
        {trend.value}%
      </span>
      {trend.label && (
        <span className="text-(--text-muted) font-normal">{trend.label}</span>
      )}
    </div>
  );
}

export function StatCard({
  label,
  value,
  trend,
  icon,
  className = "",
}: StatCardProps): React.ReactElement {
  return (
    <div
      className={`backdrop-blur-2xl bg-linear-to-br from-white/70 via-white/50 to-white/30 dark:from-white/10 dark:via-white/6 dark:to-white/3 border border-white/60 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/30 rounded-2xl p-6 ${className}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-sm text-(--text-muted) font-medium">{label}</span>
        {icon && (
          <span className="size-5 text-(--text-muted) shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-(--text) mt-2 tabular-nums tracking-tight">
        {value}
      </div>
      {trend && <TrendDisplay trend={trend} />}
    </div>
  );
}
