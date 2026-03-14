import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { AvatarGroup } from "@/components/ui/AvatarGroup";
import { Separator } from "@/components/ui/Separator";
import { StatCard } from "@/components/ui/StatCard";
import { PricingCard } from "@/components/ui/PricingCard";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { Users, DollarSign, Activity, BarChart3 } from "lucide-react";
import { Section } from "./Section";

export function CardsDemo(): React.ReactElement {
  return (
    <>
      <Section title="Cards">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Einfache Card</CardTitle>
              <CardDescription>Eine glass-styled Card mit Header und Content.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-(--text-muted)">Der Inhalt kann beliebige Komponenten enthalten – Text, Buttons, Listen, etc.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Mit Avataren</CardTitle>
              <CardDescription>Team-Übersicht mit Avatar-Stack.</CardDescription>
            </CardHeader>
            <CardContent>
              <AvatarGroup size="sm" avatars={[{ name: "Anna Müller" }, { name: "Ben Schmidt" }, { name: "Clara Weber" }, { name: "David Koch" }, { name: "Eva Fischer" }, { name: "Frank Bauer" }]} max={4} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Mit Badge</CardTitle>
                  <CardDescription>Status-Anzeige im Header.</CardDescription>
                </div>
                <Badge variant="success">Aktiv</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-(--text-muted)">Projekt läuft seit 14 Tagen ohne Unterbrechung.</p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" size="sm">Details</Button>
              <Button variant="ghost" size="sm">Archivieren</Button>
            </CardFooter>
          </Card>
        </div>
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar name="Maximilian Reiter" size="lg" />
            <div>
              <p className="font-semibold text-(--text)">Maximilian Reiter</p>
              <p className="text-sm text-(--text-muted)">Senior Developer · Berlin</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <Badge variant="info" className="text-[10px]">TypeScript</Badge>
                <Badge variant="default" className="text-[10px]">Next.js</Badge>
                <Badge variant="success" className="text-[10px]">Verfügbar</Badge>
              </div>
            </div>
          </div>
          <Separator />
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            {[["47", "Projekte"], ["128", "Commits"], ["4.9★", "Bewertung"]].map(([val, label]) => (
              <div key={label}>
                <p className="text-2xl font-bold text-(--text)">{val}</p>
                <p className="text-xs text-(--text-muted)">{label}</p>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      <Section title="Stat Cards">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Benutzer" value="2.847" trend={{ value: 12.5, label: "vs. letzten Monat" }} icon={<Users className="size-5" />} />
          <StatCard label="Umsatz" value="€48.290" trend={{ value: 8.2, label: "vs. letzten Monat" }} icon={<DollarSign className="size-5" />} />
          <StatCard label="Aktive Sessions" value="1.024" trend={{ value: -3.1, label: "vs. gestern" }} icon={<Activity className="size-5" />} />
          <StatCard label="Conversion Rate" value="3.6%" trend={{ value: 0 }} icon={<BarChart3 className="size-5" />} />
        </div>
      </Section>

      <Section title="Pricing Cards">
        <div className="grid gap-6 sm:grid-cols-3 items-start">
          <PricingCard name="Starter" price="0" description="Für kleine Projekte" features={[{ text: "3 Projekte", included: true }, { text: "1 GB Speicher", included: true }, { text: "Community Support", included: true }, { text: "Analytics", included: false }, { text: "Custom Domain", included: false }]} ctaLabel="Kostenlos starten" />
          <PricingCard name="Pro" price="29" description="Für wachsende Teams" highlighted features={[{ text: "Unbegrenzte Projekte", included: true }, { text: "50 GB Speicher", included: true }, { text: "Priority Support", included: true }, { text: "Analytics", included: true }, { text: "Custom Domain", included: true }]} />
          <PricingCard name="Enterprise" price="99" description="Für große Unternehmen" features={[{ text: "Alles aus Pro", included: true }, { text: "500 GB Speicher", included: true }, { text: "24/7 Support", included: true }, { text: "SSO / SAML", included: true }, { text: "SLA Garantie", included: true }]} ctaLabel="Kontakt aufnehmen" />
        </div>
      </Section>

      <Section title="Testimonial Cards">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <TestimonialCard quote="Die beste UI-Bibliothek die ich je benutzt habe. Einfach kopieren und loslegen." author={{ name: "Anna Müller", role: "Frontend Lead", avatar: undefined }} rating={5} />
          <TestimonialCard quote="Glassmorphism endlich sauber umgesetzt. Spart uns Stunden an Entwicklungszeit." author={{ name: "Ben Schmidt", role: "CTO @ Startup" }} rating={4} />
          <TestimonialCard quote="Perfekt für Prototypen und Produktionsanwendungen gleichermaßen." author={{ name: "Clara Weber", role: "Designerin" }} />
        </div>
      </Section>
    </>
  );
}
