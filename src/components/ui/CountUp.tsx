"use client";

import { useState, useEffect, useRef } from "react";

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  separator?: string;
  className?: string;
}

export function CountUp({
  end,
  start = 0,
  duration = 2000,
  prefix = "",
  suffix = "",
  decimals = 0,
  separator = ".",
  className = "",
}: CountUpProps): React.ReactElement {
  const [current, setCurrent] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const startTime = performance.now();
    let animationFrame: number;

    function animate(now: number): void {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCurrent(start + (end - start) * eased);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    }

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, start, end, duration]);

  function formatNumber(n: number): string {
    const fixed = n.toFixed(decimals);
    if (!separator) return fixed;
    const [int, dec] = fixed.split(".");
    const formatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return dec !== undefined ? `${formatted},${dec}` : formatted;
  }

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}{formatNumber(current)}{suffix}
    </span>
  );
}
