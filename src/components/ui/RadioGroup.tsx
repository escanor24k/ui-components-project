interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  orientation?: "vertical" | "horizontal";
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  className = "",
  orientation = "vertical",
}: RadioGroupProps): React.ReactElement {
  return (
    <div
      role="radiogroup"
      className={`flex ${orientation === "horizontal" ? "flex-row" : "flex-col"} gap-3 ${className}`}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex items-center gap-2.5 ${option.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            disabled={option.disabled}
            onChange={() => onChange?.(option.value)}
            className="peer sr-only"
          />
          <span
            className={
              "size-4.5 rounded-full border transition-all duration-200 flex items-center justify-center shrink-0 " +
              "bg-glass/50 dark:bg-glass/6 border-glass/60 dark:border-glass/15 shadow-sm shadow-black/8 dark:shadow-black/20 " +
              "peer-checked:border-primary-500 dark:peer-checked:border-primary-400 " +
              "peer-focus-visible:ring-2 peer-focus-visible:ring-primary-400/30 " +
              "peer-checked:[&>span]:opacity-100 peer-checked:[&>span]:scale-100"
            }
          >
            <span
              className={
                "size-2.5 rounded-full bg-primary-500 dark:bg-primary-400 " +
                "opacity-0 scale-0 " +
                "transition-all duration-200"
              }
            />
          </span>
          <span className="text-sm text-(--text)">{option.label}</span>
        </label>
      ))}
    </div>
  );
}
