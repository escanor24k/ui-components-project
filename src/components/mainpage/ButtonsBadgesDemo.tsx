"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Section, DemoRow } from "./Section";

export function ButtonsBadgesDemo(): React.ReactElement {
  const [isLoading, setIsLoading] = useState(false);

  function handleLoadingDemo(): void {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  }

  return (
    <>
      <Section title="Buttons">
        <DemoRow label="Variants">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="success">Success</Button>
          <Button variant="danger">Danger</Button>
        </DemoRow>
        <DemoRow label="Sizes">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </DemoRow>
        <DemoRow label="States">
          <Button loading={isLoading} onClick={handleLoadingDemo}>
            {isLoading ? "Lädt…" : "Loading Demo"}
          </Button>
          <Button disabled>Disabled</Button>
          <Button variant="secondary" disabled>Disabled Secondary</Button>
        </DemoRow>
      </Section>

      <Section title="Badges">
        <DemoRow label="Variants">
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
        </DemoRow>
        <DemoRow label="Mit Icon-Punkt">
          <Badge variant="success">
            <span className="size-1.5 rounded-full bg-success-500 dark:bg-success-400" />
            Online
          </Badge>
          <Badge variant="danger">
            <span className="size-1.5 rounded-full bg-danger-500 dark:bg-danger-400" />
            Offline
          </Badge>
          <Badge variant="warning">
            <span className="size-1.5 rounded-full bg-warning-500 dark:bg-warning-400" />
            Ausstehend
          </Badge>
        </DemoRow>
      </Section>
    </>
  );
}
