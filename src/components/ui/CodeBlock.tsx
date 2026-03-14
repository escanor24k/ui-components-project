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
    <div className={`relative rounded-2xl overflow-hidden backdrop-blur-2xl bg-slate-900/90 dark:bg-black/60 border border-white/10 shadow-xl shadow-black/10 dark:shadow-black/30 ${className}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-red-400/60" />
            <span className="size-2.5 rounded-full bg-amber-400/60" />
            <span className="size-2.5 rounded-full bg-emerald-400/60" />
          </div>
          {language && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 ml-2">
              {language}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md transition-colors cursor-pointer ${
            copied
              ? "text-emerald-400 bg-emerald-400/10"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied ? "Kopiert!" : "Kopieren"}
        </button>
      </div>

      {/* Code area */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex">
                {showLineNumbers && (
                  <span className="select-none text-slate-500 text-right w-8 pr-4 shrink-0">
                    {i + 1}
                  </span>
                )}
                <span className="text-slate-200">{line || " "}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
