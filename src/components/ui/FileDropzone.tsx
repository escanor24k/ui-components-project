"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText } from "lucide-react";

interface FileDropzoneProps {
  onFilesChange?: (files: File[]) => void;
  accept?: string[];
  maxSize?: number;
  maxFiles?: number;
  className?: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileDropzone({
  onFilesChange,
  accept,
  maxSize,
  maxFiles,
  className = "",
}: FileDropzoneProps): React.ReactElement {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndAdd = useCallback(
    (incoming: File[]): void => {
      setError("");
      const valid: File[] = [];

      for (const file of incoming) {
        if (accept && !accept.some((t) => file.type === t || file.name.endsWith(t))) {
          setError(`Dateityp nicht erlaubt: ${file.name}`);
          continue;
        }
        if (maxSize && file.size > maxSize) {
          setError(`Datei zu groß: ${file.name} (max. ${formatSize(maxSize)})`);
          continue;
        }
        valid.push(file);
      }

      setFiles((prev) => {
        const next = [...prev, ...valid];
        const limited = maxFiles ? next.slice(0, maxFiles) : next;
        onFilesChange?.(limited);
        return limited;
      });
    },
    [accept, maxSize, maxFiles, onFilesChange],
  );

  function removeFile(index: number): void {
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      onFilesChange?.(next);
      return next;
    });
  }

  function handleDrop(e: React.DragEvent): void {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length > 0) validateAndAdd(dropped);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length > 0) validateAndAdd(selected);
    e.target.value = "";
  }

  return (
    <div className={className}>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-primary-400 bg-primary-50/50 dark:bg-primary-950/20 scale-[1.01]"
            : "border-glass/50 dark:border-glass/10 hover:border-primary-400/40 bg-glass/30 dark:bg-glass/3 hover:bg-glass/50 dark:hover:bg-glass/5"
        }`}
      >
        <Upload className={`size-8 transition-colors ${isDragging ? "text-primary-500 dark:text-primary-400" : "text-(--text-muted)"}`} />
        <div className="text-center">
          <p className="text-sm font-medium text-(--text)">
            Dateien hierhin ziehen oder <span className="text-primary-600 dark:text-primary-400 underline underline-offset-2">durchsuchen</span>
          </p>
          {(accept || maxSize) && (
            <p className="text-xs text-(--text-muted) mt-1">
              {accept && accept.join(", ")}
              {accept && maxSize && " · "}
              {maxSize && `max. ${formatSize(maxSize)}`}
            </p>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple={!maxFiles || maxFiles > 1}
          accept={accept?.join(",")}
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {error && (
        <p className="mt-2 text-xs text-danger-600 dark:text-danger-400">{error}</p>
      )}

      {files.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center gap-3 rounded-xl px-3 py-2 bg-glass/40 dark:bg-glass/5 border border-glass/50 dark:border-glass/8"
            >
              <FileText className="size-4 text-(--text-muted) shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-(--text) truncate">{file.name}</p>
                <p className="text-xs text-(--text-muted)">{formatSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="shrink-0 rounded-lg p-1 text-(--text-muted) hover:text-danger-500 hover:bg-glass/40 dark:hover:bg-glass/10 transition-colors cursor-pointer"
                aria-label={`${file.name} entfernen`}
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
