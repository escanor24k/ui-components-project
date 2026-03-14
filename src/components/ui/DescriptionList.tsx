import type { ReactNode } from "react";

interface DescriptionItem {
  label: string;
  value: ReactNode;
}

interface DescriptionListProps {
  items: DescriptionItem[];
  columns?: 1 | 2;
  className?: string;
}

export function DescriptionList({
  items,
  columns = 1,
  className = "",
}: DescriptionListProps): React.ReactElement {
  return (
    <dl
      className={`rounded-2xl backdrop-blur-2xl bg-linear-to-br from-white/70 via-white/50 to-white/30 dark:from-white/10 dark:via-white/6 dark:to-white/3 border border-white/60 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/30 overflow-hidden divide-y divide-white/30 dark:divide-white/8 ${
        columns === 2 ? "sm:grid sm:grid-cols-2 sm:divide-y-0" : ""
      } ${className}`}
    >
      {items.map((item, i) => (
        <div
          key={`${item.label}-${i}`}
          className={`flex justify-between gap-4 px-5 py-3.5 ${
            columns === 2 ? "sm:flex-col sm:gap-1 sm:border-b sm:border-white/30 dark:sm:border-white/8" : ""
          }`}
        >
          <dt className="text-sm text-(--text-muted) shrink-0">{item.label}</dt>
          <dd className={`text-sm font-medium text-(--text) ${columns === 1 ? "text-right" : ""}`}>
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
