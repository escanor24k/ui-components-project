"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Toaster, type ToastData } from "@/components/ui/Toast";
import { Banner } from "@/components/ui/Banner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Bell, CheckCircle, AlertTriangle, Inbox, Package, Zap } from "lucide-react";
import { Section, DemoRow } from "./Section";

export function FeedbackDemo(): React.ReactElement {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [bannerVisible, setBannerVisible] = useState(true);

  function addToast(toast: Omit<ToastData, "id">): void {
    setToasts((prev) => [...prev, { ...toast, id: crypto.randomUUID() }]);
  }

  return (
    <>
      <Section title="Toast">
        <Toaster toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
        <DemoRow label="Varianten">
          <Button size="sm" onClick={() => addToast({ title: "Gespeichert", description: "Deine Änderungen wurden übernommen." })}>Default</Button>
          <Button size="sm" variant="ghost" onClick={() => addToast({ variant: "success", title: "Erfolg!", description: "Aktion erfolgreich abgeschlossen." })}>Success</Button>
          <Button size="sm" variant="ghost" onClick={() => addToast({ variant: "warning", title: "Achtung", description: "Bitte überprüfe deine Eingabe." })}>Warning</Button>
          <Button size="sm" variant="ghost" onClick={() => addToast({ variant: "error", title: "Fehler", description: "Etwas ist schiefgelaufen." })}>Error</Button>
          <Button size="sm" variant="ghost" onClick={() => addToast({ variant: "info", title: "Info", description: "Neue Version verfügbar." })}>Info</Button>
        </DemoRow>
        <DemoRow label="Mit Custom Icon & Aktion">
          <Button size="sm" variant="ghost" onClick={() => addToast({ variant: "info", title: "Update", description: "Version 2.0 steht bereit.", icon: <Zap className="size-5 text-primary-500" />, action: { label: "Installieren", onClick: () => {} } })}>Mit Icon + Aktion</Button>
        </DemoRow>
      </Section>

      <Section title="Banner">
        <div className="space-y-3">
          {bannerVisible && (
            <Banner variant="info" icon={<Bell className="size-4" />} action={{ label: "Mehr erfahren", onClick: () => {} }} onDismiss={() => setBannerVisible(false)}>
              Neue Funktionen wurden hinzugefügt. Schau dir die Neuerungen an!
            </Banner>
          )}
          <Banner variant="success" icon={<CheckCircle className="size-4" />}>
            Dein Profil wurde erfolgreich aktualisiert.
          </Banner>
          <Banner variant="warning" icon={<AlertTriangle className="size-4" />}>
            Dein Abo läuft in 3 Tagen ab.
          </Banner>
          <Banner variant="error">
            Verbindung zum Server unterbrochen.
          </Banner>
          {!bannerVisible && (
            <Button size="sm" variant="ghost" onClick={() => setBannerVisible(true)}>Banner zurücksetzen</Button>
          )}
        </div>
      </Section>

      <Section title="Empty State">
        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <EmptyState icon={<Inbox className="size-6" />} title="Keine Nachrichten" description="Du hast aktuell keine neuen Nachrichten. Schau später wieder vorbei." action={<Button size="sm">Nachrichten abrufen</Button>} />
          </Card>
          <Card>
            <EmptyState icon={<Package className="size-6" />} title="Noch keine Produkte" description="Erstelle dein erstes Produkt, um loszulegen." />
          </Card>
        </div>
      </Section>
    </>
  );
}
