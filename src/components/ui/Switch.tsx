import { forwardRef, type InputHTMLAttributes } from "react";

interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

const trackSize = {
  sm: "w-8 h-[18px]",
  md: "w-11 h-6",
} as const;

const thumbSize = {
  sm: "size-3.5",
  md: "size-5",
} as const;

const thumbTranslate = {
  sm: "group-has-[:checked]:translate-x-[14px]",
  md: "group-has-[:checked]:translate-x-5",
} as const;

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, size = "md", className = "", disabled, ...props }, ref) => {
    const track =
      `${trackSize[size]} rounded-full transition-colors duration-200 flex items-center group ` +
      "bg-white/40 dark:bg-white/10 border border-white/60 dark:border-white/15 shadow-sm shadow-black/8 dark:shadow-black/20 " +
      "has-[:checked]:bg-indigo-500 dark:has-[:checked]:bg-indigo-400 has-[:checked]:border-indigo-400/50 " +
      "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-400/30";

    const thumb =
      `${thumbSize[size]} bg-white shadow-sm rounded-full transition-[translate] duration-200 ` +
      `translate-x-0.5 ${thumbTranslate[size]}`;

    const content: React.ReactElement = (
      <span
        className={`${track} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input
          ref={ref}
          type="checkbox"
          className="sr-only"
          disabled={disabled}
          {...props}
        />
        <span className={thumb} />
      </span>
    );

    if (label) {
      return (
        <label
          className={`flex items-center gap-2.5 ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${className}`}
        >
          {content}
          <span className="text-sm text-(--text)">{label}</span>
        </label>
      );
    }

    return (
      <label
        className={`inline-flex ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${className}`}
      >
        {content}
      </label>
    );
  }
);

Switch.displayName = "Switch";
