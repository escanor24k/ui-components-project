import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  className?: string;
}

const base =
  "w-full rounded-xl px-4 py-2.5 text-sm transition-all duration-200 outline-none " +
  "backdrop-blur-sm bg-glass/50 dark:bg-glass/6 " +
  "border border-glass/60 dark:border-glass/10 " +
  "text-(--text) placeholder:text-(--text-muted) " +
  "focus:bg-glass/70 dark:focus:bg-glass/10 " +
  "focus:border-primary-400/50 dark:focus:border-primary-400/30 " +
  "focus:ring-2 focus:ring-primary-400/20 dark:focus:ring-primary-400/10 " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

const errorClass =
  "border-danger-400/60 dark:border-danger-400/30 bg-danger-50/30 dark:bg-danger-400/5 " +
  "focus:border-danger-400/60 dark:focus:border-danger-400/30 focus:ring-danger-400/20 dark:focus:ring-danger-400/10";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`${base} ${error ? errorClass : ""} ${className}`}
      aria-invalid={error ? "true" : undefined}
      {...props}
    />
  )
);

Input.displayName = "Input";
