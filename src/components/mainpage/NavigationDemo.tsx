"use client";
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from "@/components/ui/Breadcrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { Section } from "./Section";

export function NavigationDemo(): React.ReactElement {
  return (
    <>
      <Section title="Breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem href="#">Dashboard</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem href="#">Projekte</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem href="#">Glass UI</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem active>Komponenten</BreadcrumbItem>
        </Breadcrumb>
      </Section>

      <Section title="Tabs">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="analytics">Analyse</TabsTrigger>
            <TabsTrigger value="settings">Einstellungen</TabsTrigger>
            <TabsTrigger value="disabled" disabled>Deaktiviert</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card className="p-5">
              <p className="text-sm text-(--text-muted)">
                Hier ist der Übersicht-Tab. Dieser Inhalt wird nur angezeigt, wenn der Tab aktiv ist.
              </p>
            </Card>
          </TabsContent>
          <TabsContent value="analytics">
            <Card className="p-5">
              <p className="text-sm text-(--text-muted)">
                Analyse-Daten und Statistiken könnten hier angezeigt werden.
              </p>
            </Card>
          </TabsContent>
          <TabsContent value="settings">
            <Card className="p-5">
              <p className="text-sm text-(--text-muted)">
                Einstellungen und Konfigurationsoptionen.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </Section>
    </>
  );
}
