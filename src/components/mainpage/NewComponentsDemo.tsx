"use client";

import { useState, useCallback } from "react";
import { Section, DemoRow } from "./Section";
import { CountUp } from "@/components/ui/CountUp";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { Combobox } from "@/components/ui/Combobox";
import { NumberInput } from "@/components/ui/NumberInput";
import { CopyButton } from "@/components/ui/CopyButton";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { TreeView } from "@/components/ui/TreeView";
import { AutocompleteInput, type AutocompleteOption } from "@/components/ui/AutocompleteInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Users, DollarSign, Activity } from "lucide-react";

const cityOptions: AutocompleteOption[] = [
  { value: "berlin", label: "Berlin", description: "Hauptstadt, 3.6 Mio. Einwohner" },
  { value: "hamburg", label: "Hamburg", description: "Freie und Hansestadt, 1.9 Mio." },
  { value: "muenchen", label: "München", description: "Bayern, 1.5 Mio." },
  { value: "koeln", label: "Köln", description: "Nordrhein-Westfalen, 1.1 Mio." },
  { value: "frankfurt", label: "Frankfurt am Main", description: "Hessen, 753.000" },
  { value: "stuttgart", label: "Stuttgart", description: "Baden-Württemberg, 635.000" },
  { value: "duesseldorf", label: "Düsseldorf", description: "NRW, 620.000" },
  { value: "leipzig", label: "Leipzig", description: "Sachsen, 605.000" },
  { value: "dortmund", label: "Dortmund", description: "NRW, 588.000" },
  { value: "dresden", label: "Dresden", description: "Sachsen, 556.000" },
];

const allUsers: AutocompleteOption[] = [
  { value: "1", label: "Anna Müller", description: "anna@example.com" },
  { value: "2", label: "Ben Schmidt", description: "ben@example.com" },
  { value: "3", label: "Clara Weber", description: "clara@example.com" },
  { value: "4", label: "David Koch", description: "david@example.com" },
  { value: "5", label: "Elena Fischer", description: "elena@example.com" },
  { value: "6", label: "Felix Wagner", description: "felix@example.com" },
  { value: "7", label: "Greta Bauer", description: "greta@example.com" },
  { value: "8", label: "Hannah Richter", description: "hannah@example.com" },
];

const comboboxOptions = [
  { value: "react", label: "React" },
  { value: "nextjs", label: "Next.js" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "SolidJS" },
  { value: "remix", label: "Remix", disabled: true },
];

const sampleCode = `import { Button } from "@/components/ui/Button";

export function App() {
  return (
    <Button variant="primary" size="md">
      Klick mich
    </Button>
  );
}`;

const treeData = [
  {
    id: "src",
    label: "src",
    children: [
      {
        id: "components",
        label: "components",
        children: [
          {
            id: "ui",
            label: "ui",
            children: [
              { id: "button", label: "Button.tsx" },
              { id: "card", label: "Card.tsx" },
              { id: "input", label: "Input.tsx" },
            ],
          },
          {
            id: "layout",
            label: "layout",
            children: [
              { id: "pageheader", label: "PageHeader.tsx" },
            ],
          },
        ],
      },
      {
        id: "app",
        label: "app",
        children: [
          { id: "page", label: "page.tsx" },
          { id: "layout", label: "layout.tsx" },
          { id: "globals", label: "globals.css" },
        ],
      },
    ],
  },
  {
    id: "public",
    label: "public",
    children: [
      { id: "favicon", label: "favicon.ico" },
    ],
  },
  { id: "package", label: "package.json" },
  { id: "tsconfig", label: "tsconfig.json" },
];

export function NewComponentsDemo(): React.ReactElement {
  const [comboValue, setComboValue] = useState("");
  const [quantity, setQuantity] = useState(1);

  // AutocompleteInput – static
  const [citySearch, setCitySearch] = useState("");

  // AutocompleteInput – async simulation
  const [userSearch, setUserSearch] = useState("");
  const [userResults, setUserResults] = useState<AutocompleteOption[]>([]);
  const [userLoading, setUserLoading] = useState(false);

  const handleUserSearch = useCallback((query: string): void => {
    setUserLoading(true);
    // Simulate async API call with 500ms delay
    setTimeout(() => {
      const results = allUsers.filter((u) =>
        u.label.toLowerCase().includes(query.toLowerCase()) ||
        (u.description?.toLowerCase().includes(query.toLowerCase()) ?? false),
      );
      setUserResults(results);
      setUserLoading(false);
    }, 500);
  }, []);

  return (
    <>
      {/* ── CountUp & CircularProgress ── */}
      <Section title="CountUp & Circular Progress">
        <DemoRow label="CountUp – Animierte Zahlen">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <Card className="p-5 text-center">
              <div className="size-9 mx-auto mb-2 rounded-lg bg-indigo-500/10 dark:bg-indigo-400/15 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
                <Users className="size-5" />
              </div>
              <p className="text-xs text-(--text-muted) mb-1">Benutzer</p>
              <CountUp end={12847} separator="." className="text-2xl font-bold text-(--text)" />
            </Card>
            <Card className="p-5 text-center">
              <div className="size-9 mx-auto mb-2 rounded-lg bg-emerald-500/10 dark:bg-emerald-400/15 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
                <DollarSign className="size-5" />
              </div>
              <p className="text-xs text-(--text-muted) mb-1">Umsatz</p>
              <CountUp end={84230} separator="." suffix=" €" className="text-2xl font-bold text-(--text)" />
            </Card>
            <Card className="p-5 text-center">
              <div className="size-9 mx-auto mb-2 rounded-lg bg-amber-500/10 dark:bg-amber-400/15 flex items-center justify-center text-amber-500 dark:text-amber-400">
                <Activity className="size-5" />
              </div>
              <p className="text-xs text-(--text-muted) mb-1">Conversion</p>
              <CountUp end={3.74} decimals={2} suffix="%" className="text-2xl font-bold text-(--text)" />
            </Card>
          </div>
        </DemoRow>

        <DemoRow label="CircularProgress – Varianten & Größen">
          <div className="flex flex-wrap items-end gap-6">
            <div className="flex flex-col items-center gap-1">
              <CircularProgress value={75} showValue />
              <span className="text-xs text-(--text-muted)">Default</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CircularProgress value={90} variant="success" showValue />
              <span className="text-xs text-(--text-muted)">Success</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CircularProgress value={45} variant="warning" showValue />
              <span className="text-xs text-(--text-muted)">Warning</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CircularProgress value={20} variant="danger" showValue />
              <span className="text-xs text-(--text-muted)">Danger</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CircularProgress value={60} size="sm" showValue />
              <span className="text-xs text-(--text-muted)">Small</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CircularProgress value={60} size="lg" showValue strokeWidth={6} />
              <span className="text-xs text-(--text-muted)">Large</span>
            </div>
          </div>
        </DemoRow>
      </Section>

      {/* ── Combobox & NumberInput ── */}
      <Section title="Combobox & Number Input">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Combobox / Autocomplete</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-(--text-muted)">Durchsuchbares Dropdown mit Keyboard-Navigation</p>
              <Combobox
                options={comboboxOptions}
                value={comboValue}
                onChange={setComboValue}
                placeholder="Framework suchen…"
              />
              {comboValue && (
                <p className="text-xs text-(--text-muted)">
                  Ausgewählt: <span className="font-medium text-(--text)">{comboboxOptions.find((o) => o.value === comboValue)?.label}</span>
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Number Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-(--text-muted)">+/- Stepper mit Min/Max</p>
              <div className="space-y-3">
                <DemoRow label="Standard (1–99)">
                  <NumberInput value={quantity} onChange={setQuantity} min={1} max={99} />
                </DemoRow>
                <DemoRow label="Größen">
                  <NumberInput value={5} min={0} max={10} size="sm" />
                  <NumberInput value={5} min={0} max={10} size="md" />
                  <NumberInput value={5} min={0} max={10} size="lg" />
                </DemoRow>
                <DemoRow label="Disabled">
                  <NumberInput value={42} disabled />
                </DemoRow>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* ── CopyButton & CodeBlock ── */}
      <Section title="Copy Button & Code Block">
        <DemoRow label="CopyButton – Verschiedene Größen">
          <CopyButton text="npm install glass-ui" size="sm" />
          <CopyButton text="npx create-next-app@latest" />
          <CopyButton text="Hallo Welt!" label="Text kopieren" />
        </DemoRow>

        <DemoRow label="CodeBlock – Formatierter Code mit Copy">
          <div className="w-full max-w-2xl">
            <CodeBlock code={sampleCode} language="tsx" showLineNumbers />
          </div>
        </DemoRow>

        <DemoRow label="CodeBlock – Ohne Zeilennummern">
          <div className="w-full max-w-lg">
            <CodeBlock code={`npm install lucide-react\nnpm run dev`} language="bash" />
          </div>
        </DemoRow>
      </Section>

      {/* ── AutocompleteInput ── */}
      <Section title="Autocomplete Input">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Statische Vorschläge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-(--text-muted)">Stadtsuche – clientseitige Filterung</p>
              <AutocompleteInput
                options={cityOptions}
                value={citySearch}
                onChange={setCitySearch}
                placeholder="Stadt suchen…"
                emptyMessage="Keine Stadt gefunden."
              />
              {citySearch && (
                <p className="text-xs text-(--text-muted)">
                  Eingabe: <span className="font-medium text-(--text)">{citySearch}</span>
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Async-Suche (Nutzer)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-(--text-muted)">Simulierter API-Call mit 500ms Delay</p>
              <AutocompleteInput
                options={userResults}
                value={userSearch}
                onChange={setUserSearch}
                onSearch={handleUserSearch}
                loading={userLoading}
                placeholder="Nutzer suchen…"
                debounceMs={300}
                minChars={2}
              />
              {userSearch && (
                <p className="text-xs text-(--text-muted)">
                  Eingabe: <span className="font-medium text-(--text)">{userSearch}</span>
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* ── TreeView ── */}
      <Section title="Tree View">
        <DemoRow label="Hierarchische Baumstruktur (Datei-Explorer)">
          <div className="w-full max-w-sm">
            <TreeView
              nodes={treeData}
              defaultExpanded={["src", "components", "ui"]}
            />
          </div>
        </DemoRow>
      </Section>
    </>
  );
}
