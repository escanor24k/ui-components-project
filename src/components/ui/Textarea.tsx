import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  className?: string;
}

const base =
  "w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 outline-none resize-y min-h-24 " +
  "backdrop-blur-sm bg-glass/50 dark:bg-glass/6 " +
  "border border-glass/60 dark:border-glass/10 " +
  "text-(--text) placeholder:text-(--text-muted) " +
  "focus:bg-glass/70 dark:focus:bg-glass/10 " +
  "focus:border-primary-400/50 dark:focus:border-primary-400/30 " +
  "focus:ring-2 focus:ring-primary-400/20 dark:focus:ring-primary-400/10 " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

const errorClass =
  "border-danger-400/60 dark:border-danger-400/30 bg-danger-50/30 dark:bg-danger-400/5 " +
  "focus:border-danger-400/60 dark:focus:border-danger-400/30 focus:ring-danger-400/20";

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
