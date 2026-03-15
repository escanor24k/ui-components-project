interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Separator({
  orientation = "horizontal",
  className = "",
}: SeparatorProps): React.ReactElement {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`w-px self-stretch bg-linear-to-b from-transparent via-neutral-300/70 dark:via-glass/15 to-transparent ${className}`}
      />
    );
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={`h-px w-full bg-linear-to-r from-transparent via-neutral-300/70 dark:via-glass/15 to-transparent ${className}`}
    />
  );
}
