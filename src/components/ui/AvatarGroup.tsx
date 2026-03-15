import { Avatar } from "./Avatar";

interface AvatarGroupItem {
  src?: string | null;
  name: string;
}

interface AvatarGroupProps {
  avatars: AvatarGroupItem[];
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const overflowTextSize: Record<NonNullable<AvatarGroupProps["size"]>, string> =
  {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-sm",
  };

const overlapMargin: Record<NonNullable<AvatarGroupProps["size"]>, string> = {
  sm: "-ml-2",
  md: "-ml-3",
  lg: "-ml-3",
};

const overflowCircleSize: Record<
  NonNullable<AvatarGroupProps["size"]>,
  string
> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-14",
};

export function AvatarGroup({
  avatars,
  max = 4,
  size = "md",
  className = "",
}: AvatarGroupProps): React.ReactElement {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={`flex items-center ${className}`}>
      {visible.map((avatar, index) => (
        <div
          key={avatar.name}
          className={`relative ${index === 0 ? "" : overlapMargin[size]}`}
          style={{ zIndex: visible.length - index }}
        >
          <Avatar
            src={avatar.src}
            name={avatar.name}
            size={size}
            className="ring-2 ring-glass/80 dark:ring-neutral-900/80"
          />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={`relative ${overlapMargin[size]}`}
          style={{ zIndex: 0 }}
        >
          <div
            className={`${overflowCircleSize[size]} ${overflowTextSize[size]} rounded-full flex items-center justify-center font-semibold bg-glass/60 dark:bg-glass/10 border-2 border-glass/80 dark:border-neutral-900/80 text-(--text-muted)`}
          >
            +{remaining}
          </div>
        </div>
      )}
    </div>
  );
}
