import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  className?: string;
}

const base =
  "w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 outline-none resize-y min-h-24 " +
  "backdrop-blur-sm bg-white/50 dark:bg-white/6 " +
  "border border-white/60 dark:border-white/10 " +
  "text-(--text) placeholder:text-(--text-muted) " +
  "focus:bg-white/70 dark:focus:bg-white/10 " +
  "focus:border-indigo-400/50 dark:focus:border-indigo-400/30 " +
  "focus:ring-2 focus:ring-indigo-400/20 dark:focus:ring-indigo-400/10 " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

const errorClass =
  "border-red-400/60 dark:border-red-400/30 bg-red-50/30 dark:bg-red-400/5 " +
  "focus:border-red-400/60 dark:focus:border-red-400/30 focus:ring-red-400/20";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className = "", ...props }, ref) => (
    <textarea
      ref={ref}
      className={`${base} ${error ? errorClass : ""} ${className}`}
      aria-invalid={error ? "true" : undefined}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
