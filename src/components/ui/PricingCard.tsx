import { Check, X } from "lucide-react";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  name: string;
  price: string;
  currency?: string;
  period?: string;
  description?: string;
  features: PricingFeature[];
  ctaLabel?: string;
  onCtaClick?: () => void;
  highlighted?: boolean;
  className?: string;
}

export function PricingCard({
  name,
  price,
  currency = "\u20AC",
  period = "/Monat",
  description,
  features,
  ctaLabel = "Jetzt starten",
  onCtaClick,
  highlighted = false,
  className = "",
}: PricingCardProps): React.ReactElement {
  return (
    <div
      className={`relative backdrop-blur-2xl bg-linear-to-br from-glass/70 via-glass/50 to-glass/30 dark:from-glass/10 dark:via-glass/6 dark:to-glass/3 border border-glass/60 dark:border-glass/10 shadow-xl shadow-black/5 dark:shadow-black/30 rounded-2xl p-6 flex flex-col ${highlighted ? "ring-2 ring-primary-400/50 dark:ring-primary-400/30" : ""} ${className}`}
    >
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-primary-400 to-primary-500 text-white text-xs font-medium px-3 py-0.5 rounded-full shadow-sm">
          Empfohlen
        </span>
      )}

      <p className="text-lg font-semibold text-(--text)">{name}</p>
      {description && (
        <p className="text-sm text-(--text-muted) mt-1">{description}</p>
      )}

      <div className="mt-6 mb-6 flex items-end gap-1">
        <span className="text-2xl font-bold text-(--text)">{currency}</span>
        <span className="text-5xl font-bold tracking-tight text-(--text)">
          {price}
        </span>
        <span className="text-sm text-(--text-muted) mb-1">{period}</span>
      </div>

      <ul className="flex-1 space-y-3 mb-6">
        {features.map((feature) => (
          <li key={feature.text} className="flex items-center gap-2.5 text-sm">
            {feature.included ? (
              <>
                <Check className="size-4 shrink-0 text-success-500 dark:text-success-400" />
                <span className="text-(--text)">{feature.text}</span>
              </>
            ) : (
              <>
                <X className="size-4 shrink-0 text-(--text-muted) opacity-40" />
                <span className="text-(--text-muted) line-through opacity-60">
                  {feature.text}
                </span>
              </>
            )}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onCtaClick}
        className={`w-full mt-auto rounded-xl py-2.5 px-4 text-sm font-medium transition-all duration-200 active:scale-[0.98] cursor-pointer text-center ${
          highlighted
            ? "bg-linear-to-br from-primary-400 via-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/40 border border-primary-400/30 hover:shadow-primary-500/60 hover:from-primary-300 hover:to-primary-500"
            : "backdrop-blur-sm bg-glass/50 dark:bg-glass/8 border border-glass/60 dark:border-glass/15 text-(--text) hover:bg-glass/70 dark:hover:bg-glass/12"
        }`}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
