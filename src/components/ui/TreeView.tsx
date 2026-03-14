"use client";

import { useState } from "react";
import { ChevronRight, Folder, FolderOpen, FileText } from "lucide-react";
import type { ReactNode } from "react";

interface TreeNode {
  id: string;
  label: string;
  icon?: ReactNode;
  children?: TreeNode[];
}

interface TreeViewProps {
  nodes: TreeNode[];
  defaultExpanded?: string[];
  className?: string;
}

interface TreeItemProps {
  node: TreeNode;
  level: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
}

function TreeItem({ node, level, expanded, onToggle }: TreeItemProps): React.ReactElement {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expanded.has(node.id);

  const defaultIcon = hasChildren
    ? isExpanded
      ? <FolderOpen className="size-4 text-indigo-500 dark:text-indigo-400" />
      : <Folder className="size-4 text-indigo-500 dark:text-indigo-400" />
    : <FileText className="size-4 text-(--text-muted)" />;

  return (
    <div>
      <button
        type="button"
        onClick={() => { if (hasChildren) onToggle(node.id); }}
        className={`w-full flex items-center gap-1.5 py-1.5 px-2 rounded-lg text-sm text-(--text) transition-colors ${
          hasChildren ? "hover:bg-white/40 dark:hover:bg-white/8 cursor-pointer" : "cursor-default"
        }`}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
      >
        <span className={`shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""} ${hasChildren ? "opacity-100" : "opacity-0"}`}>
          <ChevronRight className="size-3.5" />
        </span>
        <span className="shrink-0">{node.icon ?? defaultIcon}</span>
        <span className="truncate">{node.label}</span>
      </button>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeItem key={child.id} node={child} level={level + 1} expanded={expanded} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  );
}

export function TreeView({
  nodes,
  defaultExpanded = [],
  className = "",
}: TreeViewProps): React.ReactElement {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(defaultExpanded));

  function handleToggle(id: string): void {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className={`rounded-2xl backdrop-blur-2xl bg-linear-to-br from-white/70 via-white/50 to-white/30 dark:from-white/10 dark:via-white/6 dark:to-white/3 border border-white/60 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/30 p-2 ${className}`}>
      {nodes.map((node) => (
        <TreeItem key={node.id} node={node} level={0} expanded={expanded} onToggle={handleToggle} />
      ))}
    </div>
  );
}

export type { TreeNode };
