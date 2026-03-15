import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  className?: string;
}

const base =
  "w-full rounded-xl px-4 py-2.5 pr-10 text-sm transition-all duration-200 outline-none appearance-none " +
  "backdrop-blur-sm bg-glass/50 dark:bg-glass/6 " +
  "border border-glass/60 dark:border-glass/10 " +
  "text-(--text) " +
  "focus:bg-glass/70 dark:focus:bg-glass/10 " +
  "focus:border-primary-400/50 dark:focus:border-primary-400/30 " +
  "focus:ring-2 focus:ring-primary-400/20 dark:focus:ring-primary-400/10 " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

const errorClass =
  "border-danger-400/60 dark:border-danger-400/30 bg-danger-50/30 dark:bg-danger-400/5 " +
  "focus:border-danger-400/60 dark:focus:border-danger-400/30 focus:ring-danger-400/20";

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className = "", children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={`${base} ${error ? errorClass : ""} ${className}`}
        aria-invalid={error ? "true" : undefined}
        {...props}
      >
        {children}
      </select>
      {/* ChevronDown icon */}
      <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 opacity-50"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  )
);

Select.displayName = "Select";
