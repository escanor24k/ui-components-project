import type { ReactNode } from "react";

interface TimelineItem {
  title: string;
  description?: string;
  content?: ReactNode;
  icon?: ReactNode;
  dotVariant?: "default" | "success" | "warning" | "danger" | "info";
  dotStyle?: "filled" | "outline";
  timestamp?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  align?: "left" | "right" | "center" | "alternate";
  dotStyle?: "filled" | "outline";
  className?: string;
}

const dotVariantFilled: Record<NonNullable<TimelineItem["dotVariant"]>, string> = {
  default: "bg-glass/60 dark:bg-glass/15 border-glass/60 dark:border-glass/20",
  success: "bg-success-500 dark:bg-success-400 border-success-400/30",
  warning: "bg-warning-500 dark:bg-warning-400 border-warning-400/30",
  danger: "bg-danger-500 dark:bg-danger-400 border-danger-400/30",
  info: "bg-primary-500 dark:bg-primary-400 border-primary-400/30",
};

const dotVariantOutline: Record<NonNullable<TimelineItem["dotVariant"]>, string> = {
  default: "bg-transparent border-glass/60 dark:border-glass/20",
  success: "bg-transparent border-success-500 dark:border-success-400",
  warning: "bg-transparent border-warning-500 dark:border-warning-400",
  danger: "bg-transparent border-danger-500 dark:border-danger-400",
  info: "bg-transparent border-primary-500 dark:border-primary-400",
};

function Dot({
  icon,
  variant = "default",
  style = "filled",
}: {
  icon?: ReactNode;
  variant?: TimelineItem["dotVariant"];
  style?: TimelineItem["dotStyle"];
}): React.ReactElement {
  const v = variant ?? "default";

  if (icon) {
    return (
      <div className="size-8 rounded-full flex items-center justify-center shrink-0 bg-linear-to-br from-primary-400 via-primary-500 to-primary-600 text-white shadow-md shadow-primary-500/25 border border-primary-400/30">
        <span className="size-4">{icon}</span>
      </div>
    );
  }

  const colors = style === "outline" ? dotVariantOutline[v] : dotVariantFilled[v];

  return (
    <div
      className={`size-3 rounded-full border-2 shrink-0 ${colors} shadow-sm`}
    />
  );
}

function TimelineEntry({
  item,
  isLeft,
  align,
  globalDotStyle,
  isLast,
}: {
  item: TimelineItem;
  isLeft: boolean;
  align: TimelineProps["align"];
  globalDotStyle: TimelineProps["dotStyle"];
  isLast: boolean;
}): React.ReactElement {
  const dotStyle = item.dotStyle ?? globalDotStyle ?? "filled";
  const hasIcon = !!item.icon;

  const line = !isLast ? (
    <div className="w-px flex-1 bg-glass/30 dark:bg-glass/8" />
  ) : null;

  if (align === "center" || align === "alternate") {
    return (
      <div className={`flex gap-4 ${isLeft ? "flex-row-reverse text-right" : ""}`}>
        <div className="flex-1 min-w-0">
          <div className="pb-8">
            {item.timestamp && (
              <p className="text-xs text-(--text-muted) mb-1">{item.timestamp}</p>
            )}
            <p className="text-sm font-medium text-(--text)">{item.title}</p>
            {item.description && (
              <p className="text-sm text-(--text-muted) mt-0.5">{item.description}</p>
            )}
            {item.content && <div className="mt-2">{item.content}</div>}
          </div>
        </div>
        <div className={`flex flex-col items-center ${hasIcon ? "" : "pt-1.5"}`}>
          <Dot icon={item.icon} variant={item.dotVariant} style={dotStyle} />
          {line}
        </div>
        <div className="flex-1" />
      </div>
    );
  }

  return (
    <div className={`flex gap-4 ${align === "right" ? "flex-row-reverse text-right" : ""}`}>
      <div className={`flex flex-col items-center ${hasIcon ? "" : "pt-1.5"}`}>
        <Dot icon={item.icon} variant={item.dotVariant} style={dotStyle} />
        {line}
      </div>
      <div className="flex-1 min-w-0 pb-8">
        {item.timestamp && (
          <p className="text-xs text-(--text-muted) mb-1">{item.timestamp}</p>
        )}
        <p className="text-sm font-medium text-(--text)">{item.title}</p>
        {item.description && (
          <p className="text-sm text-(--text-muted) mt-0.5">{item.description}</p>
        )}
        {item.content && <div className="mt-2">{item.content}</div>}
      </div>
    </div>
  );
}

export function Timeline({
  items,
  align = "left",
  dotStyle = "filled",
  className = "",
}: TimelineProps): React.ReactElement {
  return (
    <div className={className}>
      {items.map((item, i) => {
        const isLeft = align === "alternate" ? i % 2 === 0 : false;
        return (
          <TimelineEntry
            key={`${item.title}-${i}`}
            item={item}
            isLeft={isLeft}
            align={align}
            globalDotStyle={dotStyle}
            isLast={i === items.length - 1}
          />
        );
      })}
    </div>
  );
}
