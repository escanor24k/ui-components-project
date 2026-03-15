"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

const sizeStyles: Record<NonNullable<CopyButtonProps["size"]>, string> = {
  sm: "h-7 px-2 text-xs gap-1.5",
  md: "h-9 px-3 text-sm gap-2",
};

const iconSizes: Record<NonNullable<CopyButtonProps["size"]>, string> = {
  sm: "size-3",
  md: "size-3.5",
};

export function CopyButton({
  text,
  label,
  size = "md",
  className = "",
}: CopyButtonProps): React.ReactElement {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async (): Promise<void> => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 cursor-pointer backdrop-blur-sm border ${
        copied
          ? "bg-success-500/10 dark:bg-success-400/15 border-success-500/20 dark:border-success-400/20 text-success-600 dark:text-success-400"
          : "bg-glass/50 dark:bg-glass/6 border-glass/60 dark:border-glass/10 text-(--text-muted) hover:text-(--text) hover:bg-glass/70 dark:hover:bg-glass/10"
      } ${sizeStyles[size]} ${className}`}
    >
      {copied ? (
        <Check className={iconSizes[size]} />
      ) : (
        <Copy className={iconSizes[size]} />
      )}
      {label ?? (copied ? "Kopiert!" : "Kopieren")}
    </button>
  );
}
