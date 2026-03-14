import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  siblingCount?: number;
}

function getPageNumbers(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];

  const leftSibling = Math.max(currentPage - siblingCount, 2);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages - 1);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  if (totalPages <= 1) {
    return [1];
  }

  pages.push(1);

  if (showLeftEllipsis) {
    pages.push("ellipsis");
  } else {
    for (let i = 2; i < leftSibling; i++) {
      pages.push(i);
    }
  }

  for (let i = leftSibling; i <= rightSibling; i++) {
    pages.push(i);
  }

  if (showRightEllipsis) {
    pages.push("ellipsis");
  } else {
    for (let i = rightSibling + 1; i < totalPages; i++) {
      pages.push(i);
    }
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

const buttonBase =
  "size-9 rounded-lg flex items-center justify-center text-sm transition-all cursor-pointer select-none";

const buttonDefault =
  "text-(--text-muted) hover:bg-white/50 dark:hover:bg-white/8 hover:text-(--text)";

const buttonActive =
  "bg-white/60 dark:bg-white/12 text-(--text) font-medium shadow-sm border border-white/50 dark:border-white/10";

const buttonDisabled = "opacity-40 pointer-events-none";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  siblingCount = 1,
}: PaginationProps): React.ReactElement {
  const pages = getPageNumbers(currentPage, totalPages, siblingCount);

  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  return (
    <nav aria-label="Pagination" className={`flex items-center gap-1 ${className}`}>
      <button
        type="button"
        aria-label="Vorherige Seite"
        disabled={isPrevDisabled}
        onClick={(): void => onPageChange(currentPage - 1)}
        className={`${buttonBase} ${buttonDefault} ${isPrevDisabled ? buttonDisabled : ""}`}
      >
        <ChevronLeft className="size-4" />
      </button>

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="size-9 flex items-center justify-center text-sm text-(--text-muted) select-none"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            aria-label={`Seite ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            onClick={(): void => onPageChange(page)}
            className={`${buttonBase} ${page === currentPage ? buttonActive : buttonDefault}`}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="Naechste Seite"
        disabled={isNextDisabled}
        onClick={(): void => onPageChange(currentPage + 1)}
        className={`${buttonBase} ${buttonDefault} ${isNextDisabled ? buttonDisabled : ""}`}
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
