"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language,
  showLineNumbers = false,
  className = "",
}: CodeBlockProps): React.ReactElement {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async (): Promise<void> => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const lines = code.split("\n");

  return (
    <div className={`relative rounded-2xl overflow-hidden backdrop-blur-2xl bg-(--code-bg)/90 dark:bg-(--code-bg)/60 border border-glass/10 shadow-xl shadow-black/10 dark:shadow-black/30 ${className}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-glass/5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-danger-400/60" />
            <span className="size-2.5 rounded-full bg-warning-400/60" />
            <span className="size-2.5 rounded-full bg-success-400/60" />
          </div>
          {language && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-(--code-muted) ml-2">
              {language}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md transition-colors cursor-pointer ${
            copied
              ? "text-success-400 bg-success-400/10"
              : "text-(--code-muted) hover:text-(--code-text) hover:bg-neutral-700/50"
          }`}
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied ? "Kopiert!" : "Kopieren"}
        </button>
      </div>

      {/* Code area */}
      <div className="overflow-x-auto glass-scroll-x">
        <pre className="p-4 text-sm leading-relaxed">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex">
                {showLineNumbers && (
                  <span className="select-none text-(--code-muted) text-right w-8 pr-4 shrink-0">
                    {i + 1}
                  </span>
                )}
                <span className="text-(--code-text)">{line || " "}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
