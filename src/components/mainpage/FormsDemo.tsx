"use client";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Dropdown } from "@/components/ui/Dropdown";
import { FormField } from "@/components/ui/FormField";
import { SearchInput } from "@/components/ui/SearchInput";
import { DatePicker } from "@/components/ui/DatePicker";
import { Switch } from "@/components/ui/Switch";
import { Checkbox } from "@/components/ui/Checkbox";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Card } from "@/components/ui/Card";
import { Section } from "./Section";

export function FormsDemo(): React.ReactElement {
  const [dropdownValue, setDropdownValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [radioValue, setRadioValue] = useState("option1");

  return (
    <>
      <Section title="Formulare">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <FormField label="Name" htmlFor="name" required>
              <Input id="name" placeholder="Max Mustermann" />
            </FormField>
            <FormField label="E-Mail" htmlFor="email" hint="Wir senden keine Spam-Mails.">
              <Input id="email" type="email" placeholder="max@example.com" />
            </FormField>
            <FormField label="Mit Fehler" htmlFor="error-input" error="Diese E-Mail ist bereits vergeben.">
              <Input id="error-input" type="email" defaultValue="existing@example.com" error="Diese E-Mail ist bereits vergeben." />
            </FormField>
            <FormField label="Suche" htmlFor="search">
              <SearchInput id="search" placeholder="Suchen…" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} onClear={() => setSearchValue("")} />
            </FormField>
          </div>
          <div className="space-y-4">
            <FormField label="Rolle (Native Select)" htmlFor="role">
              <Select id="role">
                <option value="">Rolle auswählen…</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </Select>
            </FormField>
            <FormField label="Rolle (Dropdown)" htmlFor="role-dropdown">
              <Dropdown id="role-dropdown" value={dropdownValue} onChange={setDropdownValue} placeholder="Rolle auswählen…" options={[{ value: "admin", label: "Admin" }, { value: "editor", label: "Editor" }, { value: "viewer", label: "Viewer" }, { value: "guest", label: "Gast (deaktiviert)", disabled: true }]} />
            </FormField>
            <FormField label="Datum" htmlFor="date">
              <DatePicker id="date" value={selectedDate} onChange={setSelectedDate} />
            </FormField>
            <FormField label="Nachricht" htmlFor="message">
              <Textarea id="message" placeholder="Deine Nachricht…" rows={4} />
            </FormField>
          </div>
        </div>
      </Section>

      <Section title="Switch, Checkbox & Radio">
        <div className="grid gap-6 sm:grid-cols-3">
          <Card className="p-5 space-y-4">
            <p className="text-sm font-medium text-(--text)">Switch</p>
            <div className="space-y-3">
              <Switch label="E-Mail-Benachrichtigungen" defaultChecked />
              <Switch label="Marketing-E-Mails" />
              <Switch label="Deaktiviert" disabled />
              <Switch label="Klein" size="sm" defaultChecked />
            </div>
          </Card>
          <Card className="p-5 space-y-4">
            <p className="text-sm font-medium text-(--text)">Checkbox</p>
            <div className="space-y-3">
              <Checkbox label="AGB akzeptieren" defaultChecked />
              <Checkbox label="Newsletter abonnieren" />
              <Checkbox label="Deaktiviert" disabled />
            </div>
          </Card>
          <Card className="p-5 space-y-4">
            <p className="text-sm font-medium text-(--text)">Radio Group</p>
            <RadioGroup name="demo-radio" value={radioValue} onChange={setRadioValue} options={[{ value: "option1", label: "Kostenlos" }, { value: "option2", label: "Pro" }, { value: "option3", label: "Enterprise" }, { value: "option4", label: "Deaktiviert", disabled: true }]} />
          </Card>
        </div>
      </Section>
    </>
  );
}
