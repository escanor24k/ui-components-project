import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  className?: string;
}

const base =
  "w-full rounded-xl px-4 py-2.5 text-sm transition-all duration-200 outline-none " +
  "backdrop-blur-sm bg-white/50 dark:bg-white/6 " +
  "border border-white/60 dark:border-white/10 " +
  "text-(--text) placeholder:text-(--text-muted) " +
  "focus:bg-white/70 dark:focus:bg-white/10 " +
  "focus:border-indigo-400/50 dark:focus:border-indigo-400/30 " +
  "focus:ring-2 focus:ring-indigo-400/20 dark:focus:ring-indigo-400/10 " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

const errorClass =
  "border-red-400/60 dark:border-red-400/30 bg-red-50/30 dark:bg-red-400/5 " +
  "focus:border-red-400/60 dark:focus:border-red-400/30 focus:ring-red-400/20 dark:focus:ring-red-400/10";

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
