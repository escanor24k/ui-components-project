"use client";

import type { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}

export function Marquee({
  children,
  speed = 30,
  direction = "left",
  pauseOnHover = true,
  className = "",
}: MarqueeProps): React.ReactElement {
  return (
    <div className={`overflow-hidden ${pauseOnHover ? "group" : ""} ${className}`}>
      <div
        className={`flex w-max ${pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""}`}
        style={{
          animationName: "marquee-scroll",
          animationDuration: `${speed}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        <div className="flex shrink-0 items-center gap-6">
          {children}
        </div>
        <div className="flex shrink-0 items-center gap-6 pl-6" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
