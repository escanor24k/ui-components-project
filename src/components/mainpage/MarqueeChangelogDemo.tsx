import { Marquee } from "@/components/ui/Marquee";
import { ChangelogEntry } from "@/components/ui/ChangelogEntry";
import { Section, DemoRow } from "./Section";

export function MarqueeChangelogDemo(): React.ReactElement {
  return (
    <>
      <Section title="Marquee">
        <DemoRow label="Logo-Stil">
          <div className="w-full">
            <Marquee speed={25}>
              {["React", "Next.js", "Tailwind", "TypeScript", "Prisma", "Vercel"].map((name) => (
                <span key={name} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium backdrop-blur-xl bg-glass/50 dark:bg-glass/6 border border-glass/60 dark:border-glass/10 text-(--text)">
                  {name}
                </span>
              ))}
            </Marquee>
          </div>
        </DemoRow>
        <DemoRow label="Card-Stil (Gegenrichtung)">
          <div className="w-full">
            <Marquee speed={40} direction="right">
              {[
                { title: "Performance", desc: "Blitzschnelle Ladezeiten" },
                { title: "Design", desc: "Modernes Glass-UI" },
                { title: "DX", desc: "Copy-paste ready" },
                { title: "Responsive", desc: "Mobile-first Ansatz" },
                { title: "Dark Mode", desc: "Automatisch integriert" },
              ].map((item) => (
                <div key={item.title} className="w-56 rounded-2xl p-4 backdrop-blur-xl bg-glass/50 dark:bg-glass/6 border border-glass/60 dark:border-glass/10 shadow-lg shadow-black/5 dark:shadow-black/20">
                  <p className="text-sm font-semibold text-(--text)">{item.title}</p>
                  <p className="text-xs text-(--text-muted) mt-1">{item.desc}</p>
                </div>
              ))}
            </Marquee>
          </div>
        </DemoRow>
      </Section>

      <Section title="Changelog">
        <div className="space-y-4 max-w-xl">
          <ChangelogEntry version="v2.1.0" date="14. März 2026" badge="new" title="Toast, Drawer & 9 weitere Komponenten">
            Neue UI-Komponenten: Toast, Drawer, Banner, Empty State, Tag Input, File Dropzone, OTP Input, Description List, Testimonial Card, Marquee und Changelog Entry.
          </ChangelogEntry>
          <ChangelogEntry version="v2.0.0" date="13. März 2026" badge="breaking" title="Tailwind CSS v4 Migration">
            Umstellung auf Tailwind v4 Syntax. Alle Klassen aktualisiert.
          </ChangelogEntry>
          <ChangelogEntry version="v1.2.0" date="12. März 2026" badge="improvement" title="Stepper & Timeline überarbeitet">
            Verbindungslinien korrekt zentriert, optionale Connectors, flexible Layouts.
          </ChangelogEntry>
          <ChangelogEntry version="v1.1.1" date="11. März 2026" badge="fix" title="Dark Mode Fixes">
            Farbkorrekturen im Dark Mode für Badge, Alert und Card.
          </ChangelogEntry>
        </div>
      </Section>
    </>
  );
}
