"use client";
import { useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { Rating } from "@/components/ui/Rating";
import { Section, DemoRow } from "./Section";

export function AccordionRatingDemo(): React.ReactElement {
  const [ratingValue, setRatingValue] = useState(3);

  return (
    <>
      <Section title="Accordion">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-(--text-muted) mb-3">Single (nur eines offen)</p>
            <Accordion items={[{ value: "faq1", trigger: "Was ist Glass UI?", content: "Ein modernes, glassmorphism-basiertes Design-System für Next.js und Tailwind CSS v4. Alle Komponenten sind copy-paste-ready." }, { value: "faq2", trigger: "Welche Abhängigkeiten gibt es?", content: "Glass UI benötigt nur Tailwind CSS v4 und optional lucide-react für Icons. Keine weiteren externen Bibliotheken." }, { value: "faq3", trigger: "Ist Dark Mode unterstützt?", content: "Ja, alle Komponenten unterstützen Dark Mode nativ über die CSS-Klasse .dark auf dem HTML-Element." }]} defaultValue={["faq1"]} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-(--text-muted) mb-3">Multiple (mehrere offen)</p>
            <Accordion type="multiple" items={[{ value: "m1", trigger: "Erster Abschnitt", content: "Dieser Abschnitt kann gleichzeitig mit anderen geöffnet sein." }, { value: "m2", trigger: "Zweiter Abschnitt", content: "Auch dieser Abschnitt bleibt offen, wenn du den nächsten öffnest." }, { value: "m3", trigger: "Dritter Abschnitt", content: "Alle drei können gleichzeitig angezeigt werden." }]} defaultValue={["m1", "m2"]} />
          </div>
        </div>
      </Section>

      <Section title="Rating">
        <DemoRow label="Interaktiv">
          <Rating value={ratingValue} onChange={setRatingValue} showValue allowHalf />
        </DemoRow>
        <DemoRow label="Größen">
          <Rating value={4} readonly size="sm" />
          <Rating value={4} readonly size="md" />
          <Rating value={4} readonly size="lg" />
        </DemoRow>
        <DemoRow label="Readonly mit Wert">
          <Rating value={4.5} max={5} readonly showValue size="md" />
        </DemoRow>
      </Section>
    </>
  );
}
