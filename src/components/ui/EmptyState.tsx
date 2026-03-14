import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps): React.ReactElement {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
      {icon && (
        <div className="size-12 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-xl bg-white/50 dark:bg-white/6 border border-white/60 dark:border-white/10 shadow-sm text-(--text-muted)">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-(--text)">{title}</h3>
      {description && (
        <p className="mt-1.5 text-sm text-(--text-muted) max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
