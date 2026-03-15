import type { ReactNode } from "react";

interface ChangelogEntryProps {
  version: string;
  date: string;
  badge: "new" | "fix" | "improvement" | "breaking";
  title: string;
  children?: ReactNode;
  className?: string;
}

const badgeStyles: Record<ChangelogEntryProps["badge"], { bg: string; label: string }> = {
  new: {
    bg: "bg-success-500/15 text-success-700 dark:bg-success-400/15 dark:text-success-300 border-success-500/15 dark:border-success-400/15",
    label: "Neu",
  },
  fix: {
    bg: "bg-danger-500/15 text-danger-700 dark:bg-danger-400/15 dark:text-danger-300 border-danger-500/15 dark:border-danger-400/15",
    label: "Fix",
  },
  improvement: {
    bg: "bg-primary-500/15 text-primary-700 dark:bg-primary-400/15 dark:text-primary-300 border-primary-500/15 dark:border-primary-400/15",
    label: "Verbesserung",
  },
  breaking: {
    bg: "bg-warning-500/15 text-warning-700 dark:bg-warning-400/15 dark:text-warning-300 border-warning-500/15 dark:border-warning-400/15",
    label: "Breaking",
  },
};

export function ChangelogEntry({
  version,
  date,
  badge,
  title,
  children,
  className = "",
}: ChangelogEntryProps): React.ReactElement {
  const b = badgeStyles[badge];

  return (
    <article
      className={`rounded-2xl p-5 backdrop-blur-2xl bg-linear-to-br from-glass/70 via-glass/50 to-glass/30 dark:from-glass/10 dark:via-glass/6 dark:to-glass/3 border border-glass/60 dark:border-glass/10 shadow-xl shadow-black/5 dark:shadow-black/30 ${className}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs font-mono font-semibold text-(--text-muted)">{version}</span>
        <span className="text-xs text-(--text-muted)">·</span>
        <span className="text-xs text-(--text-muted)">{date}</span>
        <span
          className={`ml-auto inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold border ${b.bg}`}
        >
          {b.label}
        </span>
      </div>
      <h3 className="text-sm font-semibold text-(--text)">{title}</h3>
      {children && (
        <div className="mt-2 text-sm text-(--text-muted) leading-relaxed">{children}</div>
      )}
    </article>
  );
}
