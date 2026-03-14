"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Stepper } from "@/components/ui/Stepper";
import { Package, CreditCard, CheckCircle, Truck } from "lucide-react";
import { Section, DemoRow } from "./Section";

export function StepperDemo(): React.ReactElement {
  const [stepperStep, setStepperStep] = useState(1);

  return (
    <Section title="Stepper">
      <DemoRow label="Horizontal mit Labels rechts">
        <div className="w-full">
          <Stepper
            steps={[
              { label: "Bestellung", description: "Produkte auswählen", icon: <Package className="size-4" /> },
              { label: "Zahlung", description: "Zahlungsmethode wählen", icon: <CreditCard className="size-4" /> },
              { label: "Bestätigung", description: "Bestellung prüfen", icon: <CheckCircle className="size-4" /> },
              { label: "Versand", description: "Lieferung verfolgen", icon: <Truck className="size-4" /> },
            ]}
            currentStep={stepperStep}
          />
          <div className="flex gap-2 mt-6">
            <Button variant="secondary" size="sm" onClick={() => setStepperStep((s) => Math.max(0, s - 1))}>Zurück</Button>
            <Button size="sm" onClick={() => setStepperStep((s) => Math.min(3, s + 1))}>Weiter</Button>
          </div>
        </div>
      </DemoRow>
      <DemoRow label="Horizontal mit Labels unten (ohne Icons)">
        <div className="w-full">
          <Stepper steps={[{ label: "Konto erstellen" }, { label: "Profil einrichten" }, { label: "Fertig" }]} currentStep={1} labelPosition="bottom" />
        </div>
      </DemoRow>
      <DemoRow label="Vertikal">
        <Stepper layout="vertical" steps={[{ label: "Registrierung", description: "Account anlegen" }, { label: "Verifizierung", description: "E-Mail bestätigen" }, { label: "Onboarding", description: "Profil ausfüllen" }, { label: "Abschluss", description: "Bereit!" }]} currentStep={2} />
      </DemoRow>
    </Section>
  );
}
