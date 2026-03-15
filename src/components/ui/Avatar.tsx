interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({
  src,
  name,
  size = "md",
  className = "",
}: AvatarProps): React.ReactElement {
  return (
    <div
      className={`${sizes[size]} relative rounded-full overflow-hidden shrink-0 ring-2 ring-glass/50 dark:ring-glass/15 ${className}`}
      title={name}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="size-full object-cover"
        />
      ) : (
        <div className="size-full flex items-center justify-center font-semibold bg-linear-to-br from-primary-400 via-primary-500 to-primary-600 text-white">
          {getInitials(name)}
        </div>
      )}
    </div>
  );
}
