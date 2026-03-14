import type { ReactNode } from "react";
import { Check } from "lucide-react";

interface Step {
  label: string;
  description?: string;
  icon?: ReactNode;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  layout?: "horizontal" | "vertical";
  labelPosition?: "right" | "bottom";
  showConnectors?: boolean;
  className?: string;
}

function StepCircle({
  index,
  isActive,
  isCompleted,
  icon,
}: {
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  icon?: ReactNode;
}): React.ReactElement {
  const base =
    "size-9 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold transition-all duration-300 border";

  if (isCompleted) {
    return (
      <span
        className={`${base} bg-linear-to-br from-indigo-400 via-indigo-500 to-indigo-600 text-white border-indigo-400/30 shadow-md shadow-indigo-500/30`}
      >
        {icon ?? <Check className="size-4" />}
      </span>
    );
  }

  if (isActive) {
    return (
      <span
        className={`${base} bg-linear-to-br from-indigo-400 via-indigo-500 to-indigo-600 text-white border-indigo-400/30 shadow-lg shadow-indigo-500/40 ring-4 ring-indigo-400/20 dark:ring-indigo-400/10`}
      >
        {icon ?? index + 1}
      </span>
    );
  }

  return (
    <span
      className={`${base} bg-white/50 dark:bg-white/6 border-white/60 dark:border-white/15 text-(--text-muted) shadow-sm shadow-black/5 dark:shadow-black/15`}
    >
      {icon ?? index + 1}
    </span>
  );
}

function connectorColor(isCompleted: boolean): string {
  return isCompleted
    ? "bg-indigo-500 dark:bg-indigo-400"
    : "bg-white/40 dark:bg-white/10";
}

export function Stepper({
  steps,
  currentStep,
  layout = "horizontal",
  labelPosition = "right",
  showConnectors = true,
  className = "",
}: StepperProps): React.ReactElement {
  const isVertical = layout === "vertical";
  const isLabelBottom = labelPosition === "bottom" && !isVertical;

  /* ── Vertical ── */
  if (isVertical) {
    return (
      <div className={`flex flex-col ${className}`}>
        {steps.map((step, i) => {
          const isActive = i === currentStep;
          const isCompleted = i < currentStep;
          const isLast = i === steps.length - 1;

          return (
            <div key={step.label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <StepCircle index={i} isActive={isActive} isCompleted={isCompleted} icon={step.icon} />
                {showConnectors && !isLast && (
                  <div
                    className={`w-px flex-1 my-1 transition-colors duration-300 ${connectorColor(isCompleted)}`}
                  />
                )}
              </div>
              <div className={`min-w-0 ${isLast ? "" : "pb-6"}`}>
                <p
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive || isCompleted ? "text-(--text)" : "text-(--text-muted)"
                  }`}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-(--text-muted) mt-0.5">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /* ── Horizontal – Labels bottom ── */
  if (isLabelBottom) {
    return (
      <div className={`flex ${className}`}>
        {steps.map((step, i) => {
          const isActive = i === currentStep;
          const isCompleted = i < currentStep;
          const isLast = i === steps.length - 1;

          return (
            <div key={step.label} className={isLast ? "" : "flex-1"}>
              <div className="flex items-center">
                <StepCircle index={i} isActive={isActive} isCompleted={isCompleted} icon={step.icon} />
                {showConnectors && !isLast && (
                  <div
                    className={`flex-1 h-px mx-2 transition-colors duration-300 ${connectorColor(isCompleted)}`}
                  />
                )}
              </div>
              <div className="mt-2">
                <p
                  className={`text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                    isActive || isCompleted ? "text-(--text)" : "text-(--text-muted)"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /* ── Horizontal – Labels right (default) ── */
  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, i) => {
        const isActive = i === currentStep;
        const isCompleted = i < currentStep;
        const isLast = i === steps.length - 1;

        return (
          <div key={step.label} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
            <div className="flex items-center gap-3">
              <StepCircle index={i} isActive={isActive} isCompleted={isCompleted} icon={step.icon} />
              <div className="min-w-0">
                <p
                  className={`text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                    isActive || isCompleted ? "text-(--text)" : "text-(--text-muted)"
                  }`}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-(--text-muted) mt-0.5">{step.description}</p>
                )}
              </div>
            </div>
            {showConnectors && !isLast && (
              <div
                className={`flex-1 h-px mx-3 min-w-4 transition-colors duration-300 ${connectorColor(isCompleted)}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
