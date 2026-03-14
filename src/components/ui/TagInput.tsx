"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  separator?: "comma" | "space" | "both";
  className?: string;
}

export function TagInput({
  tags,
  onTagsChange,
  placeholder = "Tag hinzufügen…",
  maxTags,
  separator = "comma",
  className = "",
}: TagInputProps): React.ReactElement {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addTag(value: string): void {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) return;
    if (maxTags && tags.length >= maxTags) return;
    onTagsChange([...tags, trimmed]);
    setInputValue("");
  }

  function removeTag(index: number): void {
    onTagsChange(tags.filter((_, i) => i !== index));
  }

  function isSeparator(key: string): boolean {
    if (key === "Enter") return true;
    if (key === "," && (separator === "comma" || separator === "both")) return true;
    if (key === " " && (separator === "space" || separator === "both")) return true;
    return false;
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (isSeparator(e.key)) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  }

  const atLimit = maxTags !== undefined && tags.length >= maxTags;

  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 rounded-xl px-3 py-2 min-h-11 cursor-text backdrop-blur-sm bg-white/50 dark:bg-white/6 border border-white/60 dark:border-white/10 focus-within:bg-white/70 dark:focus-within:bg-white/10 focus-within:border-indigo-400/50 dark:focus-within:border-indigo-400/30 focus-within:ring-2 focus-within:ring-indigo-400/20 dark:focus-within:ring-indigo-400/10 transition-all duration-200 ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium bg-indigo-500/10 dark:bg-indigo-400/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/15 dark:border-indigo-400/15"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(i);
            }}
            className="rounded-sm hover:bg-indigo-500/15 dark:hover:bg-indigo-400/20 transition-colors cursor-pointer"
            aria-label={`${tag} entfernen`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      {!atLimit && (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(inputValue)}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-20 bg-transparent outline-none text-sm text-(--text) placeholder:text-(--text-muted) py-0.5"
        />
      )}
    </div>
  );
}
