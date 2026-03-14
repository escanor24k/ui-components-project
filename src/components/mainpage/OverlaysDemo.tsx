"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";
import { Popover } from "@/components/ui/Popover";
import { Separator } from "@/components/ui/Separator";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";
import { Drawer, DrawerHeader, DrawerBody, DrawerFooter } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Section, DemoRow } from "./Section";

export function OverlaysDemo(): React.ReactElement {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Section title="Tooltip & Popover">
        <DemoRow label="Tooltip (Hover)">
          <Tooltip content="Oben angezeigt" side="top">
            <Button variant="secondary" size="sm">Top</Button>
          </Tooltip>
          <Tooltip content="Unten angezeigt" side="bottom">
            <Button variant="secondary" size="sm">Bottom</Button>
          </Tooltip>
          <Tooltip content="Links angezeigt" side="left">
            <Button variant="secondary" size="sm">Left</Button>
          </Tooltip>
          <Tooltip content="Rechts angezeigt" side="right">
            <Button variant="secondary" size="sm">Right</Button>
          </Tooltip>
        </DemoRow>
        <DemoRow label="Popover (Klick)">
          <Popover
            align="start"
            trigger={<Button variant="secondary" size="sm">User-Menü</Button>}
          >
            <div className="space-y-1 min-w-40">
              <p className="text-sm font-medium text-(--text) mb-2">Max Mustermann</p>
              <p className="text-xs text-(--text-muted) mb-3">max@example.com</p>
              <Separator />
              <button type="button" className="w-full text-left text-sm text-(--text) hover:bg-white/40 dark:hover:bg-white/8 rounded-lg px-2 py-1.5 transition-colors cursor-pointer mt-1">Profil</button>
              <button type="button" className="w-full text-left text-sm text-(--text) hover:bg-white/40 dark:hover:bg-white/8 rounded-lg px-2 py-1.5 transition-colors cursor-pointer">Einstellungen</button>
              <button type="button" className="w-full text-left text-sm text-rose-600 dark:text-rose-400 hover:bg-white/40 dark:hover:bg-white/8 rounded-lg px-2 py-1.5 transition-colors cursor-pointer">Abmelden</button>
            </div>
          </Popover>
        </DemoRow>
      </Section>

      <Section title="Modal / Dialog">
        <DemoRow label="Modal öffnen">
          <Button onClick={() => setModalOpen(true)}>Dialog öffnen</Button>
        </DemoRow>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <ModalHeader onClose={() => setModalOpen(false)}>Änderungen speichern?</ModalHeader>
          <ModalBody>Du hast ungespeicherte Änderungen. Möchtest du diese speichern, bevor du fortfährst?</ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Abbrechen</Button>
            <Button variant="danger" onClick={() => setModalOpen(false)}>Verwerfen</Button>
            <Button onClick={() => setModalOpen(false)}>Speichern</Button>
          </ModalFooter>
        </Modal>
      </Section>

      <Section title="Drawer / Sheet">
        <DemoRow label="Drawer öffnen">
          <Button size="sm" onClick={() => setDrawerOpen(true)}>Drawer rechts</Button>
        </DemoRow>
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} side="right" size="md">
          <DrawerHeader onClose={() => setDrawerOpen(false)}>Einstellungen</DrawerHeader>
          <DrawerBody>
            <div className="space-y-4">
              <p className="text-sm text-(--text-muted)">Hier könnten Einstellungen, Filter oder Details stehen.</p>
              <Input placeholder="Suche…" />
              <div className="space-y-2">
                <Checkbox label="Benachrichtigungen aktivieren" />
                <Checkbox label="Newsletter abonnieren" />
              </div>
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="ghost" size="sm" onClick={() => setDrawerOpen(false)}>Abbrechen</Button>
            <Button size="sm" onClick={() => setDrawerOpen(false)}>Speichern</Button>
          </DrawerFooter>
        </Drawer>
      </Section>
    </>
  );
}
