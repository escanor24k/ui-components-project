import { Avatar } from "@/components/ui/Avatar";
import { AvatarGroup } from "@/components/ui/AvatarGroup";
import { Badge } from "@/components/ui/Badge";
import { DescriptionList } from "@/components/ui/DescriptionList";
import { Section, DemoRow } from "./Section";

export function DataDisplayDemo(): React.ReactElement {
  return (
    <>
      <Section title="Avatare">
        <DemoRow label="Sizes">
          <Avatar name="Anna Müller" size="sm" />
          <Avatar name="Ben Schmidt" size="md" />
          <Avatar name="Clara Weber" size="lg" />
        </DemoRow>
        <DemoRow label="AvatarGroup">
          <AvatarGroup size="md" avatars={[{ name: "Anna Müller" }, { name: "Ben Schmidt" }, { name: "Clara Weber" }, { name: "David Koch" }, { name: "Eva Fischer" }, { name: "Frank Bauer" }, { name: "Greta Hoffmann" }]} max={5} />
        </DemoRow>
      </Section>

      <Section title="Description List">
        <div className="grid gap-6 sm:grid-cols-2">
          <DescriptionList items={[{ label: "Name", value: "Anna Müller" }, { label: "E-Mail", value: "anna@example.com" }, { label: "Rolle", value: <Badge variant="info">Admin</Badge> }, { label: "Status", value: <Badge variant="success">Aktiv</Badge> }]} />
          <DescriptionList columns={2} items={[{ label: "Umsatz", value: "€ 12.450" }, { label: "Bestellungen", value: "142" }, { label: "Kunden", value: "89" }, { label: "Produkte", value: "24" }]} />
        </div>
      </Section>
    </>
  );
}
