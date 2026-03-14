import { forwardRef, type InputHTMLAttributes } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  onClear?: () => void;
  className?: string;
}

const base =
  "w-full rounded-xl pl-10 pr-9 py-2.5 text-sm transition-all duration-200 outline-none " +
  "backdrop-blur-sm bg-white/50 dark:bg-white/6 " +
  "border border-white/60 dark:border-white/10 " +
  "text-(--text) placeholder:text-(--text-muted) " +
  "focus:bg-white/70 dark:focus:bg-white/10 " +
  "focus:border-indigo-400/50 dark:focus:border-indigo-400/30 " +
  "focus:ring-2 focus:ring-indigo-400/20 dark:focus:ring-indigo-400/10 " +
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
