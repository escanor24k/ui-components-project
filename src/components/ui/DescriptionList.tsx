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
      className={`rounded-2xl backdrop-blur-2xl bg-linear-to-br from-glass/70 via-glass/50 to-glass/30 dark:from-glass/10 dark:via-glass/6 dark:to-glass/3 border border-glass/60 dark:border-glass/10 shadow-xl shadow-black/5 dark:shadow-black/30 overflow-hidden divide-y divide-glass/30 dark:divide-glass/8 ${
        columns === 2 ? "sm:grid sm:grid-cols-2 sm:divide-y-0" : ""
      } ${className}`}
    >
      {items.map((item, i) => (
        <div
          key={`${item.label}-${i}`}
          className={`flex justify-between gap-4 px-5 py-3.5 ${
            columns === 2 ? "sm:flex-col sm:gap-1 sm:border-b sm:border-glass/30 dark:sm:border-glass/8" : ""
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
