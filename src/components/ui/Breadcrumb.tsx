import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  children: ReactNode;
  className?: string;
}

interface BreadcrumbItemProps {
  href?: string;
  active?: boolean;
  children: ReactNode;
  className?: string;
}

export function Breadcrumb({ children, className = "" }: BreadcrumbProps): React.ReactElement {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-1.5">{children}</ol>
    </nav>
  );
}

export function BreadcrumbSeparator({ className = "" }: { className?: string }): React.ReactElement {
  return (
    <li aria-hidden="true" className={`flex items-center ${className}`}>
      <ChevronRight className="size-3.5 text-(--text-muted) shrink-0" />
    </li>
  );
}

export function BreadcrumbItem({
  href,
  active = false,
  children,
  className = "",
}: BreadcrumbItemProps): React.ReactElement {
  const activeClasses = "font-medium text-(--text)";
  const inactiveClasses =
    "text-(--text-muted) transition-colors hover:text-(--text)";

  const itemClasses = `text-sm ${active ? activeClasses : inactiveClasses} ${className}`;

  return (
    <li className="flex items-center gap-1.5">
      {href && !active ? (
        <a href={href} className={itemClasses}>
          {children}
        </a>
      ) : (
        <span className={itemClasses} aria-current={active ? "page" : undefined}>
          {children}
        </span>
      )}
    </li>
  );
}
