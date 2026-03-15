import { forwardRef, type InputHTMLAttributes } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  onClear?: () => void;
  className?: string;
}

const base =
  "w-full rounded-xl pl-10 pr-9 py-2.5 text-sm transition-all duration-200 outline-none " +
  "backdrop-blur-sm bg-glass/50 dark:bg-glass/6 " +
  "border border-glass/60 dark:border-glass/10 " +
  "text-(--text) placeholder:text-(--text-muted) " +
  "focus:bg-glass/70 dark:focus:bg-glass/10 " +
  "focus:border-primary-400/50 dark:focus:border-primary-400/30 " +
  "focus:ring-2 focus:ring-primary-400/20 dark:focus:ring-primary-400/10 " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, className = "", value, ...props }, ref) => {
    const hasValue = value !== undefined && value !== "";

    return (
      <div className={`relative ${className}`}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-(--text-muted) pointer-events-none" />
        <input
          ref={ref}
          type="search"
          value={value}
          className={base}
          {...props}
        />
        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text) cursor-pointer transition-colors"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
