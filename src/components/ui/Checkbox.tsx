import { forwardRef, type InputHTMLAttributes } from "react";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  className?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", disabled, ...props }, ref) => {
    const content: React.ReactElement = (
      <>
        <input
          ref={ref}
          type="checkbox"
          className="peer sr-only"
          disabled={disabled}
          {...props}
        />
        <span
          className={
            "size-4.5 rounded-md border transition-all duration-200 flex items-center justify-center shrink-0 " +
            "bg-white/50 dark:bg-white/6 border-white/60 dark:border-white/15 shadow-sm shadow-black/8 dark:shadow-black/20 " +
            "peer-checked:bg-indigo-500 dark:peer-checked:bg-indigo-400 peer-checked:border-indigo-400/50 " +
            "peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-400/30 " +
            "peer-checked:[&>svg]:opacity-100 " +
            `${disabled ? "opacity-50 cursor-not-allowed" : ""}`
          }
        >
          <svg
            className="size-3.5 text-white opacity-0 transition-opacity duration-150"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      </>
    );

    if (label) {
      return (
        <label
          className={`flex items-center gap-2.5 ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${className}`}
        >
          {content}
          <span className="text-sm text-(--text)">{label}</span>
        </label>
      );
    }

    return (
      <label
        className={`inline-flex ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${className}`}
      >
        {content}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
