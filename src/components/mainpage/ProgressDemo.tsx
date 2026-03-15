"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Spinner } from "@/components/ui/Spinner";
import { Section, DemoRow } from "./Section";

export function ProgressDemo(): React.ReactElement {
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  function startProgressSimulation(): void {
    setSimulatedProgress(0);
    setIsSimulating(true);
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 8 + 2;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setSimulatedProgress(100);
        setTimeout(() => setIsSimulating(false), 600);
      } else {
        setSimulatedProgress(Math.round(current));
      }
    }, 200);
  }

  return (
    <>
      <Section title="Progress Bar">
        <div className="space-y-5 max-w-lg">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-(--text-muted)">Onboarding – 75%</p>
            <ProgressBar value={75} showLabel />
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-(--text-muted)">Upload – Abgeschlossen</p>
            <ProgressBar value={100} variant="success" showLabel />
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-(--text-muted)">Speicher – Kritisch</p>
            <ProgressBar value={92} variant="danger" showLabel />
          </div>
          <DemoRow label="Größen">
            <div className="w-full space-y-3">
              <ProgressBar value={60} size="sm" />
              <ProgressBar value={60} size="md" />
              <ProgressBar value={60} size="lg" />
            </div>
          </DemoRow>
          <DemoRow label="Prozent in der Bar (md / lg)">
            <div className="w-full space-y-3">
              <ProgressBar value={68} size="md" showInnerLabel />
              <ProgressBar value={42} size="lg" variant="success" showInnerLabel />
            </div>
          </DemoRow>
          <DemoRow label="Simulation (0 – 100%)">
            <div className="w-full space-y-3">
              <ProgressBar value={simulatedProgress} size="lg" variant={simulatedProgress === 100 ? "success" : "default"} showInnerLabel />
              <div className="flex items-center gap-3">
                <Button size="sm" onClick={startProgressSimulation} disabled={isSimulating && simulatedProgress < 100}>
                  {isSimulating && simulatedProgress < 100 ? "Läuft…" : simulatedProgress === 100 ? "Nochmal" : "Starten"}
                </Button>
                {simulatedProgress === 100 && (
                  <span className="text-xs text-success-600 dark:text-success-400 font-medium">Abgeschlossen!</span>
                )}
              </div>
            </div>
          </DemoRow>
        </div>
      </Section>

      <Section title="Spinner">
        <DemoRow label="Größen">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </DemoRow>
      </Section>
    </>
  );
}
