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
  default: "bg-white/60 dark:bg-white/15 border-white/60 dark:border-white/20",
  success: "bg-emerald-500 dark:bg-emerald-400 border-emerald-400/30",
  warning: "bg-amber-500 dark:bg-amber-400 border-amber-400/30",
  danger: "bg-rose-500 dark:bg-rose-400 border-rose-400/30",
  info: "bg-indigo-500 dark:bg-indigo-400 border-indigo-400/30",
};

const dotVariantOutline: Record<NonNullable<TimelineItem["dotVariant"]>, string> = {
  default: "bg-transparent border-white/60 dark:border-white/20",
  success: "bg-transparent border-emerald-500 dark:border-emerald-400",
  warning: "bg-transparent border-amber-500 dark:border-amber-400",
  danger: "bg-transparent border-rose-500 dark:border-rose-400",
  info: "bg-transparent border-indigo-500 dark:border-indigo-400",
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
      <div className="size-8 rounded-full flex items-center justify-center shrink-0 bg-linear-to-br from-indigo-400 via-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/25 border border-indigo-400/30">
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
    <div className="w-px flex-1 bg-white/30 dark:bg-white/8" />
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
