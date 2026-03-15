import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const glassBase =
  "backdrop-blur-2xl bg-linear-to-br from-glass/70 via-glass/50 to-glass/30 " +
  "dark:from-glass/10 dark:via-glass/6 dark:to-glass/3 " +
  "border border-glass/60 dark:border-glass/10 " +
  "shadow-xl shadow-black/5 dark:shadow-black/30 rounded-2xl";

export function Card({ className = "", children, ...props }: CardProps): React.ReactElement {
  return (
    <div className={`${glassBase} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({
  className = "",
  children,
  ...props
}: CardProps): React.ReactElement {
  return (
    <div className={`px-6 py-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { className?: string }): React.ReactElement {
  return (
    <h3
      className={`text-lg font-semibold leading-tight text-(--text) ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { className?: string }): React.ReactElement {
  return (
    <p className={`mt-1 text-sm text-(--text-muted) ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className = "",
  children,
  ...props
}: CardProps): React.ReactElement {
  return (
    <div className={`px-6 pb-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = "",
  children,
  ...props
}: CardProps): React.ReactElement {
  return (
    <div
      className={`px-6 py-4 border-t border-glass/40 dark:border-glass/8 bg-glass/20 dark:bg-glass/3 flex flex-wrap items-center gap-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
