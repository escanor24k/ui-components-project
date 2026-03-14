import { Timeline } from "@/components/ui/Timeline";
import { Package, CreditCard, Truck, CheckCircle } from "lucide-react";
import { Section } from "./Section";

export function TimelineDemo(): React.ReactElement {
  return (
    <Section title="Timeline">
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-(--text-muted) mb-4">Links (Filled Dots)</p>
          <Timeline items={[{ title: "Bestellung aufgegeben", description: "Bestellnummer #12345", timestamp: "14. März 2026, 10:00", dotVariant: "info" }, { title: "Zahlung bestätigt", description: "Visa •••• 4242", timestamp: "14. März 2026, 10:02", dotVariant: "success" }, { title: "In Bearbeitung", description: "Wird für den Versand vorbereitet", timestamp: "14. März 2026, 14:30", dotVariant: "warning" }, { title: "Versandt", timestamp: "15. März 2026", dotVariant: "default" }]} />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-(--text-muted) mb-4">Mit Icons</p>
          <Timeline items={[{ title: "Paket bestellt", timestamp: "Mo, 10. März", icon: <Package className="size-4" /> }, { title: "Bezahlt", timestamp: "Mo, 10. März", icon: <CreditCard className="size-4" /> }, { title: "Versendet", timestamp: "Di, 11. März", icon: <Truck className="size-4" /> }, { title: "Zugestellt", timestamp: "Mi, 12. März", icon: <CheckCircle className="size-4" /> }]} />
        </div>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-(--text-muted) mb-4">Alternierend (Outline Dots)</p>
        <Timeline align="alternate" dotStyle="outline" items={[{ title: "Projekt gestartet", description: "Initiales Setup abgeschlossen", dotVariant: "info" }, { title: "MVP fertig", description: "Erste Version deployed", dotVariant: "success" }, { title: "Beta-Phase", description: "Nutzertests gestartet", dotVariant: "warning" }, { title: "Launch", description: "Öffentlicher Release", dotVariant: "success" }]} />
      </div>
    </Section>
  );
}
