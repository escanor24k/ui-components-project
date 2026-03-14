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
    bg: "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300 border-emerald-500/15 dark:border-emerald-400/15",
    label: "Neu",
  },
  fix: {
    bg: "bg-rose-500/15 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300 border-rose-500/15 dark:border-rose-400/15",
    label: "Fix",
  },
  improvement: {
    bg: "bg-indigo-500/15 text-indigo-700 dark:bg-indigo-400/15 dark:text-indigo-300 border-indigo-500/15 dark:border-indigo-400/15",
    label: "Verbesserung",
  },
  breaking: {
    bg: "bg-amber-500/15 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300 border-amber-500/15 dark:border-amber-400/15",
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
      className={`rounded-2xl p-5 backdrop-blur-2xl bg-linear-to-br from-white/70 via-white/50 to-white/30 dark:from-white/10 dark:via-white/6 dark:to-white/3 border border-white/60 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/30 ${className}`}
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
