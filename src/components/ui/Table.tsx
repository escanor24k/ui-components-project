import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";

type DivProps = HTMLAttributes<HTMLDivElement> & { className?: string };
type TrProps = HTMLAttributes<HTMLTableRowElement> & { className?: string };
type ThProps = ThHTMLAttributes<HTMLTableCellElement> & { className?: string };
type TdProps = TdHTMLAttributes<HTMLTableCellElement> & { className?: string };

export function Table({ className = "", children, ...props }: DivProps): React.ReactElement {
  return (
    <div
      className={`w-full overflow-hidden rounded-2xl backdrop-blur-2xl bg-linear-to-br from-white/70 via-white/50 to-white/30 dark:from-white/10 dark:via-white/6 dark:to-white/3 border border-white/60 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/30 ${className}`}
      {...props}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">{children}</table>
      </div>
    </div>
  );
}

export function TableHeader({ className = "", children, ...props }: DivProps): React.ReactElement {
  return (
    <thead
      className={`border-b border-slate-300/40 dark:border-white/8 bg-white/20 dark:bg-white/3 ${className}`}
      {...(props as HTMLAttributes<HTMLTableSectionElement>)}
    >
      {children}
    </thead>
  );
}

export function TableBody({ className = "", children, ...props }: DivProps): React.ReactElement {
  return (
    <tbody className={`divide-y divide-slate-300/40 dark:divide-white/6 ${className}`} {...(props as HTMLAttributes<HTMLTableSectionElement>)}>
      {children}
    </tbody>
  );
}

export function TableRow({ className = "", children, ...props }: TrProps): React.ReactElement {
  return (
    <tr
      className={`transition-colors hover:bg-white/30 dark:hover:bg-white/5 ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ className = "", children, ...props }: ThProps): React.ReactElement {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--text-muted) ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ className = "", children, ...props }: TdProps): React.ReactElement {
  return (
    <td
      className={`px-4 py-3.5 text-(--text) ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}

export function TableEmpty({
  className = "",
  children,
  ...props
}: DivProps): React.ReactElement {
  return (
    <tr {...(props as HTMLAttributes<HTMLTableRowElement>)}>
      <td
        colSpan={999}
        className={`px-4 py-10 text-center text-sm text-(--text-muted) ${className}`}
      >
        {children ?? "Keine Einträge vorhanden."}
      </td>
    </tr>
  );
}
