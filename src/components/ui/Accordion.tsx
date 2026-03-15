"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  value: string;
  trigger: ReactNode;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  type?: "single" | "multiple";
  defaultValue?: string[];
  className?: string;
}

function AccordionPanel({
  item,
  isOpen,
  onToggle,
}: {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}): React.ReactElement {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className="border-b border-glass/30 dark:border-glass/8 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium text-(--text) hover:bg-glass/30 dark:hover:bg-glass/5 transition-colors cursor-pointer"
      >
        <span className="min-w-0">{item.trigger}</span>
        <ChevronDown
          className={`size-4 shrink-0 text-(--text-muted) transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className="overflow-hidden transition-[height] duration-300 ease-out"
        style={{ height }}
      >
        <div ref={contentRef}>
          <div className="px-4 pb-4 text-sm text-(--text-muted)">
            {item.content}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Accordion({
  items,
  type = "single",
  defaultValue = [],
  className = "",
}: AccordionProps): React.ReactElement {
  const [openItems, setOpenItems] = useState<Set<string>>(
    new Set(defaultValue)
  );

  function toggle(value: string): void {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        if (type === "single") {
          next.clear();
        }
        next.add(value);
      }
      return next;
    });
  }

  return (
    <div
      className={`rounded-2xl backdrop-blur-2xl bg-linear-to-br from-glass/70 via-glass/50 to-glass/30 dark:from-glass/10 dark:via-glass/6 dark:to-glass/3 border border-glass/60 dark:border-glass/10 shadow-xl shadow-black/5 dark:shadow-black/30 overflow-hidden ${className}`}
    >
      {items.map((item) => (
        <AccordionPanel
          key={item.value}
          item={item}
          isOpen={openItems.has(item.value)}
          onToggle={() => toggle(item.value)}
        />
      ))}
    </div>
  );
}
