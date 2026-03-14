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
      className={`relative backdrop-blur-2xl bg-linear-to-br from-white/70 via-white/50 to-white/30 dark:from-white/10 dark:via-white/6 dark:to-white/3 border border-white/60 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/30 rounded-2xl p-6 flex flex-col ${highlighted ? "ring-2 ring-indigo-400/50 dark:ring-indigo-400/30" : ""} ${className}`}
    >
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-indigo-400 to-indigo-500 text-white text-xs font-medium px-3 py-0.5 rounded-full shadow-sm">
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
                <Check className="size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
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
            ? "bg-linear-to-br from-indigo-400 via-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/40 border border-indigo-400/30 hover:shadow-indigo-500/60 hover:from-indigo-300 hover:to-indigo-500"
            : "backdrop-blur-sm bg-white/50 dark:bg-white/8 border border-white/60 dark:border-white/15 text-(--text) hover:bg-white/70 dark:hover:bg-white/12"
        }`}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
