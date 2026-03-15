import { Avatar } from "@/components/ui/Avatar";

interface TestimonialCardProps {
  quote: string;
  author: {
    name: string;
    role?: string;
    avatar?: string;
  };
  rating?: number;
  className?: string;
}

export function TestimonialCard({
  quote,
  author,
  rating,
  className = "",
}: TestimonialCardProps): React.ReactElement {
  return (
    <div
      className={`rounded-2xl p-6 backdrop-blur-2xl bg-linear-to-br from-glass/70 via-glass/50 to-glass/30 dark:from-glass/10 dark:via-glass/6 dark:to-glass/3 border border-glass/60 dark:border-glass/10 shadow-xl shadow-black/5 dark:shadow-black/30 ${className}`}
    >
      {rating !== undefined && (
        <div className="flex items-center gap-0.5 mb-3">
          {Array.from({ length: 5 }, (_, i) => (
            <svg
              key={i}
              className={`size-4 ${
                i < rating
                  ? "fill-warning-400 text-warning-400"
                  : "fill-transparent text-glass/30 dark:text-glass/10"
              }`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
      )}

      <blockquote className="text-sm leading-relaxed text-(--text) italic">
        &ldquo;{quote}&rdquo;
      </blockquote>

      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-glass/30 dark:border-glass/8">
        <Avatar name={author.name} src={author.avatar ?? null} size="sm" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-(--text) truncate">{author.name}</p>
          {author.role && (
            <p className="text-xs text-(--text-muted) truncate">{author.role}</p>
          )}
        </div>
      </div>
    </div>
  );
}
